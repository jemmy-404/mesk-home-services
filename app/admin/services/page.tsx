'use client';

import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  X,
  Loader2,
  Sparkles,
} from 'lucide-react';
import ServiceIcon from '@/components/ServiceIcon';

interface ServiceItem {
  id: number;
  slug: string;
  nameAr: string;
  shortDesc: string;
  fullContent: string;
  iconName: string;
  featuresJson: string;
  faqsJson: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  isActive: boolean;
  sortOrder: number;
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  // Form states
  const [nameAr, setNameAr] = useState('');
  const [slug, setSlug] = useState('');
  const [iconName, setIconName] = useState('Sparkles');
  const [shortDesc, setShortDesc] = useState('');
  const [fullContent, setFullContent] = useState('');
  const [featuresText, setFeaturesText] = useState('');
  const [faqsList, setFaqsList] = useState<{ question: string; answer: string }[]>([]);
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState(0);

  const availableIcons = [
    'Sparkles', 'Truck', 'Bug', 'Trees', 'ShieldCheck',
    'Paintbrush', 'Flame', 'Wind', 'Droplets', 'DoorClosed'
  ];

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/services');
      const data = await res.json();
      if (data.services) setServices(data.services);
    } catch (err) {
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openCreateModal = () => {
    setEditingService(null);
    setNameAr('');
    setSlug('');
    setIconName('Sparkles');
    setShortDesc('');
    setFullContent('');
    setFeaturesText('');
    setFaqsList([
      { question: '', answer: '' },
      { question: '', answer: '' },
    ]);
    setMetaTitle('');
    setMetaDescription('');
    setIsActive(true);
    setSortOrder(services.length + 1);
    setModalOpen(true);
  };

  const openEditModal = (s: ServiceItem) => {
    setEditingService(s);
    setNameAr(s.nameAr);
    setSlug(s.slug);
    setIconName(s.iconName || 'Sparkles');
    setShortDesc(s.shortDesc || '');
    setFullContent(s.fullContent || '');
    
    try {
      const parsedFeatures = JSON.parse(s.featuresJson || '[]');
      setFeaturesText(parsedFeatures.join('\n'));
    } catch {
      setFeaturesText('');
    }

    try {
      const parsedFaqs = JSON.parse(s.faqsJson || '[]');
      setFaqsList(parsedFaqs.length > 0 ? parsedFaqs : [{ question: '', answer: '' }]);
    } catch {
      setFaqsList([{ question: '', answer: '' }]);
    }

    setMetaTitle(s.metaTitle || '');
    setMetaDescription(s.metaDescription || '');
    setIsActive(s.isActive);
    setSortOrder(s.sortOrder);
    setModalOpen(true);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const features = featuresText
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean);

    const faqs = faqsList.filter(f => f.question.trim() && f.answer.trim());

    const payload = {
      id: editingService?.id,
      nameAr,
      slug,
      iconName,
      shortDesc,
      fullContent,
      features,
      faqs,
      metaTitle,
      metaDescription,
      isActive,
      sortOrder,
    };

    try {
      const method = editingService ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/services', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setModalOpen(false);
        fetchServices();
      } else {
        const data = await res.json();
        alert(data.error || 'حدث خطأ أثناء الحفظ');
      }
    } catch (err) {
      console.error('Save service error:', err);
      alert('فشل الاتصال بالخادم');
    } finally {
      setSaving(false);
    }
  };

  const toggleServiceActive = async (s: ServiceItem) => {
    const updatedStatus = !s.isActive;
    setServices(prev => prev.map(item => item.id === s.id ? { ...item, isActive: updatedStatus } : item));
    try {
      await fetch('/api/admin/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: s.id, isActive: updatedStatus }),
      });
    } catch (err) {
      console.error('Toggle service error:', err);
      fetchServices();
    }
  };

  const handleDeleteService = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذه الخدمة؟')) return;
    setServices(prev => prev.filter(s => s.id !== id));
    try {
      await fetch(`/api/admin/services?id=${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Delete service error:', err);
      fetchServices();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-black text-brand-navy">إدارة الخدمات المنزلية</h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            إضافة، تعديل، تفعيل أو تعطيل الخدمات والمحتوى الإعلاني والسيو
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue-dark text-white text-xs sm:text-sm font-bold shadow-md transition transform active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة خدمة جديدة</span>
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 text-center py-12 text-gray-400">
            جاري تحميل الخدمات...
          </div>
        ) : services.length > 0 ? (
          services.map((service) => (
            <div
              key={service.id}
              className={`bg-white rounded-2xl border p-5 shadow-sm transition flex flex-col justify-between ${
                service.isActive ? 'border-gray-200' : 'border-red-200 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-sky-100 text-brand-blue flex items-center justify-center">
                    <ServiceIcon name={service.iconName} className="w-6 h-6" />
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleServiceActive(service)}
                    className={`px-2.5 py-1 rounded-full text-xs font-bold transition flex items-center gap-1 ${
                      service.isActive
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {service.isActive ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>نشط</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5" />
                        <span>معطل</span>
                      </>
                    )}
                  </button>
                </div>

                <h3 className="font-bold text-base text-brand-navy mb-1">{service.nameAr}</h3>
                <span className="text-[11px] font-mono text-gray-400 block mb-2" dir="ltr">
                  /services/{service.slug}
                </span>
                <p className="text-gray-500 text-xs line-clamp-3 leading-relaxed mb-4">
                  {service.shortDesc}
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] text-gray-400">الترتيب: {service.sortOrder}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(service)}
                    className="p-1.5 rounded-lg bg-blue-50 text-brand-blue hover:bg-blue-100 transition"
                    title="تعديل الخدمة"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteService(service.id)}
                    className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition"
                    title="حذف الخدمة"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-12 text-gray-400">
            لا توجد خدمات مضافة حتى الآن.
          </div>
        )}
      </div>

      {/* Add / Edit Service Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm overflow-y-auto p-4 sm:p-6">
          <div className="min-h-full flex items-center justify-center">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 my-8 relative">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
                <h3 className="font-extrabold text-lg text-brand-navy">
                  {editingService ? 'تعديل الخدمة' : 'إضافة خدمة جديدة'}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

            <form onSubmit={handleSaveService} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">اسم الخدمة (بالعربي) *</label>
                  <input
                    type="text"
                    required
                    value={nameAr}
                    onChange={(e) => setNameAr(e.target.value)}
                    placeholder="مثال: خدمات التنظيف الشاملة"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-brand-blue outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">الرابط الفريد (Slug) *</label>
                  <input
                    type="text"
                    required
                    dir="ltr"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="cleaning"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-brand-blue outline-none font-mono text-left"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">الأيقونة</label>
                  <select
                    value={iconName}
                    onChange={(e) => setIconName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 bg-white outline-none cursor-pointer"
                  >
                    {availableIcons.map(icon => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">الترتيب</label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="isActiveCheck"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-blue cursor-pointer"
                  />
                  <label htmlFor="isActiveCheck" className="font-bold text-gray-700 cursor-pointer">
                    الخدمة نشطة ومفعلة
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">الوصف المختصر (للكروت والبطاقات)</label>
                <textarea
                  rows={2}
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  placeholder="وصف تسويقي موجز يظهر في الصفحة الرئيسية..."
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">المحتوى الكامل للخدمة (صفحة الخدمة)</label>
                <textarea
                  rows={4}
                  value={fullContent}
                  onChange={(e) => setFullContent(e.target.value)}
                  placeholder="شرح وافٍ وتفصيلي عن الخدمة، المعدات، وطريقة العمل..."
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  المميزات والنقاط البارزة (كل ميزة في سطر منفصل)
                </label>
                <textarea
                  rows={3}
                  value={featuresText}
                  onChange={(e) => setFeaturesText(e.target.value)}
                  placeholder="تنظيف عميق بالبخار&#10;عمالة فلبينية وهندية مدربة&#10;ضمان شامل على الخدمة"
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 outline-none font-sans"
                />
              </div>

              {/* FAQs Manager */}
              <div className="border-t border-gray-100 pt-3">
                <div className="flex items-center justify-between mb-2">
                  <label className="font-bold text-gray-700">الأسئلة الشائعة للخدمة (FAQs)</label>
                  <button
                    type="button"
                    onClick={() => setFaqsList(prev => [...prev, { question: '', answer: '' }])}
                    className="text-xs text-brand-blue hover:underline font-bold"
                  >
                    + إضافة سؤال جديد
                  </button>
                </div>

                <div className="space-y-3">
                  {faqsList.map((faq, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-gray-50 border border-gray-200 space-y-2 relative">
                      <input
                        type="text"
                        placeholder="نص السؤال (مثال: هل توفرون ضماناً؟)"
                        value={faq.question}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFaqsList(prev => prev.map((f, i) => i === idx ? { ...f, question: val } : f));
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs outline-none"
                      />
                      <textarea
                        rows={2}
                        placeholder="نص الإجابة الوافية..."
                        value={faq.answer}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFaqsList(prev => prev.map((f, i) => i === idx ? { ...f, answer: val } : f));
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs outline-none"
                      />
                      {faqsList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setFaqsList(prev => prev.filter((_, i) => i !== idx))}
                          className="text-[11px] text-red-500 hover:underline"
                        >
                          حذف السؤال
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* SEO Meta */}
              <div className="border-t border-gray-100 pt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">عنوان السيو (Meta Title)</label>
                  <input
                    type="text"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    placeholder="عنوان مميز يظهر في نتائج بحث جوجل"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">وصف السيو (Meta Description)</label>
                  <input
                    type="text"
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder="وصف جذاب للنقر ومحركات البحث"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs outline-none"
                  />
                </div>
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
                  className="px-6 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue-dark text-white font-bold transition flex items-center gap-2 text-xs disabled:opacity-75"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{editingService ? 'تحديث الخدمة' : 'حفظ الخدمة'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
