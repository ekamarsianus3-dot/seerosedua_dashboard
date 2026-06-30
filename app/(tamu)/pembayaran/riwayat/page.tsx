'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function RiwayatPembayaranPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRiwayat = async () => {
    setLoading(true);
    
    // 1. Ambil data user yang sedang login
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log("User belum login");
      setLoading(false);
      return;
    }

    // 2. Ambil data dari tabel bookings
    // Pastikan user_id di database sudah diisi untuk data-data tersebut
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
      .eq('user_id', user.id) // Filter berdasarkan user yang login
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error database:", error.message);
    } else {
      console.log("Data berhasil diambil:", data);
      setBookings(data || []);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchRiwayat();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 text-black">
      <h2 className="text-3xl font-bold mb-8 text-center">Riwayat Pemesanan Saya</h2>

      {loading ? (
        <div className="text-center py-10">Memuat data...</div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 border rounded-2xl">
          <p className="text-gray-500">Belum ada riwayat pemesanan untuk akun ini.</p>
          <Link href="/" className="text-blue-600 font-semibold block mt-4 hover:underline">Kembali ke Beranda</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b.id} className="bg-white border rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-lg font-bold">{b.guests?.nama || 'Tamu'}</h4>
                  <p className="text-sm text-gray-500">Durasi: {b.lama_menginap} Malam</p>
                </div>
                <p className="font-extrabold text-blue-600">Rp {b.total_harga?.toLocaleString('id-ID')}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}