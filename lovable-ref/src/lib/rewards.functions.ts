import { createServerFn } from '@tanstack/react-start';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { validateCards } from './rewards';
export const claimReward = createServerFn({ method: 'POST' })
.middleware([requireSupabaseAuth])
.inputValidator((input: { codes: string[] }) => { const error = validateCards(input.codes); if(error) throw new Error(error); return input; })
.handler(async ({ data, context }) => {
 const hashes = await Promise.all(data.codes.map(async code => {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(code.trim()));
  return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2,'0')).join('');
 }));
 const { data: result, error } = await context.supabase.rpc('claim_network_reward', { hashes });
 if(error) return { error: 'تعذر التحقق من الكروت. حاول مرة أخرى.' };
 return result as { error?: string; value?: number; code?: string; id?: string };
});
