# الهيكل المعماري للنظام (System Architecture) — شبكة طلقة نت

> **الهدف:** توثيق هيكل المشروع، خريطة الشاشات، طبقة البيانات، إستراتيجيات PWA، وطريقة التشغيل لضمان استمرارية التطوير بين الوكلاء.

---

## 1) هيكل المجلدات (Directory Structure)

```
/
├── app/                      # Next.js App Router
│   ├── design/               # صفحة دليل نظام التصميم للمطورين (/design)
│   │   └── page.tsx
│   ├── globals.css           # متغيرات التصميم ورموز Design Tokens ونظام RTL
│   ├── layout.tsx            # الترويسة الجذرية، الميتا، PWA Tags، والخطوط
│   └── page.tsx              # صدفة التطبيق الرئيسية (App Shell) ومبدل الشاشات
├── docs/                     # الذاكرة المشتركة وبروتوكول التسليم بين الوكلاء
│   ├── screenshots/phase1/   # لقطات الشاشة التوثيقية للمرحلة الأولى
│   ├── AGENT_LOG.md          # سجل الإنجازات والالتزامات (Append-Only)
│   ├── ARCHITECTURE.md       # هذا الملف (الهيكل المعماري والمسارات)
│   ├── DECISIONS.md          # سجل القرارات التقنية والبدائل وأسبابها
│   ├── DESIGN_SYSTEM.md      # دليل الرموز والمكونات وحركات الواجهة
│   ├── HANDOFF.md            # وثيقة التسليم المباشر للوكيل 2
│   ├── PROJECT_BRIEF.md      # موجز المشروع والقواعد الصارمة والروابط
│   └── TASKS.md              # قائمة المهام الإجمالية للمراحل 1 و2 و3
├── legacy/                   # الكود القديم للمشروع كمرجع للقراءة فقط (مستبعد من البناء)
├── public/                   # الأصول الثابتة وملفات PWA
│   ├── apple-touch-icon.png  # أيقونة iOS بدقة 180x180
│   ├── favicon.png           # أيقونة المفضلة
│   ├── icon.svg              # الأيقونة المتجهة بدقة عالية
│   ├── icon-maskable.svg     # أيقونة آمنة للمشغلات (Safe Margin)
│   ├── manifest.json         # نسخة بديلة لملف البيان
│   ├── manifest.webmanifest  # بيان PWA الرسمي وفق أحدث المعايير
│   ├── offline.html          # صفحة السقوط النظيف عند انقطاع الاتصال
│   ├── pwa-192x192.png       # أيقونة PWA القياسية للأجهزة الذكية
│   ├── pwa-512x512.png       # أيقونة PWA عالية الدقة للرذاذ والشاشات
│   ├── pwa-maskable-512x512.png # أيقونة أندرويد المتكيفة (Adaptive)
│   └── sw.js                 # مشغل Service Worker المخصص (Workbox Patterns)
├── src/
│   ├── components/
│   │   ├── layout/           # ترويسة التطبيق وشريط التصفح السفلي (5 تبويبات)
│   │   │   ├── AppHeader.tsx
│   │   │   └── BottomNav.tsx
│   │   ├── modals/           # النوافذ والبطاقات الموسعة
│   │   │   ├── LoyaltyPreviewModal.tsx
│   │   │   └── SpeedTestModal.tsx
│   │   ├── pwa/              # مكونات تجربة PWA والتثبيت والإشعارات
│   │   │   ├── OfflineIndicator.tsx
│   │   │   ├── PWAInstallBanner.tsx
│   │   │   └── ServiceWorkerManager.tsx
│   │   ├── ui/               # مكتبة مكونات التصميم الأساسية النيتف
│   │   │   ├── Badge.tsx, Button.tsx, Card.tsx, Chip.tsx, EmptyState.tsx
│   │   │   ├── IconButton.tsx, ListItem.tsx, Sheet.tsx, Skeleton.tsx, Tabs.tsx, Toast.tsx
│   │   │   └── index.ts
│   │   └── views/            # الشاشات الرئيسية الخمس
│   │       ├── HomeView.tsx      # الرئيسية وأزرار t.net
│   │       ├── LoungeView.tsx    # الاستراحة وسيرفر Jellyfin (المرحلة 2)
│   │       ├── MatchesView.tsx   # بث المباريات HLS (المرحلة 2)
│   │       ├── MoreView.tsx      # المزيد، الدعم، PWA، وتذييل المطور
│   │       └── PackagesView.tsx  # الباقات ونقاط التوزيع
│   ├── config/
│   │   └── links.ts          # مصدر الحقيقة الموحد للروابط والأرقام
│   ├── data/                 # مصادر البيانات الثابتة
│   │   ├── announcements.ts
│   │   ├── distributors.ts   # نقاط التوزيع (موسومة بـ isPlaceholder: true)
│   │   └── packages.ts       # باقات الكروت والأسعار
│   ├── hooks/
│   │   ├── useOnlineStatus.ts# مراقبة الاتصال الشبكي
│   │   └── usePWAInstall.ts  # معالجة طلب التثبيت لكروم وiOS Safari
│   └── types/
│       └── index.ts          # العقود والأنماط المعرفة بدقة
├── .env.example              # نموذج متغيرات البيئة بدون أسرار
├── eslint.config.mjs         # ضبط فاحص الجودة ESLint واستبعاد legacy
├── next.config.ts            # إعدادات Next.js App Router المستقلة
├── package.json              # التبعيات الخفيفة وحزمة التشغيل
├── tsconfig.json             # ضبط التايب سكريبت الصارم واستبعاد legacy
└── vercel.json               # ترويسات الأمان وسياسات الكاش لـ Vercel
```

