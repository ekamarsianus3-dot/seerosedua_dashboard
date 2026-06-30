'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// 1. Komponen Utama Formulir yang membutuhkan useSearchParams
function BookingFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Menangkap parameter 'type' (ID) dari URL katalog
  const queryType = searchParams.get('type'); 

  const [roomType, setRoomType] = useState<'ac' | 'kipas'>('ac');
  const [lamaMenginap, setLamaMenginap] = useState(1);
  const [extraKasur, setExtraKasur] = useState(false);
  
  const [detailTamu, setDetailTamu] = useState({ nama: '', no_hp: '', alamat: '' });
  const [totalHarga, setTotalHarga] = useState(0);

  const hargaKamar = roomType === 'ac' ? 200000 : 100000;
  const biayaExtra = extraKasur ? 35000 : 0;

  // Menyelaraskan pilihan otomatis berdasarkan ID (1 = AC, 2 = Kipas Angin)
  useEffect(() => {
    if (queryType === '2') {
      setRoomType('kipas');
    } else {
      setRoomType('ac');
    }
  }, [queryType]);

  useEffect(() => {
    setTotalHarga((hargaKamar * lamaMenginap) + (biayaExtra * lamaMenginap));
  }, [roomType, lamaMenginap, extraKasur, hargaKamar, biayaExtra]);

  const handleLanjutPembayaran = (e: React.FormEvent) => {
    e.preventDefault();
    
    const dataTransaksi = {
      ...detailTamu,
      roomType: roomType === 'ac' ? 'Kamar Tipe AC' : 'Kamar Kipas Angin',
      roomTypeId: roomType === 'ac' ? 1 : 2,
      lamaMenginap,
      extraKasur,
      totalHarga,
      hargaKamar,
      biayaExtra
    };
    sessionStorage.setItem('temp_booking', JSON.stringify(dataTransaksi));
    router.push('/pembayaran');
  };

  return (
    <div className="max-w-2xl mx-auto pt-28 pb-12 px-4 text-black">
      <h2 className="text-3xl font-bold mb-8 text-center text-blue-950">Form Pemesanan Kamar</h2>
      <form onSubmit={handleLanjutPembayaran} className="space-y-6 bg-white p-8 rounded-2xl shadow-md border border-gray-100">
        
        <div>
          <label className="block font-semibold mb-2 text-gray-700">Tipe Kamar</label>
          <select 
            value={roomType} 
            onChange={(e) => setRoomType(e.target.value as 'ac' | 'kipas')} 
            className="w-full p-3 border rounded-xl bg-white"
          >
            <option value="ac">Kamar Tipe AC — Rp 200.000 / malam</option>
            <option value="kipas">Kamar Kipas Angin — Rp 150.000 / malam</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-2 text-gray-700">Nama Tamu</label>
            <input 
              type="text" 
              required 
              value={detailTamu.nama}
              onChange={(e) => setDetailTamu({...detailTamu, nama: e.target.value})} 
              className="w-full p-3 border rounded-xl"
              placeholder="Masukkan nama lengkap"
            />
          </div>
          <div>
            <label className="block font-semibold mb-2 text-gray-700">No. HP</label>
            <input 
              type="text" 
              required 
              value={detailTamu.no_hp}
              onChange={(e) => setDetailTamu({...detailTamu, no_hp: e.target.value})} 
              className="w-full p-3 border rounded-xl"
              placeholder="Contoh: 08123456789"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold mb-2 text-gray-700">Alamat Tamu</label>
          <input 
            type="text" 
            required 
            value={detailTamu.alamat}
            onChange={(e) => setDetailTamu({...detailTamu, alamat: e.target.value})} 
            className="w-full p-3 border rounded-xl"
            placeholder="Masukkan alamat tinggal"
          />
        </div>

        <div>
          <label className="block font-semibold mb-2 text-gray-700">Lama Menginap (Malam)</label>
          <input 
            type="number" 
            min={1} 
            value={lamaMenginap} 
            onChange={(e) => setLamaMenginap(Number(e.target.value))} 
            className="w-full p-3 border rounded-xl"
          />
        </div>

        <div className="flex items-center space-x-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
          <input 
            type="checkbox" 
            id="kasur" 
            checked={extraKasur} 
            onChange={(e) => setExtraKasur(e.target.checked)} 
            className="w-5 h-5 accent-amber-600"
          />
          <label htmlFor="kasur" className="text-sm font-medium text-amber-900 cursor-pointer select-none">
            Tambah Ekstra Kasur (+Rp 35.000 / malam)
          </label>
        </div>

        <div className="border-t pt-4 flex justify-between items-center text-xl font-bold text-gray-900">
          <span>Total Estimasi:</span>
          <span className="text-blue-600">Rp {totalHarga.toLocaleString('id-ID')}</span>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition shadow-sm">
          Lanjut ke Pembayaran
        </button>
      </form>
    </div>
  );
}

// 2. Export default yang dibungkus dengan Suspense agar tidak memicu 404 / Error SSR
export default function BookingPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-gray-500">Memuat data halaman formulir...</div>}>
      <BookingFormContent />
    </Suspense>
  );
}