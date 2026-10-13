'use client';

import React, { useState } from 'react';
import { CARD_PACKAGES } from '@/src/data/packages';
import { PROVISIONAL_DISTRIBUTORS } from '@/src/data/distributors';
import { CardPackage } from '@/src/types';
import { NETWORK_LINKS } from '@/src/config/links';
import {
  Clock,
  Calendar,
  Wifi,
  MapPin,
  MessageCircle,
  Phone,
  Check,
  ShieldAlert,
  ArrowUpRight,
  ChevronLeft,
} from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Badge } from '@/src/components/ui/Badge';
import { Button } from '@/src/components/ui/Button';
import { Chip } from '@/src/components/ui/Chip';
import { Sheet } from '@/src/components/ui/Sheet';

export const PackagesView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPackage, setSelectedPackage] = useState<CardPackage | null>(null);
  const [isDistributorsSheetOpen, setIsDistributorsSheetOpen] = useState(false);

  const filterCategories = [
    { id: 'all', label: 'الكل' },
    { id: 'hours', label: 'الساعات' },
    { id: 'daily', label: 'اليومية' },
    { id: 'weekly', label: 'الأسبوعية' },
    { id: 'monthly', label: 'شهرية VIP' },
  ];

  const filteredPackages =
    selectedCategory === 'all'
      ? CARD_PACKAGES
      : CARD_PACKAGES.filter((p) => p.category === selectedCategory);

  const getCapacityPercent = (pkgId: string) => {
    switch (pkgId) {
      case 'pkg-200':
        return '20%';
      case 'pkg-500':
        return '45%';
      case 'pkg-1000':
        return '65%';
      case 'pkg-4000':
        return '100%';
      default:
        return '30%';
    }
  };

  const handleCardClick = (pkg: CardPackage) => {
    setSelectedPackage(pkg);
  };

  return (
    <div className="space-y-4 pb-24">
      {/* View Header */}
      <div>
        <h2 className="text-xl font-bold text-[#0B1220] tracking-tight font-heading">
          باقات وكروت طلقة نت
        </h2>
        <p className="text-xs text-[#5B6676] mt-0.5 leading-relaxed">
          فئات مدروسة للتصفح، الألعاب، وبث الفيديو بجودة عالية.
        </p>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {filterCategories.map((cat) => (
          <Chip
            key={cat.id}
            label={cat.label}
            selected={selectedCategory === cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            size="md"
          />
        ))}
      </div>

      {/* Packages Grid */}
      <div className="space-y-3">
        {filteredPackages.map((pkg) => {
          const isFeatured = pkg.id === 'pkg-500';
          const capacityWidth = getCapacityPercent(pkg.id);

          return (
            <div
              key={pkg.id}
              onClick={() => handleCardClick(pkg)}
              className={`p-5 rounded-[24px] bg-white transition-all tap-press cursor-pointer relative ${
                isFeatured
                  ? 'border-2 border-[#C59424] shadow-md shadow-[#C59424]/10 bg-gradient-to-b from-[#FEFDF9] to-white'
                  : 'border border-[#E7E5E4] hover:border-[#D6D3D1]'
              }`}
            >
              {/* Badge for Featured / Best Value */}
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs text-[#57534E] font-medium font-heading">
                  {pkg.categoryLabel}
                </span>

                {isFeatured ? (
                  <Badge variant="gold-solid" size="sm">
                    الأكثر طلباً
                  </Badge>
                ) : pkg.id === 'pkg-4000' ? (
                  <Badge variant="gold-solid" size="sm">
                    VIP شهري
                  </Badge>
                ) : null}
              </div>

              {/* Price (Huge Readex Pro typography) */}
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-3xl sm:text-4xl font-bold text-[#1C1917] tracking-tight font-heading">
                  {pkg.price}
                </span>
                <span className="text-xs font-semibold text-[#8C6311] whitespace-nowrap">
                  ريال يمني
                </span>
              </div>

              {/* Relative Capacity Bar */}
              <div className="space-y-1 mb-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#1C1917] font-heading">
                    {pkg.dataLimitLabel}
                  </span>
                  <span className="text-[11px] text-[#57534E] whitespace-nowrap">
                    سعة الرصيد
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#F8F8F7] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      isFeatured ? 'bg-gradient-to-r from-[#D4AF37] to-[#C59424]' : 'bg-[#0284C7]'
                    }`}
                    style={{ width: capacityWidth }}
                  />
                </div>
              </div>

              {/* Spec Rows */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#E7E5E4] text-[11px] text-[#57534E]">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#57534E] shrink-0" strokeWidth={1.75} />
                  <span className="truncate">{pkg.durationLabel}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#57534E] shrink-0" strokeWidth={1.75} />
                  <span className="truncate">{pkg.validityDaysLabel}</span>
                </div>
                <div className="flex items-center gap-1.5 justify-end">
                  <Wifi className="w-3.5 h-3.5 text-[#0284C7] shrink-0" strokeWidth={1.75} />
                  <span className="truncate whitespace-nowrap">{pkg.speedLimitLabel}</span>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-end text-xs font-bold text-[#C59424]">
                <span>التفاصيل والشراء</span>
                <ChevronLeft className="w-3.5 h-3.5 text-[#C59424] mr-1" strokeWidth={2} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Package Detail Bottom Sheet */}
      <Sheet
        isOpen={selectedPackage !== null}
        onClose={() => setSelectedPackage(null)}
        title={selectedPackage?.name}
        subtitle={`${selectedPackage?.price} ريال يمني — تفاصيل الكرت وطرق الشراء`}
      >
        {selectedPackage && (
          <div className="space-y-4 py-1 text-right">
            {/* Quick Specs Overview */}
            <div className="p-4 bg-[#F4F6F8] rounded-[20px] border border-[#E3E8EE] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#5B6676]">حجم الرصيد</span>
                <span className="text-sm font-bold text-[#0B1220] font-heading">
                  {selectedPackage.dataLimitLabel}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#5B6676]">وقت الاستخدام المتاح</span>
                <span className="text-xs font-semibold text-[#0B1220]">
                  {selectedPackage.durationLabel}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#5B6676]">فترة الصلاحية</span>
                <span className="text-xs font-semibold text-[#0B1220]">
                  {selectedPackage.validityDaysLabel}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#5B6676]">السرعة القصوى</span>
                <span className="text-xs font-semibold text-[#0B1220] whitespace-nowrap">
                  {selectedPackage.speedLimitLabel}
                </span>
              </div>
            </div>

            {/* Features List */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-[#0B1220]">المميزات المشمولة:</div>
              <ul className="space-y-1.5 text-xs text-[#5B6676]">
                {selectedPackage.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#7EC400] shrink-0" strokeWidth={2} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2">
              <a
                href={NETWORK_LINKS.support.whatsappMessageUrl(
                  `مرحباً طلقة نت، أود طلب كرت "${selectedPackage.name}" بسعر ${selectedPackage.price} ريال يمني.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#C59424] to-[#B58218] hover:brightness-105 active:scale-98 text-white text-xs font-bold shadow-md shadow-[#C59424]/20 border border-[#B58218] tap-press cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-white" strokeWidth={2} />
                <span>طلب الكرت عبر واتساب</span>
              </a>

              <Button
                variant="secondary"
                fullWidth
                size="md"
                onClick={() => {
                  setSelectedPackage(null);
                  setIsDistributorsSheetOpen(true);
                }}
                leftIcon={<MapPin className="w-4 h-4 text-[#C59424]" strokeWidth={1.75} />}
              >
                شراء من أقرب نقطة توزيع
              </Button>
            </div>
          </div>
        )}
      </Sheet>

      {/* Distributors Bottom Sheet */}
      <Sheet
        isOpen={isDistributorsSheetOpen}
        onClose={() => setIsDistributorsSheetOpen(false)}
        title="نقاط توزيع كروت طلقة نت"
        subtitle="مراكز التوزيع المعتمدة في مأرب"
      >
        <div className="space-y-3.5 py-1 text-right">
          <div className="p-3 bg-[#FFFBEB] border border-[#FDE68A] rounded-[14px] text-xs text-[#78350F] leading-relaxed flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" strokeWidth={1.75} />
            <span>
              بيانات أولية تجريبية قيد الاعتماد من صاحب الشبكة. ستضاف الخريطة التفاعلية في المرحلة 2.
            </span>
          </div>

          <div className="space-y-2.5">
            {PROVISIONAL_DISTRIBUTORS.map((dist) => (
              <div
                key={dist.id}
                className="p-3.5 bg-white border border-[#E7E5E4] rounded-[18px] space-y-1.5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-[#1C1917] font-heading">{dist.name}</h4>
                    <p className="text-[11px] text-[#57534E]">{dist.ownerName}</p>
                  </div>
                  <Badge variant="neutral" size="sm">
                    {dist.neighborhood}
                  </Badge>
                </div>

                <div className="text-[11px] text-[#57534E] flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-[#C59424] shrink-0" strokeWidth={1.75} />
                  <span>{dist.address}</span>
                </div>

                <div className="pt-1 flex gap-2">
                  <a
                    href={`tel:${dist.phone.replace(/\s+/g, '')}`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-full bg-[#F8F8F7] text-[#1C1917] text-xs font-semibold hover:bg-[#E7E5E4] border border-[#E7E5E4]"
                  >
                    <Phone className="w-3 h-3 text-[#57534E]" strokeWidth={1.75} />
                    <span>اتصال</span>
                  </a>

                  <a
                    href={`https://wa.me/${dist.whatsapp}?text=${encodeURIComponent('مرحباً، هل كروت طلقة نت متوفرة لديكم؟')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B58218] text-white text-xs font-bold hover:brightness-105 border border-[#B58218] shadow-2xs"
                  >
                    <MessageCircle className="w-3 h-3 text-white" strokeWidth={2} />
                    <span>واتساب</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-1">
            <Button
              variant="secondary"
              fullWidth
              size="md"
              onClick={() => setIsDistributorsSheetOpen(false)}
            >
              إغلاق
            </Button>
          </div>
        </div>
      </Sheet>
    </div>
  );
};
