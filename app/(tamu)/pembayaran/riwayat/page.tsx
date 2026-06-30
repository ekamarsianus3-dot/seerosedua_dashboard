'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function RiwayatPembayaranPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRiwayat = async () => {
    setLoading(true);
    
    // 1. Dapatkan user yang sedang login
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.warn("User belum login");
      setLoading(false);
      return;
    }

    console.log("Mencari riwayat untuk User ID:", user.id);

    // 2. Ambil data dengan filter user_id
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        id,
        lama_menginap,
        total_harga,
        status,
        created_at,
        guests (nama, no_hp),
        payments (metode, status)
      `)
      .eq('user_id', user.id) 
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error saat mengambil data:", error.message);
    } else {
      console.log("Data ditemukan:", data);
      setBookings(data || []);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchRiwayat();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 text-slate-800">
      <h2 className="text-3xl font-bold mb-8 text-center">Riwayat Pemesanan Saya</h2>

      {loading ? (
        <div className="text-center py-10">Memuat riwayat...</div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 border border-gray-200 rounded-3xl">
          <p className="text-gray-500">Belum ada data pemesanan yang terhubung dengan akun ini.</p>
          <Link href="/kamar" className="text-blue-600 font-semibold mt-4 block hover:underline">
            Cari & Pesan Kamar
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b.id} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-lg font-bold">{b.guests?.nama || 'Tamu'}</h4>
                  <p className="text-sm text-gray-500">Durasi: {b.lama_menginap} Malam</p>
                  <p className="text-xs text-blue-500 mt-1 uppercase font-bold">{b.status}</p>
                </div>
                <div className="text-right">
                  <p className="font-extrabold text-blue-700 text-lg">Rp {b.total_harga?.toLocaleString('id-ID')}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}