import type { Metadata } from 'next';
import { LoungePage } from '@/src/components/talqa/Features';

export const metadata: Metadata = {
  title: 'الاستراحة | طلقة نت',
  description: 'استراحة طلقة نت: تحديات ذاكرة وألعاب خفيفة.',
  openGraph: {
    title: 'الاستراحة | طلقة نت',
    description: 'خذ بريك وغيّر جو مع طلقة نت.',
  },
};

export default function Lounge() {
  return <LoungePage />;
}
