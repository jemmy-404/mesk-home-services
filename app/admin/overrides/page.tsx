'use client';

import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  CheckCircle2,
  XCircle,
  X,
  Loader2,
  Layers,
  PhoneCall,
  Target,
} from 'lucide-react';

interface OverrideItem {
  id: number;
  routePath: string;
  label: string;
  overridePhone?: string | null;
  overrideWhatsapp?: string | null;
  overrideMetaPixelId?: string | null;
  overrideTiktokPixelId?: string | null;
  overrideSnapchatPixelId?: string | null;
  overrideGoogleAdsId?: string | null;
  overrideGtmId?: string | null;
  overrideTelegramChatId?: string | null;
  overrideGoogleSheetUrl?: string | null;
  customHeadline?: string | null;
  customOfferBadge?: string | null;
  isActive: boolean;
  createdAt: string;
}

export default function AdminOverridesPage() {
  const [overrides, setOverrides] = useState<OverrideItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<OverrideItem | null>(null);

  // Form states
  const [routePath, setRoutePath] = useState('');
  const [label, setLabel] = useState('');
  const [overridePhone, setOverridePhone] = useState('');
  const [overrideWhatsapp, setOverrideWhatsapp] = useState('');
  const [overrideMetaPixelId, setOverrideMetaPixelId] = useState('');
  const [overrideTiktokPixelId, setOverrideTiktokPixelId] = useState('');
  const [overrideSnapchatPixelId, setOverrideSnapchatPixelId] = useState('');
  const [overrideGoogleAdsId, setOverrideGoogleAdsId] = useState('');
  const [overrideGtmId, setOverrideGtmId] = useState('');
  const [overrideTelegramChatId, setOverrideTelegramChatId] = useState('');
  const [overrideGoogleSheetUrl, setOverrideGoogleSheetUrl] = useState('');
  const [customHeadline, setCustomHeadline] = useState('');
  const [customOfferBadge, setCustomOfferBadge] = useState('');
  const [isActive, setIsActive] = useState(true);

  // Pre-load services & cities for convenience in modal
  const [servicesList, setServicesList] = useState<{ slug: string; nameAr: string }[]>([]);
  const [citiesList, setCitiesList] = useState<{ slug: string; nameAr: string }[]>([]);

  const fetchOverrides = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/overrides');
      const data = await res.json();
      if (data.overrides) setOverrides(data.overrides);
    } catch (err) {
      console.error('Error fetching overrides:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverrides();
    // Fetch helper services and cities for path builder
    fetch('/api/admin/services').then(r => r.json()).then(d => {
      if (d.services) setServicesList(d.services);
    }).catch(() => {});
    fetch('/api/admin/cities').then(r => r.json()).then(d => {
      if (d.cities) setCitiesList(d.cities);
    }).catch(() => {});
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setRoutePath('');
    setLabel('');
    setOverridePhone('');
    setOverrideWhatsapp('');
    setOverrideMetaPixelId('');
    setOverrideTiktokPixelId('');
    setOverrideSnapchatPixelId('');
    setOverrideGoogleAdsId('');
    setOverrideGtmId('');
    setOverrideTelegramChatId('');
    setOverrideGoogleSheetUrl('');
    setCustomHeadline('');
    setCustomOfferBadge('');
    setIsActive(true);
    setModalOpen(true);
  };

  const openEditModal = (item: OverrideItem) => {
    setEditingItem(item);
    setRoutePath(item.routePath);
    setLabel(item.label);
    setOverridePhone(item.overridePhone || '');
    setOverrideWhatsapp(item.overrideWhatsapp || '');
    setOverrideMetaPixelId(item.overrideMetaPixelId || '');
    setOverrideTiktokPixelId(item.overrideTiktokPixelId || '');
    setOverrideSnapchatPixelId(item.overrideSnapchatPixelId || '');
    setOverrideGoogleAdsId(item.overrideGoogleAdsId || '');
    setOverrideGtmId(item.overrideGtmId || '');
    setOverrideTelegramChatId(item.overrideTelegramChatId || '');
    setOverrideGoogleSheetUrl(item.overrideGoogleSheetUrl || '');
    setCustomHeadline(item.customHeadline || '');
    setCustomOfferBadge(item.customOfferBadge || '');
    setIsActive(item.isActive);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      id: editingItem?.id,
      routePath,
      label,
      overridePhone,
      overrideWhatsapp,
      overrideMetaPixelId,
      overrideTiktokPixelId,
      overrideSnapchatPixelId,
      overrideGoogleAdsId,
      overrideGtmId,
      overrideTelegramChatId,
      overrideGoogleSheetUrl,
      customHeadline,
      customOfferBadge,
      isActive,
    };

    try {
      const method = editingItem ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/overrides', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setModalOpen(false);
        fetchOverrides();
      } else {
        const data = await res.json();
        alert(data.error || 'حدث خطأ أثناء الحفظ');
      }
    } catch (err) {
      console.error('Error saving override:', err);
      alert('فشل الاتصال بالخادم');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا التخصيص؟ ستعود الصفحة لاستخدام الأرقام والبكسلات العامة.')) return;
    setOverrides(prev => prev.filter(o => o.id !== id));
    try {
      await fetch(`/api/admin/overrides?id=${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Error deleting override:', err);
      fetchOverrides();
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold mb-2">
            <Target className="w-3.5 h-3.5" />
            <span>نظام Media Buying المتقدم</span>
          </div>
          <h1 className="text-2xl font-black text-brand-navy">تخصيص الصفحات والحملات (Page Overrides)</h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            خصص رقم اتصال، واتساب، وبكسلات تتبع مستقلة لكل صفحة أو حملة إعلانية محددة
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-bold shadow-md transition transform active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة تخصيص صفحة جديدة</span>
        </button>
      </div>

      {/* Overrides Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-gray-50 text-gray-600 font-bold border-b border-gray-100">
              <tr>
                <th className="p-3.5">اسم الحملة / التخصيص</th>
                <th className="p-3.5">مسار الصفحة (Route Path)</th>
                <th className="p-3.5">الأرقام المخصصة</th>
                <th className="p-3.5">البكسلات المفعلة</th>
                <th className="p-3.5">توجيه مخصص</th>
                <th className="p-3.5">الحالة</th>
                <th className="p-3.5 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400">
                    جاري تحميل التخصيصات...
                  </td>
                </tr>
              ) : overrides.length > 0 ? (
                overrides.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/70 transition">
                    <td className="p-3.5 font-bold text-brand-navy whitespace-nowrap">
                      {item.label}
                    </td>
                    <td className="p-3.5 font-mono text-gray-600 whitespace-nowrap" dir="ltr">
                      <a
                        href={item.routePath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-brand-blue flex items-center gap-1.5"
                      >
                        <span>{item.routePath}</span>
                        <ExternalLink className="w-3 h-3 text-gray-400" />
                      </a>
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      <div className="text-[11px] font-mono">
                        {item.overridePhone && <span className="block text-brand-orange">📞 {item.overridePhone}</span>}
                        {item.overrideWhatsapp && <span className="block text-emerald-600">💬 {item.overrideWhatsapp}</span>}
                        {!item.overridePhone && !item.overrideWhatsapp && (
                          <span className="text-gray-400">الأرقام الافتراضية</span>
                        )}
                      </div>
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {item.overrideMetaPixelId && <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold">Meta</span>}
                        {item.overrideTiktokPixelId && <span className="px-1.5 py-0.5 rounded bg-black/10 text-black text-[10px] font-bold">TikTok</span>}
                        {item.overrideSnapchatPixelId && <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-bold">Snap</span>}
                        {item.overrideGoogleAdsId && <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">Google</span>}
                        {!item.overrideMetaPixelId && !item.overrideTiktokPixelId && !item.overrideSnapchatPixelId && !item.overrideGoogleAdsId && (
                          <span className="text-gray-400 text-[11px]">البكسلات العامة</span>
                        )}
                      </div>
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      {item.overrideTelegramChatId ? (
                        <span className="text-[11px] text-brand-blue font-mono">TG: {item.overrideTelegramChatId}</span>
                      ) : (
                        <span className="text-gray-400 text-[11px]">-</span>
                      )}
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        item.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {item.isActive ? 'نشط' : 'معطل'}
                      </span>
                    </td>
                    <td className="p-3.5 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 rounded-lg bg-blue-50 text-brand-blue hover:bg-blue-100 transition"
                          title="تعديل"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition"
                          title="حذف"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400">
                    لا توجد تخصيصات مضافة بعد. يمكنك إضافة تخصيص مستقل لأي رابط لإدارة الحملات ومتابعة أداء التحويل.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Override Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 my-8 animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
              <div>
                <h3 className="font-extrabold text-lg text-brand-navy">
                  {editingItem ? 'تعديل تخصيص الصفحة' : 'إضافة تخصيص صفحة / حملة جديدة'}
                </h3>
                <p className="text-xs text-gray-400">الحقول الفارغة سترث تلقائياً الإعدادات العامة للموقع</p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs sm:text-sm">
              {/* Route Builder Helpers */}
              <div className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-100 space-y-2">
                <span className="text-xs font-bold text-purple-900 block">
                  🛠 مولد المسار التلقائي (اختياري لتسهيل الاختيار):
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    onChange={(e) => {
                      const c = e.target.value;
                      if (c) {
                        setRoutePath(`/${c}/${servicesList[0]?.slug || 'cleaning'}`);
                      }
                    }}
                    className="p-2 rounded-lg border border-purple-200 bg-white text-xs outline-none cursor-pointer"
                  >
                    <option value="">اختر مدينة...</option>
                    {citiesList.map(c => <option key={c.slug} value={c.slug}>{c.nameAr}</option>)}
                  </select>

                  <select
                    onChange={(e) => {
                      const s = e.target.value;
                      if (s) {
                        const currentCity = routePath.split('/')[1] || citiesList[0]?.slug || 'alahsa';
                        setRoutePath(`/${currentCity}/${s}`);
                      }
                    }}
                    className="p-2 rounded-lg border border-purple-200 bg-white text-xs outline-none cursor-pointer"
                  >
                    <option value="">اختر خدمة...</option>
                    {servicesList.map(s => <option key={s.slug} value={s.slug}>{s.nameAr}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    مسار الصفحة المستهدف (Route Path) *
                  </label>
                  <input
                    type="text"
                    required
                    dir="ltr"
                    value={routePath}
                    onChange={(e) => setRoutePath(e.target.value)}
                    placeholder="/alahsa/painting-gypsum"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-mono text-left focus:border-brand-blue outline-none"
                  />
                  <span className="text-[11px] text-gray-400 block mt-1">يجب أن يبدأ بـ /</span>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    اسم الحملة التعريفي (Label) *
                  </label>
                  <input
                    type="text"
                    required
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    placeholder="مثال: حملة دهانات الأحساء تيك توك"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-brand-blue outline-none"
                  />
                </div>
              </div>

              {/* Contact Overrides */}
              <div className="border-t border-gray-100 pt-3">
                <h4 className="font-bold text-brand-navy mb-2">أرقام التواصل المخصصة لهذه الصفحة:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-600 text-xs mb-1">رقم الاتصال المخصص (Phone)</label>
                    <input
                      type="text"
                      dir="ltr"
                      value={overridePhone}
                      onChange={(e) => setOverridePhone(e.target.value)}
                      placeholder="05XXXXXXXX (فارغ = الافتراضي)"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 font-mono text-left outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 text-xs mb-1">رقم الواتساب المخصص (WhatsApp)</label>
                    <input
                      type="text"
                      dir="ltr"
                      value={overrideWhatsapp}
                      onChange={(e) => setOverrideWhatsapp(e.target.value)}
                      placeholder="9665XXXXXXXX (فارغ = الافتراضي)"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 font-mono text-left outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Conversion Pixels Overrides */}
              <div className="border-t border-gray-100 pt-3">
                <h4 className="font-bold text-brand-navy mb-2">بكسلات التتبع المخصصة لهذه الحملة:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-600 text-xs mb-1">Meta Pixel ID (Facebook / Instagram)</label>
                    <input
                      type="text"
                      dir="ltr"
                      value={overrideMetaPixelId}
                      onChange={(e) => setOverrideMetaPixelId(e.target.value)}
                      placeholder="123456789012345"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 font-mono text-left outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 text-xs mb-1">TikTok Pixel ID</label>
                    <input
                      type="text"
                      dir="ltr"
                      value={overrideTiktokPixelId}
                      onChange={(e) => setOverrideTiktokPixelId(e.target.value)}
                      placeholder="CXXXXXXXXXXXXXXXXX"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 font-mono text-left outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 text-xs mb-1">Snapchat Pixel ID</label>
                    <input
                      type="text"
                      dir="ltr"
                      value={overrideSnapchatPixelId}
                      onChange={(e) => setOverrideSnapchatPixelId(e.target.value)}
                      placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 font-mono text-left outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 text-xs mb-1">Google Ads Conversion ID</label>
                    <input
                      type="text"
                      dir="ltr"
                      value={overrideGoogleAdsId}
                      onChange={(e) => setOverrideGoogleAdsId(e.target.value)}
                      placeholder="AW-XXXXXXXXX"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 font-mono text-left outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Routing Overrides */}
              <div className="border-t border-gray-100 pt-3">
                <h4 className="font-bold text-brand-navy mb-2">توجيه طلبات هذه الحملة لفريق مخصص:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-600 text-xs mb-1">Telegram Chat ID مخصص</label>
                    <input
                      type="text"
                      dir="ltr"
                      value={overrideTelegramChatId}
                      onChange={(e) => setOverrideTelegramChatId(e.target.value)}
                      placeholder="-100XXXXXXXXXX"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 font-mono text-left outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 text-xs mb-1">Google Sheet Webhook URL مخصص</label>
                    <input
                      type="url"
                      dir="ltr"
                      value={overrideGoogleSheetUrl}
                      onChange={(e) => setOverrideGoogleSheetUrl(e.target.value)}
                      placeholder="https://script.google.com/macros/s/..."
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 font-mono text-left outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* CRO Landing Page Overrides */}
              <div className="border-t border-gray-100 pt-3">
                <h4 className="font-bold text-brand-navy mb-2">تخصيص نصوص العرض والتحويل (CRO):</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-gray-600 text-xs mb-1">عنوان رئيسي مخصص (Custom Headline)</label>
                    <input
                      type="text"
                      value={customHeadline}
                      onChange={(e) => setCustomHeadline(e.target.value)}
                      placeholder="مثال: خصم 30% على دهانات الفلل بالأحساء لفترة محدودة"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 text-xs mb-1">شارة العرض المميز (Custom Offer Badge)</label>
                    <input
                      type="text"
                      value={customOfferBadge}
                      onChange={(e) => setCustomOfferBadge(e.target.value)}
                      placeholder="مثال: عرض الصيف الحصري لسكان الأحساء"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="overrideActiveCheck"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-blue cursor-pointer"
                />
                <label htmlFor="overrideActiveCheck" className="font-bold text-gray-700 cursor-pointer">
                  التخصيص نشط ومفعل على الصفحة
                </label>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition text-xs"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition flex items-center gap-2 text-xs disabled:opacity-75"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{editingItem ? 'تحديث التخصيص' : 'حفظ التخصيص'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
