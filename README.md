# شركة مسك للخدمات المنزلية — Mesk Home Services
🌐 **الموقع الرسمي:** [https://meskco.com](https://meskco.com)

تطبيق ويب متكامل عالي الأداء مبني بأحدث تقنيات **Next.js 14 (App Router)**، **TypeScript**، **Tailwind CSS**، و **Prisma ORM**، موجه لخدمات المنازل المتكاملة وتحقيق أعلى معدلات التحويل (CRO) للحملات الإعلانية المدفوعة (Meta, TikTok, Snapchat, Google Ads).

---

## 🚀 المميزات الرئيسية
- **واجهة عربية 100% بنظام RTL:** مدعومة بخط Google Font `Cairo`.
- **معمارية السيو والـ Programmatic SEO:** توليد تلقائي وديناميكي لصفحات (المدينة × الخدمة) مثل `/alahsa/painting-gypsum`.
- **تخصيص الحملات (Page Overrides):** إمكانية تعيين أرقام اتصال وواتساب وبكسلات إعلانية مستقلة لكل صفحة أو رابط إعلاني دون الحاجة لتعديل الكود.
- **محرك تتبع التحويل الذكي (CRO Tracking Engine):** دعم بكسلات Meta، TikTok، Snapchat، و Google Ads.
- **التوجيه الفوري للطلبات (Multi-channel Lead Routing):** إرسال فوري لبيانات العميل إلى بوت تيليجرام، جداول Google Sheets عبر Webhook، إشعارات البريد، وزر تحويل فوري للواتساب مع رسالة ملخصة.
- **لوحة تحكم إدارية متكاملة (`/admin`):** إدارة الطلبات وتصديرها إلى Excel (CSV)، إدارة الخدمات والمدن، وتخصيص الصفحات.

---

## 🛠️ التشغيل والتطوير المحلي

```bash
# تثبيت الاعتمادات
npm install

# مزامنة قاعدة البيانات وتوليد Prisma Client
npm run prisma:generate
npm run prisma:push

# تغذية البيانات الأولية
npm run prisma:seed

# تشغيل خادم التطوير
npm run dev
```

---

## 📦 النشر على Hostinger Node.js
راجع ملف [HOSTINGER_DEPLOYMENT.md](./HOSTINGER_DEPLOYMENT.md) للتفاصيل الكاملة لإعداد MySQL وربط مستودع GitHub عبر Hostinger Git.
