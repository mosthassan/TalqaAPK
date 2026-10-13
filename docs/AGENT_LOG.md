# سجل الوكلاء والتغييرات (Agent Change Log) — شبكة طلقة نت

> **القاعدة:** سجل إضافة فقط (Append-Only). كل إنجاز رئيسي يتم تدوينه بتفاصيله وملفاته وقراراته.

---

## [2026-10-13 01:45] المرحلة 1 — الأساس: تنظيف المستودع، نظام التصميم، صدفة التطبيق، وبنية PWA

- **ما تم:**
  1. استنساخ ودراسة الكود القديم للمشروع وعزله بالكامل في مجلد `legacy/` واستبعاده من `tsconfig.json` وفاحص ESLint.
  2. إنشاء ملف الثوابت والروابط المركزية `src/config/links.ts` ليكون مصدر الحقيقة الوحيد.
  3. تعريف عقود الأنواع الصارمة في `src/types/index.ts` وتجهيز بيانات الباقات الرسمية (200، 500، 1000، 4000 ريال يمني) ونقاط التوزيع الأولية مع علم `isPlaceholder: true`.
  4. بناء نظام تصميم عربي RTL كامل في `app/globals.css` مع مكتبة مكونات أصلية تضم 11 مكوناً تفاعلياً (`Button`, `Card`, `Chip`, `Badge`, `Sheet`, `Tabs`, `Skeleton`, `Toast`, `EmptyState`, `ListItem`, `IconButton`).
  5. إنشاء صفحة دليل نظام التصميم للمطورين `/design`.
  6. بناء صدفة التطبيق (App Shell) في `app/page.tsx` بشريط تنقل سفلي 5 تبويبات وترويسة متقدمة مع أزرار الدخول إلى `t.net` وفحص الرصيد، وتنبيه الواي فاي الذكي.
  7. بناء شاشات الباقات، الاستراحة (حالة فارغة صادقة ومحترمة للمرحلة 2)، المباريات (حالة فارغة صادقة للمرحلة 2)، والمزيد مع تذييل المطور الرسمي.
  8. بناء نوافذ فحص السرعة الحقيقي (Real Ping) ومسابقة الانتماء (المرحلة 3).
  9. تنفيذ بنية PWA المتقدمة: `manifest.webmanifest`, `sw.js` باستراتيجيات Precache وNetworkFirst وCacheFirst، صفحة `offline.html`، خطاف `usePWAInstall` مع بطاقة تثبيت iOS، وأيقونات بدقة 192 و512 و180.
  10. إعداد ملفات التوثيق السبعة في `docs/` وحفظ لقطات الشاشة التوثيقية.
  11. التحقق التام من نجاح `npm run build` و`npm run lint` بنسبة 100%.

- **الملفات الرئيسية:**
  - `src/config/links.ts`
  - `src/data/packages.ts`, `src/data/distributors.ts`, `src/data/announcements.ts`
  - `src/types/index.ts`
  - `app/globals.css`, `app/layout.tsx`, `app/page.tsx`, `app/design/page.tsx`
  - `src/components/ui/*` (11 مكوناً)
  - `src/components/layout/AppHeader.tsx`, `src/components/layout/BottomNav.tsx`
  - `src/components/views/*` (`HomeView`, `PackagesView`, `LoungeView`, `MatchesView`, `MoreView`)
  - `src/components/pwa/*` (`OfflineIndicator`, `PWAInstallBanner`, `ServiceWorkerManager`)
  - `public/manifest.webmanifest`, `public/sw.js`, `public/offline.html`, `public/icon.svg`
  - `docs/*` (`PROJECT_BRIEF.md`, `ARCHITECTURE.md`, `DESIGN_SYSTEM.md`, `TASKS.md`, `AGENT_LOG.md`, `DECISIONS.md`, `HANDOFF.md`)

- **القرارات:** تم توثيق القرارات DEC-001 إلى DEC-006 في `docs/DECISIONS.md`.
- **المتبقي/المشاكل للمرحلة 2:** ربط قاعدة بيانات Firestore الحية، إضافة الخريطة التفاعلية لنقاط التوزيع بعد تأكيدها، دمج مشغل HLS للمباريات وسيرفر Jellyfin المحلي مع فاحص اتصال LAN، ومحرك فحص سرعة التحميل والرفع.
- **الالتزام (commit):** `b37c701` (phase1(docs): handoff - finalize build and handoff documentation)

---

## [2026-10-13 06:05] المرحلة 1-ب — إعادة تصميم الواجهة بتوجيه فني صارم (نظام «مدار» Orbit)

