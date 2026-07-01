'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function KelolaTamuPage() {
  const [guests, setGuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGuests = async () => {
    setLoading(true);
    // Mengambil data tamu beserta relasi booking dan pembayaran untuk mendapatkan bukti transfer
    const { data, error } = await supabase
      .from('guests')
      .select('*, bookings(payments(bukti_transfer))')
      .order('id', { ascending: false });
      
    if (!error && data) setGuests(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchGuests();
  }, []);

  const handleHapusTamu = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus data laporan tamu ini?')) {
      const { error } = await supabase.from('guests').delete().eq('id', id);
      if (error) alert('Gagal menghapus: ' + error.message);
      else fetchGuests();
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">👥 Mengelolah Laporan Tamu</h1>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-4 font-semibold">Nama Tamu</th>
              <th className="p-4 font-semibold">No. HP</th>
              <th className="p-4 font-semibold">Alamat</th>
              <th className="p-4 font-semibold">Bukti Bayar</th>
              <th className="p-4 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="p-4 text-center">Memuat data...</td></tr>
            ) : guests.length === 0 ? (
              <tr><td colSpan={5} className="p-4 text-center">Tidak ada laporan data tamu.</td></tr>
            ) : guests.map((guest) => {
              // Mengambil URL bukti transfer dari struktur nested
              const buktiUrl = guest.bookings?.[0]?.payments?.[0]?.bukti_transfer;
              return (
                <tr key={guest.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">{guest.nama}</td>
                  <td className="p-4">{guest.no_hp || '-'}</td>
                  <td className="p-4 text-gray-600 text-sm">{guest.alamat}</td>
                  <td className="p-4">
                    {buktiUrl ? (
                      <a href={buktiUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm">
                        Lihat Bukti
                      </a>
                    ) : <span className="text-gray-400 text-sm">Tidak ada</span>}
                  </td>
                  <td className="p-4">
                    <button onClick={() => handleHapusTamu(guest.id)} className="bg-red-100 hover:bg-red-200 text-red-600 font-semibold px-3 py-1.5 rounded-lg text-sm transition">
                      Hapus Data
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}