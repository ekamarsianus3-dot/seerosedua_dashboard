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
      
      const { data } = await supabase
        .from('bookings')
        .select('*, guests(nama), payments(metode)')
        .eq('user_id', user.id)
        .order('id', { ascending: false });

      if (data) setRiwayat(data);
    }
    load();
  }, []);

  const cetakPDF = (item: any) => {
    const doc = new jsPDF({ format: 'a4', unit: 'mm' });

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("SEEROSEDUA HOTEL", 105, 20, { align: "center" });
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Bukti Transaksi Resmi", 105, 27, { align: "center" });

    // Garis Pemisah
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 35, 190, 35);

    // Detail Transaksi
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Ringkasan Pemesanan", 20, 45);
    
    doc.setFont("helvetica", "normal");
    doc.text(`Nama Tamu      : ${item.guests?.nama || '-'}`, 20, 55);
    doc.text(`ID Transaksi   : #${item.id}`, 20, 62);
    doc.text(`Metode Bayar   : ${item.payments?.[0]?.metode || '-'}`, 20, 69);
    doc.text(`Status         : ${item.status.toUpperCase()}`, 20, 76);
    
    // Kotak Total Harga
    doc.setFillColor(245, 245, 245);
    doc.rect(20, 90, 170, 15, 'F');
    doc.setFont("helvetica", "bold");
    doc.text("Total Tagihan", 25, 99);
    doc.text(`Rp ${item.total_harga?.toLocaleString('id-ID')}`, 185, 99, { align: "right" });

    // Footer
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("Terima kasih telah memilih Seerosedua Hotel.", 105, 280, { align: "center" });

    doc.save(`Bukti_Transaksi_${item.id}.pdf`);
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-6 text-slate-800">
      <h1 className="text-3xl font-extrabold mb-8">Riwayat Transaksi</h1>

      {riwayat.length === 0 ? (
        <p className="text-slate-500">Belum ada riwayat transaksi yang ditemukan.</p>
      ) : (
        riwayat.map((item) => (
          <div key={item.id} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-lg mb-8 hover:shadow-xl transition-all duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{item.guests?.nama}</h2>
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider
                ${item.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {item.status}
              </span>
            </div>

            <div className="space-y-2 mb-6 text-sm">
              <p className="font-medium text-slate-600">Total: <span className="text-slate-900 font-bold">Rp {item.total_harga?.toLocaleString('id-ID')}</span></p>
              <p className="font-medium text-slate-600">Metode: <span className="text-slate-900">{item.payments?.[0]?.metode || '-'}</span></p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Catatan Check-in:</p>
              <p className="text-sm italic text-slate-700 leading-relaxed">
                "Harap tunjukkan bukti transaksi ini dan kartu identitas asli (KTP/SIM) saat melakukan check-in di resepsionis."
              </p>
            </div>

            {/* Tombol PDF hanya muncul jika status 'confirmed' */}
            {item.status === 'confirmed' && (
              <button 
                onClick={() => cetakPDF(item)} 
                className="w-full mt-6 bg-slate-900 text-white py-3 rounded-2xl font-bold hover:bg-slate-800 transition shadow-md"
              >
                Unduh Bukti Transaksi (PDF)
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}