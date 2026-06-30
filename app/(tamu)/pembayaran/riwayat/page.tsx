'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function RiwayatPembayaranPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fungsi fetch diubah untuk memfilter berdasarkan user yang sedang login
  const fetchRiwayat = async () => {
    setLoading(true);
    try {
      // Dapatkan user yang sedang aktif
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setBookings([]);
        setLoading(false);
        return;
      }

      // Query hanya mengambil data yang user_id-nya sesuai dengan user yang login
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
        .eq('user_id', user.id) // <--- INI PERUBAHAN UTAMANYA
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (err: any) {
      console.error('Gagal memuat riwayat:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiwayat();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded-full">Dikonfirmasi</span>;
      case 'cancelled':
        return <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-1 rounded-full">Dibatalkan</span>;
      default:
        return <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-full">Menunggu</span>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 text-black">
      <h2 className="text-3xl font-bold mb-8 text-center">Riwayat Pemesanan Saya</h2>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Memuat data...</div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 border rounded-2xl space-y-4">
          <p className="text-gray-500">Belum ada riwayat pemesanan di akun Anda.</p>
          <Link href="/" className="text-blue-600 font-semibold text-sm hover:underline">Kembali ke Utama</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b.id} className="bg-white border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-gray-400">#BOOKING-{b.id}</span>
                  {getStatusBadge(b.status)}
                </div>
                <h4 className="text-lg font-bold">{b.guests?.nama || 'Tamu'}</h4>
                <p className="text-sm text-gray-600">Durasi: {b.lama_menginap} Malam</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-extrabold text-blue-600">Rp {b.total_harga.toLocaleString('id-ID')}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}