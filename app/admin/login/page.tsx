'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Lock, User, LogIn, AlertCircle, Loader2 } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/admin';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'فشل تسجيل الدخول');
      }

      window.location.href = redirectPath;
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
      <div className="text-center mb-8">
        <div className="relative w-20 h-20 mx-auto mb-3">
          <Image
            src="/images/logo-badge.png"
            alt="شركة مسك"
            fill
            className="object-contain"
          />
        </div>
        <h1 className="text-2xl font-black text-brand-navy">لوحة إدارة شركة مسك</h1>
        <p className="text-gray-500 text-xs mt-1">سجل الدخول لإدارة الطلبات والخدمات والحملات الإعلانية</p>
      </div>

      {errorMsg && (
        <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">
            اسم المستخدم
          </label>
          <div className="relative">
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              className="w-full pr-10 pl-3.5 py-3 rounded-xl border border-gray-300 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none text-sm transition"
            />
            <User className="w-5 h-5 text-gray-400 absolute right-3 top-3.5" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">
            كلمة المرور
          </label>
          <div className="relative">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pr-10 pl-3.5 py-3 rounded-xl border border-gray-300 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none text-sm transition"
            />
            <Lock className="w-5 h-5 text-gray-400 absolute right-3 top-3.5" />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-3.5 bg-brand-orange hover:bg-brand-orange-hover text-white font-extrabold text-sm rounded-xl shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-75 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>جاري التحقق...</span>
            </>
          ) : (
            <>
              <LogIn className="w-5 h-5" />
              <span>تسجيل الدخول</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-8 text-center border-t border-gray-100 pt-4">
        <a
          href="/"
          className="text-xs text-brand-blue hover:text-brand-blue-dark font-bold transition"
        >
          ← العودة للموقع الرئيسي
        </a>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-navy via-[#112239] to-brand-navy flex items-center justify-center p-4">
      <Suspense fallback={
        <div className="text-white text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-brand-blue" />
          <span>جاري التحميل...</span>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}
