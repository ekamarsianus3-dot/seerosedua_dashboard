'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import * as XLSX from 'xlsx';

export default function AdminDashboardPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterWaktu, setFilterWaktu] = useState('all');

  const fetchAllBookings = async () => {
    setLoading(true);
    // Tambahkan bukti_transfer ke dalam query
    let query = supabase
      .from('bookings')
      .select(`
        id, total_harga, status, created_at,
        guests (id, nama),
        payments (id, bukti_transfer) 
      `)
      .order('created_at', { ascending: false });

    if (filterWaktu === 'week') {
      const d = new Date(); d.setDate(d.getDate() - 7);
      query = query.gte('created_at', d.toISOString());
    } else if (filterWaktu === 'month') {
      const d = new Date(); d.setMonth(d.getMonth() - 1);
      query = query.gte('created_at', d.toISOString());
    }

    const { data, error } = await query;
    if (error) console.error(error);
    setBookings(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchAllBookings(); }, [filterWaktu]);

  const handleUpdateStatus = async (id: string, status: string) => {
    await supabase.from('bookings').update({ status }).eq('id', id);
    fetchAllBookings();
  };

  const handleDelete = async (bookingId: string, guestId: string) => {
    if (!confirm('Yakin ingin menghapus data ini secara permanen?')) return;
    await supabase.from('payments').delete().eq('booking_id', bookingId);
    await supabase.from('bookings').delete().eq('id', bookingId);
    if (guestId) await supabase.from('guests').delete().eq('id', guestId);
    fetchAllBookings();
  };

  const filteredData = bookings.filter(b => filterStatus === 'all' || b.status === filterStatus);

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'confirmed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen bg-gray-50 text-gray-900 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Manajemen</h1>
          <p className="text-sm text-gray-500">Kelola reservasi penginapan Anda dengan mudah.</p>
        </div>
        <div className="flex gap-2">
            {/* Filter Waktu & Button Excel tetap sama */}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-gray-50 text-gray-600">
            <tr>
              <th className="px-6 py-4">Nama Tamu</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Bukti Bayar</th>
              <th className="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredData.map((b) => (
              <tr key={b.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium">{b.guests?.nama || '-'}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(b.status)}`}>
                    {b.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono">Rp {b.total_harga?.toLocaleString()}</td>
                {/* Menampilkan bukti transfer */}
                <td className="px-6 py-4">
                    {b.payments?.[0]?.bukti_transfer ? (
                        <a href={b.payments[0].bukti_transfer} target="_blank" className="text-blue-600 hover:underline">Lihat Bukti</a>
                    ) : "-"}
                </td>
                <td className="px-6 py-4 flex justify-center gap-2">
                  {b.status === 'pending' && (
                    <>
                      <button onClick={() => handleUpdateStatus(b.id, 'confirmed')} className="border border-green-600 text-green-600 hover:bg-green-50 px-3 py-1 rounded-lg text-sm transition">Setujui</button>
                      <button onClick={() => handleUpdateStatus(b.id, 'cancelled')} className="border border-yellow-600 text-yellow-600 hover:bg-yellow-50 px-3 py-1 rounded-lg text-sm transition">Tolak</button>
                    </>
                  )}
                  <button onClick={() => handleDelete(b.id, b.guests?.id)} className="border border-red-600 text-red-600 hover:bg-red-50 px-3 py-1 rounded-lg text-sm transition">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}