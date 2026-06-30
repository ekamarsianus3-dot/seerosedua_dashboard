'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function RiwayatPage() {
  const [riwayat, setRiwayat] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRiwayat() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Mengambil data yang hanya milik user yang sedang login
        const { data, error } = await supabase
          .from('bookings')
          .select('*, guests(nama)') // Mengambil data tamu terkait jika diperlukan
          .eq('user_id', user.id)    // Filter berdasarkan user_id
          .order('id', { ascending: false }); // Pesanan terbaru di atas

        if (error) throw error;
        if (data) setRiwayat(data);
      } catch (err) {
        console.error("Gagal memuat riwayat:", err);
      } finally {
        setLoading(false);
      }
    }
    loadRiwayat();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 text-black">
      <h1 className="text-2xl font-bold mb-6">Riwayat Pemesanan Anda</h1>
      
      {loading ? (
        <p>Memuat riwayat...</p>
      ) : riwayat.length === 0 ? (
        <p>Belum ada riwayat pemesanan. Silakan lakukan pemesanan terlebih dahulu.</p>
      ) : (
        <div className="space-y-4">
          {riwayat.map((item) => (
            <div key={item.id} className="p-5 border rounded-2xl shadow-sm bg-white border-gray-200">
              <div className="flex justify-between items-center">
                <p className="font-bold">ID Booking: {item.id}</p>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold uppercase">
                  {item.status}
                </span>
              </div>
              <p className="text-gray-600 mt-2">Total Pembayaran: Rp {item.total_harga.toLocaleString('id-ID')}</p>
              <p className="text-sm text-gray-500">Tanggal: {new Date(item.created_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}