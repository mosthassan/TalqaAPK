import { createFileRoute } from '@tanstack/react-router';
import { LoungePage } from '@/components/talqa/features';
export const Route=createFileRoute('/lounge')({head:()=>({meta:[{title:'الاستراحة | طلقة نت'},{name:'description',content:'استراحة طلقة نت: تحديات ذاكرة وألعاب خفيفة.'},{property:'og:title',content:'الاستراحة | طلقة نت'},{property:'og:description',content:'خذ بريك وغيّر جو مع طلقة نت.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),component:LoungePage});
