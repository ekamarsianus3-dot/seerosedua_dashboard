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

  useEffect(() => { 
    fetchAllBookings(); 
  }, [filterWaktu]);

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

  // Fungsi untuk mencetak data yang difilter ke format Excel
  const handleExportExcel = () => {
    if (filteredData.length === 0) {
      alert("Tidak ada data untuk dicetak!");
      return;
    }

    // Memetakan struktur objek JSON mentah menjadi format baris tabel Excel yang rapi
    const reportData = filteredData.map((b, index) => ({
      'No': index + 1,
      'Tanggal Reservasi': new Date(b.created_at).toLocaleDateString('id-ID', {
        year: 'numeric', month: 'long', day: 'numeric'
      }),
      'Nama Tamu': b.guests?.nama || '-',
      'Status': b.status.toUpperCase(),
      'Total Harga (Rp)': b.total_harga || 0,
      'Link Bukti Bayar': b.payments?.[0]?.bukti_transfer || 'Belum Transfer'
    }));

    const worksheet = XLSX.utils.json_to_sheet(reportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan Reservasi');

    // Penamaan file dinamis berdasarkan filter waktu yang dipilih
    let fileName = 'Laporan_Semua_Reservasi.xlsx';
    if (filterWaktu === 'week') fileName = 'Laporan_Reservasi_Mingguan.xlsx';
    if (filterWaktu === 'month') fileName = 'Laporan_Reservasi_Bulanan.xlsx';

    XLSX.writeFile(workbook, fileName);
  };

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
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Manajemen</h1>
          <p className="text-sm text-gray-500">Kelola reservasi penginapan Anda dengan mudah.</p>
        </div>
        
        {/* ACTION PANEL: FILTER DAN EXPORT */}
        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          {/* Dropdown Filter Status */}
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Semua Status</option>
            <option value="pending">PENDING</option>
            <option value="confirmed">CONFIRMED</option>
            <option value="cancelled">CANCELLED</option>
          </select>

          {/* Dropdown Filter Rentang Waktu */}
          <select 
            value={filterWaktu}
            onChange={(e) => setFilterWaktu(e.target.value)}
            className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Semua Waktu</option>
            <option value="week">1 Minggu Terakhir</option>
            <option value="month">1 Bulan Terakhir</option>
          </select>

          {/* Tombol Cetak Excel */}
          <button 
            onClick={handleExportExcel}
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition flex items-center gap-2 shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Cetak Excel
          </button>
        </div>
      </div>

      {/* DATA TABLE SECTION */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Memuat data reservasi...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-gray-50 text-gray-600 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">Nama Tamu</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Bukti Bayar</th>
                  <th className="px-6 py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-gray-400">
                      Tidak ada data data reservasi yang sesuai.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-medium">{b.guests?.nama || '-'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(b.status)}`}>
                          {b.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono">Rp {b.total_harga?.toLocaleString('id-ID')}</td>
                      <td className="px-6 py-4">
                        {b.payments?.[0]?.bukti_transfer ? (
                          <a href={b.payments[0].bukti_transfer} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1">
                            Lihat Bukti
                          </a>
                        ) : "-"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          {b.status === 'pending' && (
                            <>
                              <button onClick={() => handleUpdateStatus(b.id, 'confirmed')} className="border border-green-600 text-green-600 hover:bg-green-50 px-3 py-1 rounded-lg text-sm transition">Setujui</button>
                              <button onClick={() => handleUpdateStatus(b.id, 'cancelled')} className="border border-yellow-600 text-yellow-600 hover:bg-yellow-50 px-3 py-1 rounded-lg text-sm transition">Tolak</button>
                            </>
                          )}
                          <button onClick={() => handleDelete(b.id, b.guests?.id)} className="border border-red-600 text-red-600 hover:bg-red-50 px-3 py-1 rounded-lg text-sm transition">Hapus</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}