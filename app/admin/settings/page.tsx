'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  PhoneCall,
  MessageCircle,
  Send,
  Table,
  Mail,
  MapPin,
  Clock,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Zap,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form states
  const [defaultPhone, setDefaultPhone] = useState('0571319638');
  const [defaultWhatsapp, setDefaultWhatsapp] = useState('966571319638');

  // Pixels
  const [metaPixelId, setMetaPixelId] = useState('');
  const [tiktokPixelId, setTiktokPixelId] = useState('');
  const [snapchatPixelId, setSnapchatPixelId] = useState('');
  const [googleAdsId, setGoogleAdsId] = useState('');
  const [gtmId, setGtmId] = useState('');

  // Telegram
  const [enableTelegram, setEnableTelegram] = useState(false);
  const [telegramBotToken, setTelegramBotToken] = useState('');
  const [telegramChatId, setTelegramChatId] = useState('');
  const [testingTelegram, setTestingTelegram] = useState(false);
  const [telegramTestResult, setTelegramTestResult] = useState<string | null>(null);

  // WhatsApp
  const [enableWhatsappRedirect, setEnableWhatsappRedirect] = useState(true);
  const [enableWhatsappWebhook, setEnableWhatsappWebhook] = useState(false);
  const [whatsappWebhookUrl, setWhatsappWebhookUrl] = useState('');

  // Google Sheet
  const [enableGoogleSheet, setEnableGoogleSheet] = useState(false);
  const [googleSheetWebhookUrl, setGoogleSheetWebhookUrl] = useState('');
  const [testingSheet, setTestingSheet] = useState(false);
  const [sheetTestResult, setSheetTestResult] = useState<string | null>(null);

  // Email
  const [enableEmail, setEnableEmail] = useState(false);
  const [notificationEmail, setNotificationEmail] = useState('');

  // Business & Maps
  const [businessAddress, setBusinessAddress] = useState('المركز الرئيسي للخدمات المنزلية المتكاملة');
  const [googleMapsEmbedUrl, setGoogleMapsEmbedUrl] = useState('');
  const [googleBusinessProfileUrl, setGoogleBusinessProfileUrl] = useState('');
  const [workingHours, setWorkingHours] = useState('على مدار 24 ساعة طوال أيام الأسبوع');

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        if (data.settings) {
          const s = data.settings;
          setDefaultPhone(s.defaultPhone || '0571319638');
          setDefaultWhatsapp(s.defaultWhatsapp || '966571319638');
          setMetaPixelId(s.metaPixelId || '');
          setTiktokPixelId(s.tiktokPixelId || '');
          setSnapchatPixelId(s.snapchatPixelId || '');
          setGoogleAdsId(s.googleAdsId || '');
          setGtmId(s.gtmId || '');
          setEnableTelegram(Boolean(s.enableTelegram));
          setTelegramBotToken(s.telegramBotToken || '');
          setTelegramChatId(s.telegramChatId || '');
          setEnableWhatsappRedirect(s.enableWhatsappRedirect ?? true);
          setEnableWhatsappWebhook(Boolean(s.enableWhatsappWebhook));
          setWhatsappWebhookUrl(s.whatsappWebhookUrl || '');
          setEnableGoogleSheet(Boolean(s.enableGoogleSheet));
          setGoogleSheetWebhookUrl(s.googleSheetWebhookUrl || '');
          setEnableEmail(Boolean(s.enableEmail));
          setNotificationEmail(s.notificationEmail || '');
          setBusinessAddress(s.businessAddress || '');
          setGoogleMapsEmbedUrl(s.googleMapsEmbedUrl || '');
          setGoogleBusinessProfileUrl(s.googleBusinessProfileUrl || '');
          setWorkingHours(s.workingHours || 'على مدار 24 ساعة طوال أيام الأسبوع');
        }
      })
      .catch(err => console.error('Fetch settings error:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          defaultPhone,
          defaultWhatsapp,
          metaPixelId,
          tiktokPixelId,
          snapchatPixelId,
          googleAdsId,
          gtmId,
          enableTelegram,
          telegramBotToken,
          telegramChatId,
          enableWhatsappRedirect,
          enableWhatsappWebhook,
          whatsappWebhookUrl,
          enableGoogleSheet,
          googleSheetWebhookUrl,
          enableEmail,
          notificationEmail,
          businessAddress,
          googleMapsEmbedUrl,
          googleBusinessProfileUrl,
          workingHours,
        }),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        const data = await res.json();
        throw new Error(data.error || 'فشل حفظ الإعدادات');
      }
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleTestTelegram = async () => {
    setTestingTelegram(true);
    setTelegramTestResult(null);
    try {
      const res = await fetch('/api/admin/settings/test-telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ botToken: telegramBotToken, chatId: telegramChatId }),
      });
      const data = await res.json();
      if (res.ok) {
        setTelegramTestResult('✅ تم إرسال رسالة الاختبار بنجاح!');
      } else {
        setTelegramTestResult(`❌ خطأ: ${data.error}`);
      }
    } catch (err) {
      setTelegramTestResult(`❌ خطأ: ${(err as Error).message}`);
    } finally {
      setTestingTelegram(false);
    }
  };

  const handleTestSheet = async () => {
    setTestingSheet(true);
    setSheetTestResult(null);
    try {
      const res = await fetch('/api/admin/settings/test-sheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ webhookUrl: googleSheetWebhookUrl }),
      });
      const data = await res.json();
      if (res.ok) {
        setSheetTestResult('✅ تم إرسال طلب الاختبار لـ Webhook بنجاح!');
      } else {
        setSheetTestResult(`❌ خطأ: ${data.error}`);
      }
    } catch (err) {
      setSheetTestResult(`❌ خطأ: ${(err as Error).message}`);
    } finally {
      setTestingSheet(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-brand-blue" />
        <span>جاري تحميل الإعدادات...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-black text-brand-navy">الإعدادات العامة والربط البرمجي</h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            إدارة أرقام التواصل العامة، بكسلات الإعلانات، وبوتات وقنوات توجيه الطلبات
          </p>
        </div>

        {saveSuccess && (
          <div className="px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-1.5 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>تم حفظ الإعدادات بنجاح!</span>
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 text-red-600 text-xs font-bold border border-red-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Phone & WhatsApp */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <PhoneCall className="w-5 h-5 text-brand-orange" />
            <h2 className="font-bold text-base text-brand-navy">أرقام التواصل الافتراضية للموقع</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                رقم الاتصال المباشر الافتراضي (Call)
              </label>
              <input
                type="text"
                dir="ltr"
                required
                value={defaultPhone}
                onChange={(e) => setDefaultPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-mono text-left focus:border-brand-blue outline-none text-sm"
              />
              <span className="text-[11px] text-gray-400 block mt-1">يظهر في الأزرار والترويسة والفوتر</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                رقم الواتساب الافتراضي (WhatsApp)
              </label>
              <input
                type="text"
                dir="ltr"
                required
                value={defaultWhatsapp}
                onChange={(e) => setDefaultWhatsapp(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-mono text-left focus:border-brand-blue outline-none text-sm"
              />
              <span className="text-[11px] text-gray-400 block mt-1">بصيغة دولية بدون علامة + (مثال: 966571319638)</span>
            </div>
          </div>
        </div>

        {/* Section 2: Global Ad Pixels */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <Zap className="w-5 h-5 text-brand-blue" />
            <h2 className="font-bold text-base text-brand-navy">بكسلات التتبع والتحويل العامة (Ad Pixels)</h2>
          </div>
          <p className="text-xs text-gray-500">
            تعمل هذه البكسلات على كامل صفحات الموقع، وتُستبدل تلقائياً إذا كان هناك تخصيص (PageOverride) لصفحة معينة.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Meta Pixel ID (Facebook / Instagram)</label>
              <input
                type="text"
                dir="ltr"
                value={metaPixelId}
                onChange={(e) => setMetaPixelId(e.target.value)}
                placeholder="مثال: 123456789012345"
                className="w-full px-3 py-2 rounded-xl border border-gray-300 font-mono text-left text-xs outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">TikTok Pixel ID</label>
              <input
                type="text"
                dir="ltr"
                value={tiktokPixelId}
                onChange={(e) => setTiktokPixelId(e.target.value)}
                placeholder="مثال: CXXXXXXXXXXXXXXXXX"
                className="w-full px-3 py-2 rounded-xl border border-gray-300 font-mono text-left text-xs outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Snapchat Pixel ID</label>
              <input
                type="text"
                dir="ltr"
                value={snapchatPixelId}
                onChange={(e) => setSnapchatPixelId(e.target.value)}
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                className="w-full px-3 py-2 rounded-xl border border-gray-300 font-mono text-left text-xs outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Google Ads Conversion ID</label>
              <input
                type="text"
                dir="ltr"
                value={googleAdsId}
                onChange={(e) => setGoogleAdsId(e.target.value)}
                placeholder="مثال: AW-XXXXXXXXX"
                className="w-full px-3 py-2 rounded-xl border border-gray-300 font-mono text-left text-xs outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Google Tag Manager ID (GTM)</label>
              <input
                type="text"
                dir="ltr"
                value={gtmId}
                onChange={(e) => setGtmId(e.target.value)}
                placeholder="مثال: GTM-XXXXXXX"
                className="w-full px-3 py-2 rounded-xl border border-gray-300 font-mono text-left text-xs outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Telegram Lead Routing */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Send className="w-5 h-5 text-sky-500" />
              <h2 className="font-bold text-base text-brand-navy">إشعارات تيليجرام الفورية (Telegram Bot)</h2>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={enableTelegram}
                onChange={(e) => setEnableTelegram(e.target.checked)}
                className="w-4 h-4 rounded text-brand-blue cursor-pointer"
              />
              <span className="text-xs font-bold text-gray-700">تفعيل الإشعارات</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Telegram Bot Token</label>
              <input
                type="password"
                dir="ltr"
                value={telegramBotToken}
                onChange={(e) => setTelegramBotToken(e.target.value)}
                placeholder="123456789:ABCdefGhIJKlmNoPQRstuVwXyz"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-mono text-left text-xs outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Telegram Chat ID</label>
              <input
                type="text"
                dir="ltr"
                value={telegramChatId}
                onChange={(e) => setTelegramChatId(e.target.value)}
                placeholder="-100XXXXXXXXXX أو معرف المستخدم"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-mono text-left text-xs outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={handleTestTelegram}
              disabled={testingTelegram || !telegramBotToken || !telegramChatId}
              className="px-4 py-2 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              {testingTelegram && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>إرسال رسالة اختبار لتيليجرام</span>
            </button>
            {telegramTestResult && (
              <span className="text-xs font-semibold">{telegramTestResult}</span>
            )}
          </div>
        </div>

        {/* Section 4: Google Sheets & WhatsApp Redirect */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Table className="w-5 h-5 text-emerald-600" />
              <h2 className="font-bold text-base text-brand-navy">ربط جداول جوجل (Google Sheets Webhook)</h2>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={enableGoogleSheet}
                onChange={(e) => setEnableGoogleSheet(e.target.checked)}
                className="w-4 h-4 rounded text-brand-blue cursor-pointer"
              />
              <span className="text-xs font-bold text-gray-700">تفعيل حفظ الطلبات في Google Sheets</span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Google Apps Script Webhook URL</label>
            <input
              type="url"
              dir="ltr"
              value={googleSheetWebhookUrl}
              onChange={(e) => setGoogleSheetWebhookUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-mono text-left text-xs outline-none"
            />
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={handleTestSheet}
              disabled={testingSheet || !googleSheetWebhookUrl}
              className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              {testingSheet && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>اختبار Webhook جدول جوجل</span>
            </button>
            {sheetTestResult && (
              <span className="text-xs font-semibold">{sheetTestResult}</span>
            )}
          </div>
        </div>

        {/* Section 5: WhatsApp & Email Settings */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <MessageCircle className="w-5 h-5 text-emerald-600" />
            <h2 className="font-bold text-base text-brand-navy">توجيه الواتساب والبريد الإلكتروني</h2>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={enableWhatsappRedirect}
                onChange={(e) => setEnableWhatsappRedirect(e.target.checked)}
                className="w-4 h-4 rounded text-brand-blue cursor-pointer"
              />
              <span className="text-xs font-bold text-gray-800">
                توجيه العميل تلقائياً إلى واتساب مع رسالة ملخصة بعد إرسال الطلب (CRO Boost)
              </span>
            </label>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer mb-2">
                <input
                  type="checkbox"
                  checked={enableEmail}
                  onChange={(e) => setEnableEmail(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-blue cursor-pointer"
                />
                <span className="text-xs font-bold text-gray-800">
                  إرسال إشعار بريد إلكتروني (SMTP) لكل طلب وارد
                </span>
              </label>
              {enableEmail && (
                <input
                  type="email"
                  dir="ltr"
                  value={notificationEmail}
                  onChange={(e) => setNotificationEmail(e.target.value)}
                  placeholder="orders@meskco.com"
                  className="w-full sm:w-96 px-3.5 py-2 rounded-xl border border-gray-300 font-mono text-left text-xs outline-none"
                />
              )}
            </div>
          </div>
        </div>

        {/* Section 6: Business Info & Google Maps */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <MapPin className="w-5 h-5 text-red-500" />
            <h2 className="font-bold text-base text-brand-navy">بيانات السيو المحلي والخريطة (GBP / Local SEO)</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">عنوان النشاط التجاري</label>
              <input
                type="text"
                value={businessAddress}
                onChange={(e) => setBusinessAddress(e.target.value)}
                placeholder="المركز الرئيسي للخدمات المنزلية"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">أوقات وساعات العمل</label>
              <input
                type="text"
                value={workingHours}
                onChange={(e) => setWorkingHours(e.target.value)}
                placeholder="على مدار 24 ساعة طوال أيام الأسبوع"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              رابط تضمين خريطة جوجل (Google Maps Iframe src)
            </label>
            <input
              type="url"
              dir="ltr"
              value={googleMapsEmbedUrl}
              onChange={(e) => setGoogleMapsEmbedUrl(e.target.value)}
              placeholder="https://www.google.com/maps/embed?pb=..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-mono text-left text-xs outline-none"
            />
            <span className="text-[11px] text-gray-400 block mt-1">
              انسخ فقط رابط src الموجود داخل كود التضمين من خرائط جوجل
            </span>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white font-extrabold text-sm shadow-lg shadow-orange-500/20 transition flex items-center gap-2 cursor-pointer disabled:opacity-75"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>جاري حفظ التغييرات...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>حفظ جميع الإعدادات</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
