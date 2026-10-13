import { createFileRoute } from '@tanstack/react-router';
import { RewardsPage } from '@/components/talqa/features';
export const Route=createFileRoute('/rewards')({head:()=>({meta:[{title:'مكافآت الانتماء | طلقة نت'},{name:'description',content:'اجمع عشرة كروت مستخدمة وشارك في عجلة مكافآت طلقة نت بفئات 200 و500 و1000.'},{property:'og:title',content:'مكافآت الانتماء | طلقة نت'},{property:'og:description',content:'عشرة كروت، لفة واحدة، ومكافأة لانتمائك.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),component:RewardsPage});
