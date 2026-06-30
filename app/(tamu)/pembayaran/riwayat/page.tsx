'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function RiwayatPembayaranPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRiwayat = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setLoading(false);
      return;
    }

    // Query dengan join ke tabel payments
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        id, lama_menginap, total_harga, status, created_at,
        guests (nama),
        payments (status)
      `)
      .eq('user_id', user.id) 
      .order('created_at', { ascending: false });

    if (error) console.error("Error:", error.message);
    else setBookings(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchRiwayat(); }, []);

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 text-slate-800">
      <h2 className="text-3xl font-bold mb-8 text-center">Riwayat Pemesanan</h2>
      {loading ? <div className="text-center">Memuat...</div> : 
       bookings.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-2xl">Tidak ada riwayat.</div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b.id} className="bg-white border p-6 rounded-2xl shadow-sm flex justify-between items-center">
              <div>
                <h4 className="font-bold text-lg">{b.guests?.nama}</h4>
                <p className="text-sm text-gray-500">Durasi: {b.lama_menginap} Malam</p>
                {/* Menampilkan Status Booking & Pembayaran */}
                <div className="mt-2 flex gap-2">
                  <span className="text-xs bg-blue-100 px-2 py-1 rounded">Booking: {b.status}</span>
                  <span className="text-xs bg-purple-100 px-2 py-1 rounded">
                    Bayar: {b.payments?.[0]?.status || 'Belum'}
                  </span>
                </div>
              </div>
              <p className="font-bold text-blue-600">Rp {b.total_harga.toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}