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
    let query = supabase
      .from('bookings')
      .select(`
        id, total_harga, status, created_at,
        guests (id, nama),
        payments (id)
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
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Manajemen</h1>
          <p className="text-sm text-gray-500">Kelola reservasi penginapan Anda dengan mudah.</p>
        </div>
        <div className="flex gap-2">
          <select onChange={(e) => setFilterWaktu(e.target.value)} className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm shadow-sm">
            <option value="all">Semua Waktu</option>
            <option value="week">7 Hari Terakhir</option>
            <option value="month">30 Hari Terakhir</option>
          </select>
          <button onClick={() => {
            // Mapping data agar Nama Tamu masuk ke Excel
            const dataToExport = filteredData.map(b => ({
              "Nama Tamu": b.guests?.nama || '-',
              "Status": b.status?.toUpperCase() || '-',
              "Total Harga": b.total_harga || 0,
              "Tanggal": new Date(b.created_at).toLocaleDateString()
            }));
            const ws = XLSX.utils.json_to_sheet(dataToExport);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Data");
            XLSX.writeFile(wb, "Laporan_Reservasi.xlsx");
          }} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 shadow-sm">
            Download Excel
          </button>
        </div>
      </div>

      {/* FILTER BUTTONS */}
      <div className="flex gap-2 mb-6">
        {['all', 'pending', 'confirmed', 'cancelled'].map((s) => (
          <button key={s} onClick={() => setFilterStatus(s)} 
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${filterStatus === s ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 hover:bg-gray-100'}`}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-gray-50 text-gray-600">
            <tr>
              <th className="px-6 py-4">Nama Tamu</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Total</th>
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
                <td className="px-6 py-4 flex justify-center gap-3">
                  {b.status === 'pending' && (
                    <>
                      <button onClick={() => handleUpdateStatus(b.id, 'confirmed')} className="text-emerald-600 font-semibold hover:underline">Setujui</button>
                      <button onClick={() => handleUpdateStatus(b.id, 'cancelled')} className="text-rose-600 font-semibold hover:underline">Tolak</button>
                    </>
                  )}
                  <button onClick={() => handleDelete(b.id, b.guests?.id)} className="text-gray-400 hover:text-gray-600">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}