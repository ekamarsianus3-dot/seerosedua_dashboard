'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

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

    // Mengambil status booking yang sudah diupdate oleh admin
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        id, lama_menginap, total_harga, status, created_at,
        guests (nama)
      `)
      .eq('user_id', user.id) 
      .order('created_at', { ascending: false });

    if (error) console.error("Error:", error.message);
    else setBookings(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchRiwayat(); }, []);

  // Fungsi untuk memberi warna pada label status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700 border-green-200';
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

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
                
                {/* Menampilkan Status Konfirmasi Admin */}
                <div className="mt-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(b.status)}`}>
                    Status: {b.status === 'pending' ? 'Menunggu Konfirmasi' : b.status.toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-sm text-gray-400">Total Tagihan</p>
                <p className="font-bold text-blue-600 text-lg">Rp {b.total_harga.toLocaleString('id-ID')}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}