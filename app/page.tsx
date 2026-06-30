'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const hotelName = " PENGINAPAN SEE ROSE II "; 

  // Cek apakah pengguna sudah login atau belum saat membuka halaman
  useEffect(() => {
    const checkUserSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };

    checkUserSession();

    // Dengarkan perubahan status autentikasi secara real-time
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 bg-blue-950 z-50 border-b border-blue-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-wider text-white">
            {hotelName}
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            {loading ? (
              <span className="text-sm text-gray-400 animate-pulse">Memeriksa sesi...</span>
            ) : user ? (
              /* Jika Sudah Login */
              <Link 
                href="/kamar" 
                className="px-5 py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition shadow-md"
              >
                (Pesan Kamar)
              </Link>
            ) : (
              /* Jika Belum Login */
              <>
                <Link 
                  href="/login" 
                  className="px-5 py-2.5 rounded-xl border border-blue-800 text-sm font-semibold hover:bg-blue-900 transition text-white"
                >
                  Masuk Tamu
                </Link>
                <Link 
                  href="/register" 
                  className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition shadow-md"
                >
                  Daftar Sekarang
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <div className="md:hidden bg-blue-950 border-b border-blue-900 px-6 py-4 flex flex-col gap-3 shadow-lg">
            {user ? (
              <Link href="/kamar" onClick={() => setMenuOpen(false)} className="text-green-400 font-semibold py-1">(Pesan Kamar)</Link>
            ) : (
              <>
                <Link href="/login" onClick={() => setMenuOpen(false)} className="text-white font-medium py-1">Masuk Tamu</Link>
                <Link href="/register" onClick={() => setMenuOpen(false)} className="text-white font-medium py-1">Daftar Sekarang</Link>
              </>
            )}
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <header 
        className="relative pt-20 h-[80vh] flex items-center justify-center bg-cover bg-center text-white"
        style={{ 
          backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.8)), url('/images/login-bg.jpg')` 
        }}
      >
        <div className="max-w-4xl mx-auto text-center px-6 space-y-6">
          <p className="text-sm font-bold tracking-widest uppercase text-blue-400">Selamat Datang di {hotelName}</p>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Temukan Kenyamanan Menginap Terbaik
          </h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto font-light">
            Penginapan bersih, aman, dan berlokasi strategis untuk kebutuhan istirahat Anda.
          </p>
          <div className="pt-4">
            {/* Tombol Utama Dinamis */}
            <Link 
              href={user ? "/kamar" : "/login"} 
              className={`inline-block font-bold px-8 py-4 rounded-2xl shadow-lg transition transform hover:-translate-y-0.5 ${
                user ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-amber-500 hover:bg-amber-600 text-blue-950'
              }`}
            >
              {user ? "Pesan Kamar" : "Pesan Kamar"}
            </Link>
          </div>
        </div>
      </header>

      {/* DETAIL INFO & FASILITAS */}
      <section className="py-20 max-w-7xl mx-auto px-6 flex-1">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-blue-950 mb-6">Tentang Penginapan Kami</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Kami berkomitmen menyajikan pengalaman menginap yang nyaman dan praktis tanpa menguras kantong Anda. Setiap unit kamar kami dirawat secara berkala demi menjaga kebersihan standar hotel.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 grid grid-cols-2 gap-6">
            <div className="space-y-1"><div className="text-2xl">⚡</div><h4 className="font-bold text-gray-800 text-sm">Wi-Fi Cepat</h4></div>
            <div className="space-y-1"><div className="text-2xl">🅿️</div><h4 className="font-bold text-gray-800 text-sm">Parkir Luas</h4></div>
            <div className="space-y-1"><div className="text-2xl">❄️</div><h4 className="font-bold text-gray-800 text-sm">AC & kipas Angin</h4></div>
            <div className="space-y-1"><div className="text-2xl">🔑</div><h4 className="font-bold text-gray-800 text-sm">Resepsionis 24 Jam</h4></div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-blue-950 text-gray-400 py-8 text-sm text-center border-t border-blue-900">
        <p>© 2026 {hotelName}. Hak Cipta Dilindungi.</p>
      </footer>
    </div>
  );
}