'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Download,
  PhoneCall,
  MessageCircle,
  Trash2,
  Activity,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  ExternalLink,
} from 'lucide-react';

interface LeadItem {
  id: number;
  name: string;
  phone: string;
  serviceName: string;
  cityName: string;
  sourcePath: string;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  status: string;
  routingLogsJson?: string | null;
  createdAt: string;
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [serviceFilter, setServiceFilter] = useState('ALL');
  const [activeLogLead, setActiveLogLead] = useState<LeadItem | null>(null);

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (statusFilter !== 'ALL') params.set('status', statusFilter);
      if (serviceFilter !== 'ALL') params.set('service', serviceFilter);

      const res = await fetch(`/api/admin/leads?${params.toString()}`);
      const data = await res.json();
      if (data.leads) {
        setLeads(data.leads);
      }
    } catch (err) {
      console.error('Error fetching leads:', err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, serviceFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLeads();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchLeads]);

  const handleStatusChange = async (id: number, newStatus: string) => {
    // Optimistic update
    setLeads(prev => prev.map(l => (l.id === id ? { ...l, status: newStatus } : l)));

    try {
      await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
    } catch (err) {
      console.error('Error updating status:', err);
      fetchLeads();
    }
  };

  const handleDeleteLead = async (id: number) => {
    if (!confirm('هل أنت متأكد من رغبتك في حذف هذا الطلب؟')) return;

    setLeads(prev => prev.filter(l => l.id !== id));
    try {
      await fetch(`/api/admin/leads?id=${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Error deleting lead:', err);
      fetchLeads();
    }
  };

  const statusOptions = [
    { value: 'NEW', label: 'جديد', color: 'bg-amber-100 text-amber-800 border-amber-300' },
    { value: 'CONTACTED', label: 'تم التواصل', color: 'bg-blue-100 text-blue-800 border-blue-300' },
    { value: 'ASSIGNED', label: 'قيد التنفيذ', color: 'bg-purple-100 text-purple-800 border-purple-300' },
    { value: 'CLOSED', label: 'مكتمل ومغلق', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header & Export Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-black text-brand-navy">إدارة الطلبات والعملاء</h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            متابعة العملاء المحتملين وتحديث حالات الطلبات وسجلات التوجيه الفوري
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/api/admin/leads/export"
            download
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md transition transform active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>تصدير إلى Excel (CSV)</span>
          </a>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث بالاسم أو رقم الجوال أو المدينة..."
            className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-gray-300 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none text-xs sm:text-sm"
          />
          <Search className="w-4 h-4 text-gray-400 absolute right-3.5 top-3" />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm bg-white focus:border-brand-blue outline-none cursor-pointer flex-1 md:flex-none"
          >
            <option value="ALL">جميع الحالات</option>
            <option value="NEW">جديد (NEW)</option>
            <option value="CONTACTED">تم التواصل (CONTACTED)</option>
            <option value="ASSIGNED">قيد التنفيذ (ASSIGNED)</option>
            <option value="CLOSED">مكتمل (CLOSED)</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-gray-50 text-gray-600 font-bold border-b border-gray-100">
              <tr>
                <th className="p-3.5">#</th>
                <th className="p-3.5">العميل</th>
                <th className="p-3.5">الجوال</th>
                <th className="p-3.5">الخدمة والمدينة</th>
                <th className="p-3.5">مصدر الإعلان</th>
                <th className="p-3.5">حالة الطلب</th>
                <th className="p-3.5">التوجيه</th>
                <th className="p-3.5">الوقت</th>
                <th className="p-3.5 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-gray-400">
                    جاري تحميل الطلبات...
                  </td>
                </tr>
              ) : leads.length > 0 ? (
                leads.map((lead) => {
                  const cleanPhone = lead.phone.replace(/\D/g, '');
                  const waNumber = cleanPhone.startsWith('966') ? cleanPhone : cleanPhone.startsWith('0') ? `966${cleanPhone.slice(1)}` : cleanPhone;
                  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(`السلام عليكم ${lead.name}، بخصوص طلبك لخدمة ${lead.serviceName} من شركة مسك.`)}`;

                  return (
                    <tr key={lead.id} className="hover:bg-gray-50/70 transition">
                      <td className="p-3.5 text-gray-400 font-mono">{lead.id}</td>
                      <td className="p-3.5 font-bold text-brand-navy whitespace-nowrap">
                        {lead.name}
                      </td>
                      <td className="p-3.5 font-mono text-gray-800 whitespace-nowrap" dir="ltr">
                        {lead.phone}
                      </td>
                      <td className="p-3.5 whitespace-nowrap">
                        <span className="font-semibold block text-brand-navy">{lead.serviceName}</span>
                        <span className="text-[11px] text-gray-500">📍 {lead.cityName}</span>
                      </td>
                      <td className="p-3.5 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-sky-50 text-brand-blue-dark font-mono text-[11px] border border-sky-100 block w-max">
                          {lead.utmSource || 'مباشر'}
                        </span>
                        {lead.utmCampaign && (
                          <span className="text-[10px] text-gray-400 block mt-0.5 max-w-[120px] truncate" title={lead.utmCampaign}>
                            {lead.utmCampaign}
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 whitespace-nowrap">
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                          className="px-2.5 py-1 text-xs font-bold rounded-lg border outline-none bg-white cursor-pointer"
                        >
                          {statusOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-3.5 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setActiveLogLead(lead)}
                          className="inline-flex items-center gap-1 text-[11px] text-brand-blue hover:underline font-semibold"
                        >
                          <Activity className="w-3.5 h-3.5" />
                          <span>السجلات</span>
                        </button>
                      </td>
                      <td className="p-3.5 text-gray-400 text-[11px] whitespace-nowrap">
                        {new Date(lead.createdAt).toLocaleString('ar', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="p-3.5 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Direct Call */}
                          <a
                            href={`tel:${lead.phone}`}
                            className="p-1.5 rounded-lg bg-orange-50 text-brand-orange hover:bg-orange-100 transition"
                            title="اتصال بالعميل"
                          >
                            <PhoneCall className="w-3.5 h-3.5" />
                          </a>

                          {/* Direct WhatsApp */}
                          <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition"
                            title="محادثة واتساب"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>

                          {/* Delete Lead */}
                          <button
                            type="button"
                            onClick={() => handleDeleteLead(lead.id)}
                            className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition"
                            title="حذف الطلب"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="p-10 text-center text-gray-400">
                    لا توجد طلبات تطابق الفلتر المحدد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Routing Logs Modal */}
      {activeLogLead && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <div>
                <h3 className="font-bold text-base text-brand-navy">
                  سجل التوجيه الفوري للطلب #{activeLogLead.id}
                </h3>
                <span className="text-xs text-gray-500">
                  {activeLogLead.name} ({activeLogLead.phone})
                </span>
              </div>
              <button
                onClick={() => setActiveLogLead(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="text-xs bg-gray-50 p-3 rounded-xl border border-gray-100 space-y-1">
                <div><strong>الصفحة المصدر:</strong> {activeLogLead.sourcePath}</div>
                <div><strong>مصدر الزيارة (UTM):</strong> {activeLogLead.utmSource || 'مباشر'}</div>
                <div><strong>الحملة:</strong> {activeLogLead.utmCampaign || 'غير محدد'}</div>
              </div>

              <h4 className="text-xs font-bold text-gray-700 pt-2">نتائج قنوات الإشعار والتوجيه:</h4>
              
              {activeLogLead.routingLogsJson ? (
                <div className="space-y-2">
                  {(JSON.parse(activeLogLead.routingLogsJson) as any[]).map((log, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl text-xs border flex items-start justify-between ${
                        log.status === 'SUCCESS'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                          : log.status === 'FAILED'
                          ? 'bg-red-50 border-red-200 text-red-800'
                          : 'bg-gray-50 border-gray-200 text-gray-600'
                      }`}
                    >
                      <div>
                        <span className="font-bold block">{log.channel}</span>
                        <span className="text-[11px] opacity-90">{log.detail}</span>
                      </div>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-white/70">
                        {log.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 text-center py-4">
                  لا توجد سجلات توجيه مسجلة لهذا الطلب.
                </p>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 text-left">
              <button
                onClick={() => setActiveLogLead(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
