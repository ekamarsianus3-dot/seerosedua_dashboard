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

        const { data, error } = await supabase
          .from('bookings')
          .select('*, guests(nama)') 
          .eq('user_id', user.id)
          .order('id', { ascending: false });

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
    <div className="max-w-3xl mx-auto py-12 px-6 text-slate-800">
      <h1 className="text-3xl font-extrabold mb-8 text-slate-900 tracking-tight">Riwayat Pemesanan</h1>
      
      {loading ? (
        <div className="text-center py-10 text-slate-500">Memuat riwayat Anda...</div>
      ) : riwayat.length === 0 ? (
        <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
          <p className="text-slate-600">Belum ada riwayat pesanan yang ditemukan.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {riwayat.map((item) => (
            <div key={item.id} className="group p-6 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {item.guests?.nama || 'Tamu Tidak Dikenal'}
                  </h3>
                  <p className="text-sm text-slate-400 mt-0.5">
                    {new Date(item.created_at).toLocaleDateString('id-ID', { 
                      day: 'numeric', month: 'long', year: 'numeric' 
                    })}
                  </p>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider
                  ${item.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 
                    item.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                  {item.status}
                </span>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <p className="text-slate-600 font-medium">Total Pembayaran</p>
                <p className="text-lg font-bold text-blue-600">
                  Rp {item.total_harga.toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}