---

## 2) خريطة الشاشات والمسارات (Screen & Routing Map)

التطبيق يعتمد نمط **Single-Page Application (SPA)** مدعوماً بروابط استعلام سريعة (`?tab=...`) وشريط تنقل سفلي ثابت (5 عناصر بحد أقصى):

```
                       ┌─────────────────────┐
                       │     App Shell       │
                       │  (AppHeader + Nav)  │
                       └──────────┬──────────┘
                                  │
      ┌─────────────┬─────────────┼─────────────┬─────────────┐
      ▼             ▼             ▼             ▼             ▼
  [الرئيسية]     [الباقات]     [الاستراحة]     [المباريات]     [المزيد]
  HomeView     PackagesView    LoungeView    MatchesView     MoreView
      │             │             │             │             │
      ├─ t.net      ├─ فئات الكروت ├─ Jellyfin   ├─ HLS Channels├─ الدعم الفني
      ├─ فحص رصيد   ├─ نقاط التوزيع├─ تنزيلات    ├─ جداول حقيقية├─ تثبيت PWA
      ├─ فحص السرعة └─ طلب واتساب └─ (مرحلة 2)   └─ (مرحلة 2)   ├─ معلومات
      └─ مسابقة ولاء                                            └─ تذييل المطور
```

- **المسار الخاص للمطورين:** `/design` يعرض مكتبة المكونات ورموز التصميم.
- **الاختصارات السريعة (PWA Shortcuts):**
  - `/?tab=packages` ← يفتح شاشة الباقات مباشرة.
  - `/?tab=speed` ← يفتح نافذة فحص السرعة التفاعلية.
  - `/?tab=loyalty` ← يفتح تفاصيل مسابقة الولاء.

---

## 3) طبقة البيانات (Data Layer)

- **الحالة الراهنة (المرحلة 1):** البيانات مخزنة في ملفات TypeScript صريحة داخل `src/data/` ومحمية بعقود في `src/types/index.ts`.
- **نقاط التوزيع:** مميزة بعلم `isPlaceholder: true` في `src/data/distributors.ts` ومسجلة في الوثائق كبيانات أولية تنتظر تأكيد صاحب المشروع.
- **الانتقال إلى المرحلة 2:** سيتم ربط الباقات ونقاط التوزيع بـ Cloud Firestore مع استراتيجية كاش غير متصل (`enableIndexedDbPersistence`) لتعمل بدون إنترنت.

---

## 4) بنية وإستراتيجية PWA (Progressive Web App Architecture)

1. **البيان (`public/manifest.webmanifest` و`manifest.json`):**
   - يدعم `id: "/"`, `start_url: "/?source=pwa"`, `display: "standalone"`.
   - استخدام ميزة `display_override: ["window-controls-overlay", "standalone", "minimal-ui"]`.
   - أيقونات دائرية وأخرى متكيفة `maskable` مع هامش أمان بنسبة 15%.
   - يدعم الوضع العربي `dir: "rtl"` و`lang: "ar"`.
2. **الخدمة في الخلفية (`public/sw.js`):**
   - **Precache:** تخزين صدفة التطبيق الأساسية وصفحة السقوط `offline.html`.
   - **NetworkFirst:** للطلبات الملاحية مع الانتقال التلقائي إلى `offline.html` في حال تعذر الاتصال.
   - **CacheFirst:** للأصول المجزأة والصور والخطوط.
   - **StaleWhileRevalidate:** لبيانات الباقات والمحتوى.
   - **تدفق تحديث نظيف:** لا يتم تفعيل `skipWaiting` إجبارياً لعدم كسر جلسة المستخدم؛ يظهر تنبيه شريطي (Toast) بعنوان «تحديث جديد متاح» مع زر «تحديث الآن».
3. **تثبيت التطبيق على الهواتف:**
   - للأندرويد وكروم: التقاط الحدث `beforeinstallprompt` وعرض زر تثبيت بنقرة واحدة.
   - لـ iOS Safari: كشف الجهاز وتقديم ورقة سفلية مرئية ترشد المستخدم (زر المشاركة ← إضافة للشاشة الرئيسية).
   - إخفاء أدوات التثبيت تلقائياً عند التشغيل في وضع `standalone`.

---

## 5) كيفية تشغيل وبناء المشروع

```bash
# تشغيل خادم التطوير المحلي
npm run dev

# فحص التايب سكريبت والأكواد البرمجية
npm run lint

# بناء نسخة الإنتاج النهائية
npm run build

# تشغيل نسخة الإنتاج
npm run start
```
