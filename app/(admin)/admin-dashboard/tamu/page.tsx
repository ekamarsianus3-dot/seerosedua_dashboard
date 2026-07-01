'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function KelolaTamuPage() {
  const [guests, setGuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGuests = async () => {
    setLoading(true);
    // Mengambil data dari tabel payments karena bukti_transfer tersimpan di sana
    const { data, error } = await supabase
      .from('payments')
      .select(`
        bukti_transfer,
        bookings (
          guests (id, nama, no_hp, alamat)
        )
      `)
      .order('id', { ascending: false });

    if (error) {
      console.error("Error fetching data:", error);
    } else if (data) {
      // Memetakan data agar sesuai dengan struktur tabel
      const formatted = data.map((item: any) => ({
        id: item.bookings?.guests?.id,
        nama: item.bookings?.guests?.nama,
        no_hp: item.bookings?.guests?.no_hp,
        alamat: item.bookings?.guests?.alamat,
        bukti: item.bukti_transfer
      })).filter(item => item.nama); // Hanya ambil yang ada nama tamunya
      
      setGuests(formatted);
    }
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
      <h1 className="text-2xl font-bold mb-6">👥 Mengelola Laporan Tamu</h1>

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
            ) : guests.map((g, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium">{g.nama}</td>
                <td className="p-4">{g.no_hp || '-'}</td>
                <td className="p-4 text-gray-600 text-sm">{g.alamat}</td>
                <td className="p-4">
                  {g.bukti ? (
                    <a 
                      href={g.bukti} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 underline text-sm"
                    >
                      Lihat Bukti
                    </a>
                  ) : <span className="text-gray-400 text-sm">Tidak ada</span>}
                </td>
                <td className="p-4 space-x-2">
                  <button className="border border-green-600 text-green-600 hover:bg-green-50 px-3 py-1 rounded-lg text-sm transition">
                    Setuju
                  </button>
                  <button className="border border-yellow-600 text-yellow-600 hover:bg-yellow-50 px-3 py-1 rounded-lg text-sm transition">
                    Tolak
                  </button>
                  <button 
                    onClick={() => handleHapusTamu(g.id)} 
                    className="border border-red-600 text-red-600 hover:bg-red-50 px-3 py-1 rounded-lg text-sm transition"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}