- **ما تم:**
  1. استبدال الهوية البصرية الزرقاء بالكامل بنظام «مدار» (Orbit) المستوحى من أقمار ومدارات ستارلينك في مأرب.
  2. صياغة رموز ألوان CSS الصارمة: `--bg` (#F4F6F8), `--surface` (#FFFFFF), `--ink` (#0B1220), `--ink-2` (#5B6676), `--line` (#E3E8EE), `--signal` (#C6F24E), `--signal-soft` (#EEF9CF), `--sky` (#E6EEFB).
  3. استضافة خطوط Readex Pro (للعناوين والأرقام والأسعار) و IBM Plex Sans Arabic (للنصوص) محلياً في `public/fonts/` لضمان استقلالية كاملة عن الشبكات الخارجية.
  4. بناء شعار المتجهات الأصلي `BrandLogo.tsx` وحلقة الإشارة المدارية `SignalRing.tsx` بدون بهرجة أو تدرجات لونية عشوائية.
  5. معالجة كافة العيوب المرفوضة:
     - إزالة جميع رموز الإيموجي في العناوين والبطاقات واستبدالها بأيقونات `lucide-react` (stroke 1.75).
     - منع انكسار وحدات القياس (ms, Mbps) برمجياً عبر `whitespace-nowrap`.
     - فصل شريط التنبيه عن الترويسة ودمجه داخل انسيابية الصفحة مع نافذة إرشادية سفلية `Sheet`.
     - تنويع بطاقات الشبكة عبر شبكة Bento متوازنة تجمع بطاقة الولاء (Signal-Soft) وبطاقة المباريات (Sky).
  6. بناء شريط التنقل السفلي الطائف بكبسولة إشارة ليمونية تفاعلية مدعومة بـ Motion.
  7. توثيق الهوية الجديدة بالكامل في `/design` وتحديث `docs/DESIGN_SYSTEM.md`، `docs/DECISIONS.md` (DEC-007)، `docs/TASKS.md`، و `docs/HANDOFF.md`.
  8. التحقق التام من اجتياز البناء `compile_applet` بنجاح بنسبة 100%.

- **الملفات الرئيسية المعدلة:**
  - `app/globals.css`, `app/page.tsx`, `app/design/page.tsx`
  - `src/components/ui/BrandLogo.tsx`, `src/components/ui/SignalRing.tsx`, `src/components/ui/*`
  - `src/components/layout/AppHeader.tsx`, `src/components/layout/BottomNav.tsx`
  - `src/components/views/HomeView.tsx`, `src/components/views/PackagesView.tsx`
  - `docs/DECISIONS.md`, `docs/DESIGN_SYSTEM.md`, `docs/TASKS.md`, `docs/AGENT_LOG.md`, `docs/HANDOFF.md`
- **القرارات:** تم توثيق DEC-007 في `docs/DECISIONS.md`.

---

## [2026-10-13 06:14] تصحيح توافق الترطيب وحفظ الاستقرار (Fix Hydration Mismatch)
- **المشكلة:** حدوث خطأ `Hydration failed because the server rendered text didn't match the client` الناتج عن قراءة `localStorage` و `window`/`navigator` المتزامنة في دورة التهيئة الأولى للمكونات.
- **الحل الجذري:**
  1. ترقية إدارة الحالة الخارجية لقراءة البينج المخزن (`talqa_last_ping`) في `HomeView.tsx` باستخدام معيار React 18/19 الحديث `useSyncExternalStore` مع توفير `getServerSnapshot = () => null`.
  2. تحديث خطاف حالة الاتصال `useOnlineStatus.ts` بالاعتماد على `useSyncExternalStore` لتطابق النص بين الخادم والعميل أثناء عملية الترطيب.
  3. تحديث خطاف تثبيت التطبيق `usePWAInstall.ts` لضمان عدم وجود فروع SSR/Client غير متطابقة قبل اكتمال الترطيب وتفادي تحذيرات `react-hooks/set-state-in-effect`.
  4. إضافة `suppressHydrationWarning` لعنصر `html` في `app/layout.tsx` لتفادي تدخل ملحقات المتصفح.
  5. نجاح الفحص `npm run lint` والتجميع `compile_applet` بنسبة 100%.

---

## [2026-10-13 06:26] تحسين التصميم: الهوية الملكية (اللون الذهبي + الأزرق الشبكي + شعار طلقة نت)
- **ما تم:**
  1. استبدال الأسود الداكن باللون الذهبي الملكي المتدرج (`#C59424` / `#D4AF37`) في الأزرار الأساسية وعناصر الجذب والشعار.
  2. استبدال اللون الليموني بالأزرق الشبكي السيان (`#0284C7`) المخصص لتطبيقات شبكات الإنترنت الفضائي وبث الألياف.
  3. إعادة تصميم شعار طلقة نت `BrandLogo.tsx` ليمثل سهم الطلقة الخارقة وقوس ترددات بث الإنترنت في درع ذهبي ملكي.
  4. تحويل الزر الرئيسي لبوابة `t.net` إلى زر ذهبي مشع فائق الفخامة.
  5. تحديث حلقة الإشارة `SignalRing` بقوس ترددات شبكية بالأزرق السيان وزر فحص ذهبي.
  6. تحديث كبسولة شريط التنقل السفلي والبطاقات وشارات الباقات لتتناغم بدقة مع الهوية الجديدة.
  7. توثيق القرار DEC-008 في `docs/DECISIONS.md` وتحديث `docs/DESIGN_SYSTEM.md`.
