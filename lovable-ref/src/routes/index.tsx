import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from '@/components/talqa/features';
export const Route = createFileRoute("/")({
  head: () => ({meta:[{title:'طلقة نت | عالمك المتصل'},{name:'description',content:'خدمات شبكة طلقة نت: استراحة، بث مباريات، فحص سرعة ومكافآت الانتماء.'},{property:'og:title',content:'طلقة نت | عالمك المتصل'},{property:'og:description',content:'اتصال، ترفيه ومكافآت في مكان واحد.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),
  component: HomePage,
});
