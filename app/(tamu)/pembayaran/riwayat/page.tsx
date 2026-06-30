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
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        throw new Error('Anda harus login untuk melihat riwayat.');
      }

      // Query data dengan join ke guests dan payments
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
        .eq('user_id', user.id) // Sekarang kolom ini sudah ada di database
        .order('created_at', { ascending: false });

      if (queryError) throw queryError;

      setBookings(data || []);
    } catch (err: any) {
      console.error('Gagal memuat:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiwayat();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 text-black">
      <h2 className="text-3xl font-bold mb-8 text-center">Riwayat Pemesanan Saya</h2>

      {loading ? (
        <div className="text-center py-10">Memuat data...</div>
      ) : error ? (
        <div className="text-center py-10 text-red-600">{error}</div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 border rounded-2xl">
          <p className="text-gray-500 mb-4">Belum ada riwayat pemesanan.</p>
          <Link href="/" className="text-blue-600 font-semibold hover:underline">Kembali ke Utama</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b.id} className="bg-white border rounded-2xl p-6 shadow-sm flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-400">#BOOKING-{b.id}</p>
                <h4 className="text-lg font-bold">{b.guests?.nama || 'Tamu'}</h4>
                <p className="text-sm text-gray-600">Durasi: {b.lama_menginap} Malam</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-blue-600">Rp {b.total_harga?.toLocaleString('id-ID')}</p>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">{b.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}