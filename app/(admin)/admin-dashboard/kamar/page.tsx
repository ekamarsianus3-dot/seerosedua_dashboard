'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function KelolaKamarPage() {
  const [roomTypes, setRoomTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk form tambah kamar
  const [namaTipe, setNamaTipe] = useState('');
  const [harga, setHarga] = useState(0);
  const [kapasitas, setKapasitas] = useState(2);
  const [fasilitas, setFasilitas] = useState('');

  // Ambil data kamar dari Supabase
  const fetchRooms = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('room_types').select('*').order('id', { ascending: true });
    if (!error && data) setRoomTypes(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // Fungsi Tambah Kamar
  const handleTambahKamar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaTipe || harga <= 0) return alert('Data tidak valid!');

    const { error } = await supabase.from('room_types').insert([
      { nama_tipe: namaTipe, harga, kapasitas, fasilitas }
    ]);

    if (error) {
      alert('Gagal menambah kamar: ' + error.message);
    } else {
      alert('Kamar berhasil ditambahkan!');
      setNamaTipe(''); setHarga(0); setFasilitas('');
      fetchRooms(); // Refresh data
    }
  };

  // Fungsi Hapus Kamar
  const handleHapusKamar = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus tipe kamar ini?')) {
      const { error } = await supabase.from('room_types').delete().eq('id', id);
      if (error) alert('Gagal menghapus: ' + error.message);
      else fetchRooms();
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">📂 Mengelola Tipe Kamar</h1>
      
      {/* Form Tambah Kamar */}
      <div className="bg-white p-6 rounded-xl shadow-sm border mb-8">
        <h2 className="text-lg font-semibold mb-4">Tambah Tipe Kamar Baru</h2>
        <form onSubmit={handleTambahKamar} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Nama Tipe (Contoh: Kamar AC Super)" value={namaTipe} onChange={(e) => setNamaTipe(e.target.value)} className="p-3 border rounded-xl bg-white text-black" required />
          <input type="number" placeholder="Harga per Malam (Contoh: 200000)" value={harga || ''} onChange={(e) => setHarga(Number(e.target.value))} className="p-3 border rounded-xl bg-white text-black" required />
          <input type="number" placeholder="Kapasitas Orang" value={kapasitas} onChange={(e) => setKapasitas(Number(e.target.value))} className="p-3 border rounded-xl bg-white text-black" required />
          <input type="text" placeholder="Fasilitas (pisahkan dengan koma)" value={fasilitas} onChange={(e) => setFasilitas(e.target.value)} className="p-3 border rounded-xl bg-white text-black" />
          <button type="submit" className="md:col-span-2 bg-blue-600 text-white font-semibold p-3 rounded-xl hover:bg-blue-700 transition">
            + Simpan Tipe Kamar
          </button>
        </form>
      </div>

      {/* Tabel List Tipe Kamar */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-4 font-semibold">Tipe Kamar</th>
              <th className="p-4 font-semibold">Harga</th>
              <th className="p-4 font-semibold">Kapasitas</th>
              <th className="p-4 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="p-4 text-center">Memuat data...</td></tr>
            ) : roomTypes.length === 0 ? (
              <tr><td colSpan={4} className="p-4 text-center">Belum ada data kamar.</td></tr>
            ) : roomTypes.map((room) => (
              <tr key={room.id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium">{room.nama_tipe}</td>
                <td className="p-4">Rp {room.harga?.toLocaleString('id-ID')}</td>
                <td className="p-4">{room.kapasitas} Orang</td>
                <td className="p-4">
                  <button onClick={() => handleHapusKamar(room.id)} className="bg-red-100 hover:bg-red-200 text-red-600 font-semibold px-3 py-1.5 rounded-lg text-sm transition">
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