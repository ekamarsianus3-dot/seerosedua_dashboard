'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { jsPDF } from 'jspdf';

export default function RiwayatPage() {
  const [riwayat, setRiwayat] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('bookings').select('*, guests(nama), payments(metode)').eq('user_id', user.id);
      if (data) setRiwayat(data);
    }
    load();
  }, []);

  const cetakPDF = (item: any) => {
    const doc = new jsPDF();
    doc.text("BUKTI TRANSAKSI", 20, 20);
    doc.text(`Tamu: ${item.guests?.nama}`, 20, 40);
    doc.text(`Total: Rp ${item.total_harga}`, 20, 50);
    doc.text(`Pembayaran: ${item.payments?.[0]?.metode}`, 20, 60);
    doc.save(`Bukti_${item.id}.pdf`);
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-8">Riwayat Transaksi</h1>
      {riwayat.map((item) => (
        <div key={item.id} className="bg-white p-6 rounded-3xl border shadow-lg mb-6">
          <h2 className="text-2xl font-bold">{item.guests?.nama}</h2>
          <p className="text-slate-600">Total: Rp {item.total_harga?.toLocaleString()}</p>
          <div className="mt-4 p-3 bg-slate-50 rounded-xl">
            <p className="text-xs font-bold uppercase">Catatan Check-in:</p>
            <p className="text-sm italic">"Harap bawa kartu identitas saat check-in di resepsionis."</p>
          </div>
          {item.status === 'confirmed' && (
            <button onClick={() => cetakPDF(item)} className="w-full mt-4 bg-slate-900 text-white py-2 rounded-xl">
              Unduh Bukti PDF
            </button>
          )}
        </div>
      ))}
    </div>
  );
}