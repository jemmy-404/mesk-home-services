'use client';

import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  X,
  Loader2,
} from 'lucide-react';

interface CityItem {
  id: number;
  slug: string;
  nameAr: string;
  isActive: boolean;
  sortOrder: number;
}

export default function AdminCitiesPage() {
  const [cities, setCities] = useState<CityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingCity, setEditingCity] = useState<CityItem | null>(null);

  // Form states
  const [nameAr, setNameAr] = useState('');
  const [slug, setSlug] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState(0);

  const fetchCities = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/cities');
      const data = await res.json();
      if (data.cities) setCities(data.cities);
    } catch (err) {
      console.error('Error fetching cities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  const openCreateModal = () => {
    setEditingCity(null);
    setNameAr('');
    setSlug('');
    setIsActive(true);
    setSortOrder(cities.length + 1);
    setModalOpen(true);
  };

  const openEditModal = (c: CityItem) => {
    setEditingCity(c);
    setNameAr(c.nameAr);
    setSlug(c.slug);
    setIsActive(c.isActive);
    setSortOrder(c.sortOrder);
    setModalOpen(true);
  };

  const handleSaveCity = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const method = editingCity ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/cities', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingCity?.id,
          nameAr,
          slug,
          isActive,
          sortOrder,
        }),
      });

      if (res.ok) {
        setModalOpen(false);
        fetchCities();
      } else {
        const data = await res.json();
        alert(data.error || 'حدث خطأ أثناء الحفظ');
      }
    } catch (err) {
      console.error('Save city error:', err);
      alert('فشل الاتصال بالخادم');
    } finally {
      setSaving(false);
    }
  };

  const toggleCityActive = async (c: CityItem) => {
    const updatedStatus = !c.isActive;
    setCities(prev => prev.map(item => item.id === c.id ? { ...item, isActive: updatedStatus } : item));
    try {
      await fetch('/api/admin/cities', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: c.id, isActive: updatedStatus }),
      });
    } catch (err) {
      console.error('Toggle city error:', err);
      fetchCities();
    }
  };

  const handleDeleteCity = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذه المدينة؟')) return;
    setCities(prev => prev.filter(c => c.id !== id));
    try {
      await fetch(`/api/admin/cities?id=${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Delete city error:', err);
      fetchCities();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-black text-brand-navy">المدن ومناطق التغطية</h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            إدارة المدن المستهدفة وتوليد صفحات الهبوط التلقائية Programmatic SEO
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white text-xs sm:text-sm font-bold shadow-md transition transform active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة مدينة جديدة</span>
        </button>
      </div>

      {/* Cities Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-gray-50 text-gray-600 font-bold border-b border-gray-100">
              <tr>
                <th className="p-3.5">#</th>
                <th className="p-3.5">اسم المدينة (بالعربي)</th>
                <th className="p-3.5">الرابط الفريد (Slug)</th>
                <th className="p-3.5">الترتيب</th>
                <th className="p-3.5">الحالة</th>
                <th className="p-3.5 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">
                    جاري تحميل المدن...
                  </td>
                </tr>
              ) : cities.length > 0 ? (
                cities.map((city) => (
                  <tr key={city.id} className="hover:bg-gray-50/70 transition">
                    <td className="p-3.5 text-gray-400 font-mono">{city.id}</td>
                    <td className="p-3.5 font-bold text-brand-navy flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-brand-orange" />
                      <span>{city.nameAr}</span>
                    </td>
                    <td className="p-3.5 font-mono text-gray-600" dir="ltr">
                      /{city.slug}/...
                    </td>
                    <td className="p-3.5 font-mono text-gray-500">{city.sortOrder}</td>
                    <td className="p-3.5">
                      <button
                        type="button"
                        onClick={() => toggleCityActive(city)}
                        className={`px-2.5 py-1 rounded-full text-xs font-bold transition flex items-center gap-1 ${
                          city.isActive
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {city.isActive ? (
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
                    </td>
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => openEditModal(city)}
                          className="p-1.5 rounded-lg bg-blue-50 text-brand-blue hover:bg-blue-100 transition"
                          title="تعديل المدينة"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCity(city.id)}
                          className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition"
                          title="حذف المدينة"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">
                    لا توجد مدن مضافة بعد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm overflow-y-auto p-4 sm:p-6">
          <div className="min-h-full flex items-center justify-center">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 my-8 relative">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
                <h3 className="font-extrabold text-lg text-brand-navy">
                  {editingCity ? 'تعديل المدينة' : 'إضافة مدينة جديدة'}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

            <form onSubmit={handleSaveCity} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-gray-700 mb-1">اسم المدينة (بالعربي) *</label>
                <input
                  type="text"
                  required
                  value={nameAr}
                  onChange={(e) => setNameAr(e.target.value)}
                  placeholder="مثال: الأحساء"
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
                  placeholder="alahsa"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-brand-blue outline-none font-mono text-left"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                    id="isCityActive"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-blue cursor-pointer"
                  />
                  <label htmlFor="isCityActive" className="font-bold text-gray-700 cursor-pointer">
                    المدينة نشطة
                  </label>
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
                  className="px-6 py-2.5 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white font-bold transition flex items-center gap-2 text-xs disabled:opacity-75"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{editingCity ? 'تحديث المدينة' : 'إضافة المدينة'}</span>
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
