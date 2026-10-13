import { createFileRoute } from '@tanstack/react-router';
import { SpeedPage } from '@/components/talqa/features';
export const Route=createFileRoute('/speed')({head:()=>({meta:[{title:'فحص سرعة الإنترنت | طلقة نت'},{name:'description',content:'اختبر سرعة تنزيل الإنترنت وزمن الاستجابة مع طلقة نت.'},{property:'og:title',content:'فحص سرعة الإنترنت | طلقة نت'},{property:'og:description',content:'قوة اتصالك بالأرقام مع فحص مباشر للسرعة.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),component:SpeedPage});
