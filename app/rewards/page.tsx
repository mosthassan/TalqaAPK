import type { Metadata } from 'next';
import { RewardsPage } from '@/src/components/talqa/Features';

export const metadata: Metadata = {
  title: 'مكافآت الانتماء | طلقة نت',
  description: 'اجمع عشرة كروت مستخدمة وشارك في عجلة مكافآت طلقة نت بفئات 200 و500 و1000.',
  openGraph: {
    title: 'مكافآت الانتماء | طلقة نت',
    description: 'عشرة كروت، لفة واحدة، ومكافأة لانتمائك.',
  },
};

export default function Rewards() {
  return <RewardsPage />;
}
