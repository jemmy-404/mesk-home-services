# دليل نشر وتثبيت موقع شركة مسك على استضافة Hostinger Node.js

تم بناء هذا المشروع بأحدث معايير Next.js App Router و TypeScript و Tailwind CSS و Prisma ORM ليعمل بكفاءة وسرعة فائقة على استضافة Hostinger (سواء خطط Web Hosting أو Cloud Hosting).

---

## 1. ربط مستودع GitHub على Hostinger (Git / Hostinger Connector)
تم رفع وتحديث المشروع بالكامل على مستودع GitHub الخاص بك:
🔗 **رابط المستودع:** `https://github.com/jemmy-404/mesk-home-services`
- **الفرع (Branch):** `main`

في لوحة تحكم **Hostinger (hPanel)**:
1. توجه إلى **Advanced** -> **Git**.
2. أدخل رابط المستودع: `https://github.com/jemmy-404/mesk-home-services.git`
3. اختر الفرع: `main`
4. حدد مسار النشر (Install Path): المجلد المخصص لموقعك (مثل `public_html`).
5. فعّل خيار **Auto Deployment** ليتم التحديث تلقائياً مع كل تحديث ترسله لمستودع GitHub.

---

## 2. إعداد قاعدة بيانات MySQL على Hostinger
1. افتح لوحة تحكم Hostinger (**hPanel**).
2. توجه إلى **Databases** (قواعد البيانات) -> **Management**.
3. قم بإنشاء قاعدة بيانات MySQL جديدة:
   - **Database Name:** (مثال: `u123456789_mesk`)
   - **Username:** (مثال: `u123456789_admin`)
   - **Password:** (اختر كلمة مرور قوية واحتفظ بها)
4. احصل على بيانات الاتصال. عادة يكون المضيف هو `localhost` أو `127.0.0.1`.

---

## 2. ضبط المتغيرات البيئية (Environment Variables)
في إعدادات تطبيق Node.js داخل hPanel (قسم **Node.js**)، أضف المتغيرات التالية:

```env
DATABASE_URL="mysql://u123456789_admin:YourPassword123!@localhost:3306/u123456789_mesk"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="MeskAdmin2025!#"
JWT_SECRET="mesk-jwt-secret-key-production-super-safe-random-token-2025"
NEXT_PUBLIC_SITE_URL="https://meskco.com"
```

---

## 3. تثبيت الاعتمادات وبناء المشروع (Build)
عبر الـ SSH أو Terminal داخل لوحة Hostinger، قم بتنفيذ الأوامر التالية بالترتيب:

```bash
# 1. تثبيت الحزم
npm install

# 2. توليد عميل بريزما ومزامنة الجداول مع قاعدة البيانات
npm run prisma:generate
npm run prisma:push

# 3. تغذية البيانات الأولية (الخدمات الـ 10، المدن، الإعدادات، وحساب المدير)
npm run prisma:seed

# 4. بناء المشروع للإنتاج
npm run build
```

---

## 4. إعداد تشغيل التطبيق في hPanel (Node.js App)
- **Node.js Version:** اختر `Node 18.x` أو `Node 20.x` أو أحدث.
- **Application Root:** المجلد الرئيسي للمشروع (مثل `public_html` أو مسار النشر الخاص بك).
- **Application Startup File:** 
  - في حال تشغيل Next.js مباشرة: `node_modules/next/dist/bin/next` مع تمرير المعامل `start`
  - أو استخدم script: `npm start`
- اضغط على **Save** ثم **Restart** للتطبيق.

---

## 5. بيانات تسجيل الدخول الافتراضية للوحة التحكم
- **رابط لوحة التحكم:** `https://meskco.com/admin`
- **اسم المستخدم:** `admin`
- **كلمة المرور:** `MeskAdmin2025!#`

---

## 6. مميزات النظام المتاحة للإدارة وMedia Buying
1. **تخصيص الصفحات والحملات (Page Overrides):**
   - إمكانية تعيين رقم اتصال أو واتساب مخصص لأي إعلان أو مسار.
   - إمكانية ربط بكسلات تتبع منفصلة (Meta, TikTok, Snapchat, Google Ads) لكل إعلان بدون الحاجة لكتابة كود.
2. **التوجيه الفوري للطلبات:**
   - إرسال فوري لبيانات العميل إلى بوت تيليجرام أو قروب العمل.
   - حفظ تلقائي في جداول Google Sheets عبر Webhook.
   - توجيه العميل بعد تعبئة النموذج إلى محادثة واتساب مجهزة برسالة ملخصة لتأكيد الطلب فوراً.
