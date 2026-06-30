'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const hotelName = "SEE ROSE II"; 

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
    <div className="min-h-screen bg-white text-slate-800 font-sans flex flex-col">
      
      {/* NAVBAR - Warna Konsisten (Deep Blue) */}
      <nav className="fixed top-0 left-0 right-0 bg-blue-950/95 backdrop-blur-md z-50 border-b border-blue-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="text-2xl font-black tracking-tighter text-white">
            {hotelName}
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            {loading ? (
              <span className="text-sm text-blue-300 animate-pulse">Memeriksa sesi...</span>
            ) : user ? (
              <Link href="/kamar" className="px-6 py-2.5 rounded-full bg-green-500 hover:bg-green-600 text-white text-sm font-bold transition shadow-md">
                Area Tamu (Pesan Kamar)
              </Link>
            ) : (
              <>
                <Link href="/login" className="px-5 py-2.5 rounded-full text-blue-100 hover:text-white text-sm font-semibold transition">Masuk</Link>
                <Link href="/register" className="px-6 py-2.5 rounded-full bg-white text-blue-950 text-sm font-bold hover:bg-blue-50 transition shadow-md">Daftar Sekarang</Link>
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
          <div className="md:hidden bg-blue-950 border-t border-blue-900 px-6 py-4 flex flex-col gap-3 shadow-lg">
            {user ? (
              <Link href="/kamar" onClick={() => setMenuOpen(false)} className="text-green-400 font-bold py-1">Area Tamu (Pesan Kamar)</Link>
            ) : (
              <>
                <Link href="/login" onClick={() => setMenuOpen(false)} className="text-white font-medium py-1">Masuk</Link>
                <Link href="/register" onClick={() => setMenuOpen(false)} className="text-white font-medium py-1">Daftar</Link>
              </>
            )}
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <header className="relative pt-32 pb-20 px-6 flex items-center justify-center bg-blue-950 text-white min-h-[70vh]">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <span className="px-4 py-1.5 rounded-full border border-blue-500 bg-blue-900 text-blue-200 text-xs font-bold uppercase tracking-widest">
            Selamat Datang di {hotelName}
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
            Istirahat Berkualitas <br/><span className="text-blue-400">Pilihan Utama Anda</span>
          </h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto font-light">
            Penginapan bersih, aman, dan berlokasi strategis. Kenyamanan Anda adalah prioritas kami.
          </p>
          <div className="pt-4">
            <Link href={user ? "/kamar" : "/login"} 
              className="inline-block font-bold px-10 py-5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-blue-950 transition-all hover:scale-105 shadow-xl">
              {user ? "Lihat Katalog Kamar" : "Lihat & Pesan Kamar Sekarang"}
            </Link>
          </div>
        </div>
      </header>

      {/* DETAIL INFO & FASILITAS */}
      <section className="py-24 bg-white max-w-7xl mx-auto px-6 flex-1">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-black text-slate-900 mb-6">Tentang Kami</h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Kami berkomitmen menyajikan pengalaman menginap yang nyaman dan praktis. Setiap unit kamar kami dirawat dengan standar kebersihan tinggi untuk memastikan istirahat Anda tenang dan berkesan.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: '⚡', title: 'Wi-Fi Cepat' },
              { icon: '🅿️', title: 'Parkir Luas' },
              { icon: '❄️', title: 'AC Dingin' },
              { icon: '🔑', title: '24/7 Service' }
            ].map((item, idx) => (
              <div key={idx} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h4 className="font-bold text-slate-800">{item.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER - Warna Konsisten (Deep Blue) */}
      <footer className="bg-blue-950 text-blue-300 py-12 text-center border-t border-blue-900">
        <div className="max-w-7xl mx-auto px-6">
          <p className="font-bold text-lg text-white mb-2">{hotelName}</p>
          <p className="text-sm">© 2026 {hotelName}. Seluruh Hak Cipta Dilindungi.</p>
        </div>
      </footer>
    </div>
  );
}