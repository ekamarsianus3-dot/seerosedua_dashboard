'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function RiwayatPembayaranPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRiwayat = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Cek User Login
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        throw new Error('Anda harus login untuk melihat riwayat.');
      }

      console.log("Mencari data untuk User ID:", user.id);

      // 2. Query Data
      const { data, error: queryError } = await supabase
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

      if (queryError) throw queryError;

      console.log("Data ditemukan:", data);
      setBookings(data || []);
    } catch (err: any) {
      console.error('Error:', err.message);
      setError(err.message);
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
        <div className="text-center py-10">Memuat data...</div>
      ) : error ? (
        <div className="text-center py-10 text-red-600 font-semibold">{error}</div>
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
                <p className="text-xl font-extrabold text-blue-600">
                  Rp {b.total_harga?.toLocaleString('id-ID') || '0'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}