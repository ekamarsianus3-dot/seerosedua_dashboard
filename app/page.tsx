'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const hotelName = "See Rose II";

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user || null));
    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900">
      
      {/* HEADER - Konsisten dengan warna Footer */}
      <nav className="sticky top-0 bg-blue-950 text-white z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="text-2xl font-black tracking-tighter italic">
            {hotelName}
          </Link>
          <div className="hidden md:flex items-center gap-8 font-medium">
            <Link href="/" className="hover:text-blue-300 transition">Beranda</Link>
            <Link href="/kamar" className="hover:text-blue-300 transition">Katalog Kamar</Link>
            {user ? (
              <Link href="/riwayat" className="px-5 py-2 rounded-full border border-blue-400 hover:bg-blue-800 transition">Riwayat</Link>
            ) : (
              <Link href="/login" className="px-5 py-2 rounded-full bg-blue-500 hover:bg-blue-600 transition">Login</Link>
            )}
          </div>
        </div>
      </nav>

      {/* HERO SECTION - Visual yang lebih kuat */}
      <header className="relative py-28 px-6 bg-gradient-to-b from-blue-950 to-blue-900 text-white text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            Tempat Istirahat <br/> <span className="text-blue-400">Pilihan Utama Anda</span>
          </h1>
          <p className="text-xl text-blue-100/80 max-w-2xl mx-auto">
            Kombinasi antara kenyamanan premium, kebersihan terjaga, dan lokasi yang sangat strategis.
          </p>
          <div className="pt-8">
            <Link href="/kamar" className="px-10 py-5 rounded-2xl bg-amber-500 text-blue-950 font-bold text-lg hover:bg-amber-400 transition-all shadow-xl hover:scale-105">
              Lihat Ketersediaan Kamar
            </Link>
          </div>
        </div>
      </header>

      {/* ADDITIONAL CONTENT: WHY US? */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Mengapa Menginap di {hotelName}?</h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "Kebersihan Terjamin", desc: "Setiap kamar dibersihkan dengan standar tinggi sebelum tamu datang.", icon: "✨" },
            { title: "Lokasi Strategis", desc: "Dekat dengan pusat aktivitas dan kuliner, memudahkan mobilitas Anda.", icon: "📍" },
            { title: "Pelayanan 24/7", desc: "Tim resepsionis kami selalu siap membantu kebutuhan Anda kapan saja.", icon: "🛎️" }
          ].map((item, idx) => (
            <div key={idx} className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all">
              <div className="text-5xl mb-6">{item.icon}</div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER - Konsisten dengan warna Header */}
      <footer className="bg-blue-950 text-blue-200 py-16 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12 text-sm">
          <div className="space-y-4">
            <h4 className="text-white font-bold text-lg">{hotelName}</h4>
            <p>Memberikan kenyamanan terbaik untuk setiap perjalanan Anda. Bersih, aman, dan terpercaya.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Navigasi</h4>
            <ul className="space-y-2">
              <li><Link href="/kamar" className="hover:text-white">Daftar Kamar</Link></li>
              <li><Link href="/riwayat" className="hover:text-white">Riwayat Pemesanan</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Kontak</h4>
            <p>Jl. Contoh No. 123, Kota Anda</p>
            <p>Email: info@seerose2.com</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-blue-900 text-center text-blue-400">
          <p>© 2026 {hotelName}. Seluruh Hak Cipta Dilindungi.</p>
        </div>
      </footer>
    </div>
  );
}