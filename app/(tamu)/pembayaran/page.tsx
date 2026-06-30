'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function PembayaranPage() {
  const router = useRouter();
  const [tx, setTx] = useState<any>(null);
  const [metode, setMetode] = useState('Transfer Bank');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const data = sessionStorage.getItem('temp_booking');
    if (!data) {
      router.push('/pesan');
    } else {
      setTx(JSON.parse(data));
    }
  }, [router]);

  if (!tx) return <div className="text-center p-10 text-black">Memuat data...</div>;

  const handleKonfirmasiBayar = async () => {
    setLoading(true);
    try {
      // 1. Ambil data user yang sedang login
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error("Anda harus login untuk melakukan pemesanan.");
      }

      // 2. Catat ke tabel guests
      const { data: guestData, error: guestError } = await supabase
        .from('guests')
        .insert([{ nama: tx.nama, alamat: tx.alamat, no_hp: tx.no_hp }])
        .select()
        .single();

      if (guestError) throw guestError;

      const roomTypeId = tx.roomType === 'Kamar Tipe AC' ? 1 : 2;

      // 3. Catat ke tabel bookings
      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .insert([{
          user_id: user.id, 
          guest_id: guestData.id,
          room_type_id: roomTypeId,
          lama_menginap: tx.lamaMenginap,
          extra_kasur: tx.extraKasur,
          harga_kamar: tx.hargaKamar,
          biaya_extra: tx.biayaExtra,
          total_harga: tx.totalHarga,
          status: 'pending'
        }])
        .select()
        .single();

      if (bookingError) throw bookingError;

      // 4. Catat ke tabel payments
      const { error: paymentError } = await supabase
        .from('payments')
        .insert([{
          booking_id: bookingData.id,
          metode: metode,
          jumlah: tx.totalHarga,
          status: 'menunggu'
        }]);

      if (paymentError) throw paymentError;

      // Pesan konfirmasi sesuai permintaan Anda
      alert('Pemesanan sukses!');
      alert('Terima kasih telah melakukan pembayaran. Anda dapat melihat status pembayaran di riwayat pemesanan.');
      
      sessionStorage.removeItem('temp_booking');
      router.push('/'); // Diarahkan ke home
      
    } catch (err: any) {
      console.error(err);
      alert('Terjadi kesalahan: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-12 px-4 text-black">
      <h2 className="text-2xl font-bold mb-6 text-center">Ringkasan & Pembayaran</h2>
      
      <div className="bg-gray-50 p-6 rounded-2xl border mb-6 space-y-3">
        <p><strong>Nama Pemesan:</strong> {tx.nama}</p>
        <p><strong>Tipe Kamar:</strong> {tx.roomType}</p>
        <p><strong>Durasi:</strong> {tx.lamaMenginap} Malam</p>
        <p><strong>Fasilitas Tambahan:</strong> {tx.extraKasur ? 'Ekstra Kasur (+Rp 35.000)' : 'Tidak Ada'}</p>
        
        <div className="border-t pt-2 mt-2 font-bold text-lg flex justify-between">
          <span>Total Tagihan:</span>
          <span className="text-emerald-600">Rp {tx.totalHarga.toLocaleString('id-ID')}</span>
        </div>
      </div>

      {metode === 'Transfer Bank' && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-2 text-sm text-blue-900">
          <p className="font-bold text-base">🏧 Instruksi Transfer Bank:</p>
          <p>Silakan transfer tepat sesuai total tagihan ke rekening berikut:</p>
          <p><strong>Bank BCA:</strong> 1234567890 a/n SEEROSEDUA HOTEL</p>
          <p><strong>Bank Mandiri:</strong> 9876543210 a/n SEEROSEDUA HOTEL</p>
        </div>
      )}

      <div className="mb-6">
        <label className="block font-semibold mb-2">Pilih Jenis Pembayaran</label>
        <select value={metode} onChange={(e) => setMetode(e.target.value)} className="w-full p-3 border rounded-xl bg-white">
          <option value="Transfer Bank">Manual Transfer Bank (BCA/Mandiri)</option>
          <option value="Cash">Tunai / Cash di Resepsionis</option>
          <option value="Virtual Account">Virtual Account (VA otomatis)</option>
        </select>
      </div>

      <button 
        onClick={handleKonfirmasiBayar} 
        disabled={loading} 
        className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-bold py-4 rounded-xl transition shadow-md"
      >
        {loading ? 'Memproses Pemesanan...' : 'Selesaikan & Bayar'}
      </button>
    </div>
  );
}