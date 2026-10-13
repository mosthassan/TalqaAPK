'use client';

import React from 'react';
import { NETWORK_LINKS } from '@/src/config/links';
import { Film, Download, Gamepad2, Wifi, ShieldAlert } from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Badge } from '@/src/components/ui/Badge';
import { EmptyState } from '@/src/components/ui/EmptyState';

export const LoungeView: React.FC = () => {
  return (
    <div className="space-y-4 pb-24">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#1C1917] tracking-tight font-heading">
            استراحة طلقة نت
          </h2>
          <Badge variant="gold" size="sm">
            المرحلة 2
          </Badge>
        </div>
        <p className="text-xs text-[#57534E] mt-0.5 leading-relaxed">
          بوابة الترفيه المحلية: مكتبة وسائط Jellyfin وتنزيلات ألعاب وتطبيقات سريعة بدون استهلاك رصيد.
        </p>
      </div>

      {/* LAN Notice */}
      <div className="p-4 bg-[#F8F8F7] rounded-[20px] border border-[#E7E5E4] space-y-1.5 text-xs text-[#57534E]">
        <div className="flex items-center gap-2 text-xs font-bold text-[#1C1917] font-heading">
          <Wifi className="w-4 h-4 text-[#0284C7]" strokeWidth={2} />
          <span>خدمة الخادم المحلي (LAN)</span>
        </div>
        <p className="leading-relaxed">
          تعمل خدمات الاستراحة عبر السيرفر الداخلي <code>{NETWORK_LINKS.localServer.mediaServer}</code>. ستكون متاحة حصرياً للأجهزة المتصلة براوترات طلقة نت الداخلية.
        </p>
      </div>

      {/* Honest EmptyState */}
      <EmptyState
        icon={<Film className="w-6 h-6 text-[#C59424]" strokeWidth={2} />}
        phaseBadge="المرحلة 2 — قيد التجهيز الفني"
        title="خادم الوسائط والتنزيلات المحلية"
        description="يجري تجهيز واجهة المشغل التفاعلي وفاحص الاتصال التلقائي (LAN Connectivity Detector) لربط مكتبة Jellyfin وتنزيل ملفات الألعاب الكبيرة بسرعة الشبكة الداخلية القصوى."
        networkNotice="سيتم التحقق من اتصالك بالشبكة الداخلية قبل بدء التشغيل لتفادي قيود Mixed Content في المتصفحات."
      />

      {/* Planned Sections Preview */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#57534E] px-1 font-heading">
          المحتوى المجدول
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <Card variant="surface" padding="md" className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4 text-[#0284C7]" strokeWidth={2} />
              <h4 className="text-xs font-bold text-[#1C1917] font-heading">
                خادم الأفلام (Jellyfin)
              </h4>
            </div>
            <p className="text-xs text-[#57534E] leading-relaxed">
              أفلام ومسلسلات بجودة عالية وترجمة عربية على السيرفر المحلي.
            </p>
          </Card>

          <Card variant="surface" padding="md" className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Gamepad2 className="w-4 h-4 text-[#C59424]" strokeWidth={2} />
              <h4 className="text-xs font-bold text-[#1C1917] font-heading">
                تنزيلات الألعاب والتطبيقات
              </h4>
            </div>
            <p className="text-xs text-[#57534E] leading-relaxed">
              تحديثات PUBG وFree Fire وتطبيق الشبكة مباشرة من الخادم الداخلي.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};
