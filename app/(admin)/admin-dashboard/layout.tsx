'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex">
        <div className="p-5 text-xl font-bold border-b border-slate-800">
          Admin Seerosedua
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin-dashboard/kamar" className="block p-3 rounded-lg hover:bg-slate-800 transition">
            📂 Mengelola Kamar
          </Link>
          
          {/* PERBAIKAN: Diubah dari /admin-dashboard/tamu menjadi /admin-dashboard */}
          <Link href="/admin-dashboard" className="block p-3 rounded-lg hover:bg-slate-800 transition">
            💳 Konfirmasi Pembayaran & Tamu
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="w-full bg-red-600 hover:bg-red-700 p-2 rounded-lg text-sm font-semibold transition">
            Keluar (Logout)
          </button>
        </div>
      </aside>

      {/* Konten Utama */}
      <div className="flex-1 flex flex-col">
        {/* Navbar Atas untuk Mobile */}
        <header className="bg-white shadow p-4 flex justify-between items-center md:hidden">
          <span className="font-bold">Admin Panel</span>
          <div className="space-x-4 text-sm">
            <Link href="/admin-dashboard/kamar" className="text-blue-600 font-medium">Kamar</Link>
            
            {/* PERBAIKAN MOBILE: Diubah menjadi /admin-dashboard */}
            <Link href="/admin-dashboard" className="text-blue-600 font-medium">Pembayaran</Link>
            
            <button onClick={handleLogout} className="text-red-600 font-medium">Keluar</button>
          </div>
        </header>

        <main className="p-6 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}