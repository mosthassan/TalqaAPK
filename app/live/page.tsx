import type { Metadata } from 'next';
import { PageHeading, LiveSection } from '@/src/components/talqa/Features';

export const metadata: Metadata = {
  title: 'البث المباشر | طلقة نت',
  description: 'مركز بث المباريات وأجواء كرة القدم في طلقة نت.',
  openGraph: {
    title: 'البث المباشر | طلقة نت',
    description: 'عش حماس المباريات مع شبكة طلقة نت.',
  },
};

export default function LivePage() {
  return (
    <>
      <PageHeading
        eyebrow="البث المباشر"
        title="ملعبك، أينما كنت."
        description="كل حماس كرة القدم، في مكان واحد."
      />
      <LiveSection />
    </>
  );
}
