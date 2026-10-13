'use client';

import React from 'react';
import { NETWORK_LINKS } from '@/src/config/links';
import { Tv, Radio, ShieldCheck, Wifi } from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Badge } from '@/src/components/ui/Badge';
import { EmptyState } from '@/src/components/ui/EmptyState';

export const MatchesView: React.FC = () => {
  return (
    <div className="space-y-4 pb-24">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#1C1917] tracking-tight font-heading">
            بث المباريات المباشر
          </h2>
          <Badge variant="network" size="sm">
            المرحلة 2
          </Badge>
        </div>
        <p className="text-xs text-[#57534E] mt-0.5 leading-relaxed">
          مشغل HLS محلي عالي الدقة بدون تقطيع وبدون استهلاك لرصيد الباقة أثناء قمم البطولات.
        </p>
      </div>

      {/* Honest EmptyState */}
      <EmptyState
        icon={<Tv className="w-6 h-6 text-[#0284C7]" strokeWidth={2} />}
        phaseBadge="المرحلة 2 — قيد ربط مشغل HLS"
        title="قنوات البث المباشر (HLS)"
        description="يجري في المرحلة 2 إعداد مشغل الفيديو المتوافق مع بروتوكول HLS للاتصال بسيرفر البث المحلي (beIN Sports 1, 2 و SSC) بجدول مباريات حي بدون نتائج أو أرقام وهمية."
        networkNotice="يعمل البث المباشر المحلي عبر خادم الشبكة 192.168.50.2:8888 حصرياً داخل شبكة واي فاي طلقة نت."
      />

      {/* Planned Channels Preview List */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#57534E] px-1 font-heading">
          القنوات المجدولة للبث
        </h3>

        <div className="space-y-2">
          <Card variant="surface" padding="sm" className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#E0F2FE] text-[#0369A1] flex items-center justify-center font-bold text-xs font-heading">
                1
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1C1917] font-heading">beIN Sports 1 HD</h4>
                <p className="text-[11px] text-[#57534E]">دوري أبطال أوروبا والقمم العالمية</p>
              </div>
            </div>
            <Badge variant="network" size="sm">
              سيرفر LAN
            </Badge>
          </Card>

          <Card variant="surface" padding="sm" className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#E0F2FE] text-[#0369A1] flex items-center justify-center font-bold text-xs font-heading">
                2
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1C1917] font-heading">beIN Sports 2 HD</h4>
                <p className="text-[11px] text-[#57534E]">الدوري الإنجليزي والإسباني</p>
              </div>
            </div>
            <Badge variant="network" size="sm">
              سيرفر LAN
            </Badge>
          </Card>

          <Card variant="surface" padding="sm" className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#E0F2FE] text-[#0369A1] flex items-center justify-center font-bold text-xs font-heading">
                3
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1C1917] font-heading">SSC Sports 1 HD</h4>
                <p className="text-[11px] text-[#57534E]">الدوري السعودي والبطولات الآسيوية</p>
              </div>
            </div>
            <Badge variant="network" size="sm">
              سيرفر LAN
            </Badge>
          </Card>
        </div>
      </div>
    </div>
  );
};
