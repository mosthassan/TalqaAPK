import { createFileRoute } from '@tanstack/react-router';
import { LiveSection,PageHeading } from '@/components/talqa/features';
export const Route=createFileRoute('/live')({head:()=>({meta:[{title:'البث المباشر | طلقة نت'},{name:'description',content:'مركز بث المباريات وأجواء كرة القدم في طلقة نت.'},{property:'og:title',content:'البث المباشر | طلقة نت'},{property:'og:description',content:'عش حماس المباريات مع شبكة طلقة نت.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),component:Live});
function Live(){return <><PageHeading eyebrow="البث المباشر" title="ملعبك، أينما كنت." description="كل حماس كرة القدم، في مكان واحد."/><LiveSection/></>;}
