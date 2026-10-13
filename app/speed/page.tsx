import type { Metadata } from 'next';
import { SpeedPage } from '@/src/components/talqa/Features';

export const metadata: Metadata = {
  title: 'فحص سرعة الإنترنت | طلقة نت',
  description: 'اختبر سرعة تنزيل الإنترنت وزمن الاستجابة مع طلقة نت.',
  openGraph: {
    title: 'فحص سرعة الإنترنت | طلقة نت',
    description: 'قوة اتصالك بالأرقام مع فحص مباشر للسرعة.',
  },
};

export default function Speed() {
  return <SpeedPage />;
}
