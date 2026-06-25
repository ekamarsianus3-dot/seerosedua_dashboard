'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function RiwayatPembayaranPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchHp, setSearchHp] = useState('');

  // Fungsi untuk mengambil riwayat berdasarkan nomor HP tamu
  const fetchRiwayat = async (nomorHp: string = '') => {
    setLoading(true);
    try {
      let query = supabase
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
        .order('created_at', { ascending: false });

      // Jika user melakukan pencarian berdasarkan nomor HP
      if (nomorHp) {
        // Kita cari data guest yang nomor HP-nya cocok
        const { data: guestData } = await supabase
          .from('guests')
          .select('id')
          .eq('no_hp', nomorHp);
        
        if (guestData && guestData.length > 0) {
          const guestIds = guestData.map(g => g.id);
          query = query.in('guest_id', guestIds);
        } else {
          setBookings([]);
          return;
        }
      }

      const { data, error } = await query;
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

  const handleCari = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRiwayat(searchHp);
  };

  // Fungsi pembantu warna badge status booking
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
      <h2 className="text-3xl font-bold mb-2 text-center">Riwayat Pemesanan Kamar</h2>
      <p className="text-gray-500 text-center mb-8">Cek status reservasi dan konfirmasi pembayaran Anda di bawah ini.</p>

      {/* Form Pencarian Cepat Berdasarkan No HP */}
      <form onSubmit={handleCari} className="mb-8 flex gap-2 max-w-md mx-auto">
        <input 
          type="text" 
          placeholder="Masukkan Nomor HP Pemesan..." 
          value={searchHp}
          onChange={(e) => setSearchHp(e.target.value)}
          className="flex-1 p-3 border rounded-xl bg-white text-sm"
        />
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-xl text-sm transition">
          Cari Pesanan
        </button>
      </form>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Memuat data transaksi...</div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 border rounded-2xl space-y-4">
          <p className="text-gray-500">Tidak ditemukan riwayat pemesanan.</p>
          <Link href="/" className="inline-block text-blue-600 font-semibold text-sm hover:underline">
            ← Kembali ke Halaman Utama untuk Memesan
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b.id} className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                 
                <span className="text-xs font-mono text-gray-400">#BOOKING-{b.id}</span>
                  {getStatusBadge(b.status)}
                </div>
                <h4 className="text-lg font-bold text-gray-900">{b.guests?.nama || 'Tamu'}</h4>
                <p className="text-sm text-gray-600">Durasi: <span className="font-medium">{b.lama_menginap} Malam</span></p>
                <p className="text-xs text-gray-400">Dibuat pada: {new Date(b.created_at).toLocaleDateString('id-ID')}</p>
              </div>

              <div className="border-t md:border-t-0 pt-3 md:pt-0 flex md:flex-col justify-between items-end gap-1">
                <p className="text-xs text-gray-500 md:text-right">Total Tagihan</p>
                <p className="text-xl font-extrabold text-blue-600">Rp {b.total_harga.toLocaleString('id-ID')}</p>
                <p className="text-xs text-gray-400 mt-1">Metode: {b.payments?.[0]?.metode || 'Transfer'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}