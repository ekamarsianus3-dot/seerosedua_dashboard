'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function TamuLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // Menggunakan window.location agar sesi benar-benar bersih saat keluar
    window.location.href = '/login'; 
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800">
      {/* Navbar Atas */}
      <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          {/* Logo diarahkan ke root / (Landing Page Utama) */}
          <Link href="/" className="text-xl font-bold text-blue-600 tracking-wide">
            PENGINAPAN SEE ROSE II 
          </Link>

          {/* Menu Desktop */}
          <nav className="hidden md:flex items-center space-x-6 font-medium">
            <Link href="/" className="hover:text-blue-600 transition">Home</Link>
            <Link href="/tentang" className="hover:text-blue-600 transition">Tentang Penginapan</Link>
            <Link href="/kamar" className="hover:text-blue-600 transition">Informasi Kamar</Link>
            
            {/* Tombol Baru untuk Riwayat Pesanan */}
            <Link href="/pembayaran/riwayat" className="text-amber-600 font-semibold hover:text-amber-700 transition">
              Riwayat Pesanan
            </Link>

            <button onClick={handleLogout} className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-xl text-sm font-semibold transition">
              Keluar
            </button>
          </nav>

          {/* Tombol Hamburger Mobile */}
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-black focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Menu Dropdown Mobile */}
        {menuOpen && (
          <div className="md:hidden bg-white border-b px-4 py-4 space-y-3 shadow-inner flex flex-col font-medium">
            <Link href="/" onClick={() => setMenuOpen(false)} className="hover:text-blue-600 py-1">Home</Link>
            <Link href="/tentang" onClick={() => setMenuOpen(false)} className="hover:text-blue-600 py-1">Tentang Penginapan</Link>
            <Link href="/kamar" onClick={() => setMenuOpen(false)} className="hover:text-blue-600 py-1">Informasi Kamar</Link>
            
            {/* Tombol Baru untuk Riwayat Pesanan Mobile */}
            <Link href="/pembayaran/riwayat" onClick={() => setMenuOpen(false)} className="text-amber-600 font-semibold py-1">
              Riwayat Pesanan
            </Link>

            <button onClick={() => { setMenuOpen(false); handleLogout(); }} className="w-full text-left text-red-600 py-1 font-semibold">
              Keluar
            </button>
          </div>
        )}
      </header>

      {/* Konten Halaman */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 text-center text-sm border-t border-gray-800">
        <p>&copy; 2026 PENGINAPAN SEE ROSE II. All rights reserved.</p>
      </footer>
    </div>
  );
}