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
      
      {/* NAVBAR (Header konsisten dengan warna footer: bg-blue-950) */}
      <nav className="sticky top-0 left-0 right-0 bg-blue-950/95 backdrop-blur-md z-50 border-b border-blue-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <Link href="/" className="text-2xl font-black tracking-wider text-white hover:text-blue-200 transition">
            {hotelName}
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            {loading ? (
              <span className="text-sm text-gray-400 animate-pulse">Memeriksa sesi...</span>
            ) : user ? (
              /* Jika Sudah Login */
              <div className="flex items-center gap-4">
                {/* Tombol Riwayat Pesanan Saya */}
                <Link 
                  href="/pembayaran/riwayat" 
                  className="px-5 py-2.5 rounded-xl bg-amber-500 text-blue-950 text-sm font-bold hover:bg-amber-400 transition shadow-md"
                >
                  Riwayat Pesanan Saya
                </Link>
                <Link 
                  href="/kamar" 
                  className="px-5 py-2.5 rounded-xl bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition shadow-md"
                >
                  Area Tamu (Pesan Kamar)
                </Link>
              </div>
            ) : (
              /* Jika Belum Login */
              <>
                <Link 
                  href="/login" 
                  className="px-5 py-2.5 rounded-xl border border-white/20 text-white text-sm font-semibold hover:bg-white/10 transition"
                >
                  Masuk Tamu
                </Link>
                <Link 
                  href="/register" 
                  className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 transition shadow-md"
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
          <div className="md:hidden bg-blue-950 border-t border-blue-900 px-6 py-4 flex flex-col gap-3 shadow-lg">
            {user ? (
              <>
                <Link href="/pembayaran/riwayat" onClick={() => setMenuOpen(false)} className="text-amber-400 font-bold py-1">Riwayat Pesanan Saya</Link>
                <Link href="/kamar" onClick={() => setMenuOpen(false)} className="text-green-400 font-bold py-1">Area Tamu (Pesan Kamar)</Link>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMenuOpen(false)} className="text-white font-medium py-1">Masuk Tamu</Link>
                <Link href="/register" onClick={() => setMenuOpen(false)} className="text-blue-400 font-medium py-1">Daftar Sekarang</Link>
              </>
            )}
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <header 
        className="relative pt-24 pb-16 min-h-[75vh] flex items-center justify-center bg-cover bg-center text-white text-center"
        style={{ 
          backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.9)), url('/images/login-bg.jpg')` 
        }}
      >
        <div className="max-w-4xl mx-auto px-6 space-y-6">
          <span className="px-4 py-1.5 rounded-full bg-blue-600/30 border border-blue-500/50 text-blue-300 text-xs font-bold tracking-widest uppercase">
            Selamat Datang di {hotelName}
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight max-w-3xl mx-auto">
            Temukan Kenyamanan Menginap Terbaik
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
            Penginapan bersih, aman, dan berlokasi strategis untuk kebutuhan istirahat Anda.
          </p>
          <div className="pt-6">
            {/* Tombol Utama Dinamis */}
            <Link 
              href={user ? "/kamar" : "/login"} 
              className={`inline-block font-extrabold px-10 py-5 rounded-2xl shadow-2xl transition transform hover:-translate-y-1 active:scale-95 text-lg ${
                user ? 'bg-green-600 hover:bg-green-700 text-white shadow-green-900/40' : 'bg-amber-500 hover:bg-amber-400 text-blue-950 shadow-amber-900/30'
              }`}
            >
              {user ? "Lihat Katalog & Pesan Kamar" : "Lihat & Pesan Kamar Sekarang"}
            </Link>
          </div>
        </div>
      </header>

      {/* DETAIL INFO & FASILITAS */}
      <section className="py-24 bg-white max-w-7xl mx-auto px-6 w-full flex-1">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-black text-blue-950 tracking-tight">
              Tentang Penginapan Kami
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg font-light">
              Kami berkomitmen menyajikan pengalaman menginap yang nyaman dan praktis tanpa menguras kantong Anda. Setiap unit kamar kami dirawat secara berkala demi menjaga kebersihan standar hotel.
            </p>
            <div className="border-l-4 border-blue-600 pl-4 py-2">
              <p className="text-sm font-semibold text-gray-700 italic">"Istirahat berkualitas, perjalanan jadi lebih puas."</p>
            </div>
          </div>
          <div className="bg-gray-50 p-10 rounded-3xl border border-gray-100 shadow-sm grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <div className="text-4xl">⚡</div>
              <h4 className="font-bold text-gray-800">Wi-Fi Cepat</h4>
              <p className="text-xs text-gray-500">Koneksi internet tanpa batas untuk keperluan Anda.</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl">🅿️</div>
              <h4 className="font-bold text-gray-800">Parkir Luas</h4>
              <p className="text-xs text-gray-500">Area parkir aman, luas, dan nyaman untuk kendaraan.</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl">❄️</div>
              <h4 className="font-bold text-gray-800">AC & Kipas</h4>
              <p className="text-xs text-gray-500">Pilihan pendingin ruangan untuk kenyamanan istirahat.</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl">🔑</div>
              <h4 className="font-bold text-gray-800">24 Jam</h4>
              <p className="text-xs text-gray-500">Layanan dan akses resepsionis yang selalu siap sedia.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER (Konsisten dengan warna navbar: bg-blue-950) */}
      <footer className="bg-blue-950 text-gray-300 py-12 text-sm text-center border-t border-blue-900/50">
        <p className="font-medium tracking-wide">© 2026 {hotelName}. Hak Cipta Dilindungi.</p>
      </footer>
    </div>
  );
}