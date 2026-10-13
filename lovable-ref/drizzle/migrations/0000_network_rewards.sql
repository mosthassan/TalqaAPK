CREATE TABLE public.network_cards (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), code_hash text NOT NULL UNIQUE, is_used boolean NOT NULL DEFAULT false, claimed_by uuid, claimed_at timestamptz);
GRANT ALL ON public.network_cards TO service_role;
ALTER TABLE public.network_cards ENABLE ROW LEVEL SECURITY;
CREATE TABLE public.prize_cards (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), value integer NOT NULL CHECK (value IN (200,500,1000)), code text NOT NULL, awarded_to uuid, awarded_at timestamptz);
GRANT ALL ON public.prize_cards TO service_role;
ALTER TABLE public.prize_cards ENABLE ROW LEVEL SECURITY;
CREATE TABLE public.reward_claims (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL, prize_id uuid NOT NULL REFERENCES public.prize_cards(id), value integer NOT NULL CHECK (value IN (200,500,1000)), created_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT ON public.reward_claims TO authenticated;
GRANT ALL ON public.reward_claims TO service_role;
ALTER TABLE public.reward_claims ENABLE ROW LEVEL SECURITY;
CREATE POLICY own_rewards ON public.reward_claims FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE FUNCTION public.claim_network_reward(hashes text[]) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE matched integer; prize public.prize_cards; claim_id uuid;
BEGIN
IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Sign in required'; END IF;
IF cardinality(hashes) <> 10 OR (SELECT count(DISTINCT h) FROM unnest(hashes) h) <> 10 THEN RAISE EXCEPTION 'Exactly ten unique cards required'; END IF;
PERFORM id FROM public.network_cards WHERE code_hash = ANY(hashes) ORDER BY id FOR UPDATE;
SELECT count(*) INTO matched FROM public.network_cards WHERE code_hash = ANY(hashes) AND is_used AND claimed_by IS NULL;
IF matched <> 10 THEN RETURN jsonb_build_object('error','الكروت غير صالحة أو سبق استخدامها للمكافآت.'); END IF;
SELECT * INTO prize FROM public.prize_cards WHERE awarded_to IS NULL ORDER BY random() LIMIT 1 FOR UPDATE SKIP LOCKED;
IF prize.id IS NULL THEN RETURN jsonb_build_object('error','مخزون المكافآت غير متاح حاليًا، لم يتم احتساب كروتك.'); END IF;
UPDATE public.network_cards SET claimed_by = auth.uid(), claimed_at = now() WHERE code_hash = ANY(hashes);
UPDATE public.prize_cards SET awarded_to = auth.uid(), awarded_at = now() WHERE id = prize.id;
INSERT INTO public.reward_claims(user_id,prize_id,value) VALUES(auth.uid(),prize.id,prize.value) RETURNING id INTO claim_id;
RETURN jsonb_build_object('id',claim_id,'value',prize.value,'code',prize.code);
END; $$;
REVOKE ALL ON FUNCTION public.claim_network_reward(text[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_network_reward(text[]) TO authenticated;