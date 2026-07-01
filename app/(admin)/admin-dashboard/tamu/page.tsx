'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function KelolaTamuPage() {
  const [guests, setGuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGuests = async () => {
    setLoading(true);
    // Mengambil data dengan join yang lebih eksplisit
    const { data, error } = await supabase
      .from('payments')
      .select(`
        bukti_transfer,
        bookings (
          status,
          guests (id, nama, no_hp, alamat)
        )
      `)
      .order('id', { ascending: false });

    if (error) {
      console.error("Error fetching:", error);
    } else if (data) {
      // Memetakan data agar mudah dibaca
      const formatted = data.map((item: any) => ({
        id: item.bookings?.guests?.id,
        nama: item.bookings?.guests?.nama,
        no_hp: item.bookings?.guests?.no_hp,
        alamat: item.bookings?.guests?.alamat,
        bukti: item.bukti_transfer,
        status: item.bookings?.status
      }));
      setGuests(formatted);
    }
    setLoading(false);
  };

  useEffect(() => { fetchGuests(); }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">👥 Mengelolah Laporan Tamu</h1>
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-4 font-semibold">Nama</th>
              <th className="p-4 font-semibold">Bukti Bayar</th>
              <th className="p-4 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {guests.map((g, i) => (
              <tr key={i} className="border-b">
                <td className="p-4">{g.nama}</td>
                <td className="p-4">
                  {g.bukti ? (
                    <a href={g.bukti} target="_blank" className="text-blue-600 underline">Lihat Bukti</a>
                  ) : "Belum ada"}
                </td>
                <td className="p-4 space-x-2">
                  <button className="border border-green-500 text-green-600 px-3 py-1 rounded-lg">Setuju</button>
                  <button className="border border-yellow-500 text-yellow-600 px-3 py-1 rounded-lg">Tolak</button>
                  <button className="border border-red-500 text-red-600 px-3 py-1 rounded-lg">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}