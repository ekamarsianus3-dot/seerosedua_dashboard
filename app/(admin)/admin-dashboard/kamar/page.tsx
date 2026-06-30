'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function KelolaKamarPage() {
  const [roomTypes, setRoomTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [namaTipe, setNamaTipe] = useState('');
  const [harga, setHarga] = useState(0);
  const [kapasitas, setKapasitas] = useState(2);
  const [fasilitas, setFasilitas] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);

  const fetchRooms = async () => {
    setLoading(true);
    const { data } = await supabase.from('room_types').select('*').order('id', { ascending: true });
    if (data) setRoomTypes(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleTambahKamar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files || files.length < 3) return alert('Harap pilih minimal 3 foto!');

    setLoading(true);
    let uploadedUrls = [];

    try {
      // 1. Unggah 3 foto ke Supabase Storage 'room-images' (DIUBAH DISINI)
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${i}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('room-images') // <--- SUDAH DIGANTI
          .upload(`kamar/${fileName}`, file);
        
        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage.from('room-images').getPublicUrl(`kamar/${fileName}`); // <--- SUDAH DIGANTI
        uploadedUrls.push(data.publicUrl);
      }

      // 2. Simpan ke database
      const { error } = await supabase.from('room_types').insert([{
        nama_tipe: namaTipe,
        harga,
        kapasitas,
        fasilitas,
        gambar: JSON.stringify(uploadedUrls)
      }]);

      if (error) throw error;

      alert('Kamar berhasil ditambahkan!');
      setNamaTipe(''); setHarga(0); setFasilitas(''); setFiles(null);
      fetchRooms();
    } catch (err: any) {
      alert('Gagal: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleHapusKamar = async (id: number) => {
    if (confirm('Yakin ingin menghapus tipe kamar ini?')) {
      const { error } = await supabase.from('room_types').delete().eq('id', id);
      if (error) alert('Gagal hapus: ' + error.message);
      else fetchRooms();
    }
  };

  return (
    <div className="p-6 text-black">
      <h1 className="text-2xl font-bold mb-6">📂 Kelola Tipe Kamar</h1>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border mb-8">
        <form onSubmit={handleTambahKamar} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Nama Tipe Kamar" value={namaTipe} onChange={(e) => setNamaTipe(e.target.value)} className="p-3 border rounded-xl" required />
          <input type="number" placeholder="Harga per Malam" value={harga || ''} onChange={(e) => setHarga(Number(e.target.value))} className="p-3 border rounded-xl" required />
          <input type="number" placeholder="Kapasitas Orang" value={kapasitas} onChange={(e) => setKapasitas(Number(e.target.value))} className="p-3 border rounded-xl" required />
          <input type="text" placeholder="Fasilitas (Contoh: AC, TV, Wifi)" value={fasilitas} onChange={(e) => setFasilitas(e.target.value)} className="p-3 border rounded-xl" />
          
          <div className="md:col-span-2">
            <label className="block text-sm font-bold mb-2">Unggah 3 Foto Kamar:</label>
            <input type="file" multiple accept="image/*" onChange={(e) => setFiles(e.target.files)} className="w-full p-3 border rounded-xl" required />
          </div>

          <button type="submit" disabled={loading} className="md:col-span-2 bg-blue-600 text-white font-semibold p-3 rounded-xl hover:bg-blue-700 transition">
            {loading ? 'Sedang Memproses...' : '+ Simpan Tipe Kamar'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Foto</th>
              <th className="p-4">Tipe</th>
              <th className="p-4">Harga</th>
              <th className="p-4">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {roomTypes.map((room) => (
              <tr key={room.id} className="border-b">
                <td className="p-4 flex gap-2">
                  {room.gambar && JSON.parse(room.gambar).map((url: string, i: number) => (
                    <img key={i} src={url} className="w-16 h-16 object-cover rounded border" alt="kamar" />
                  ))}
                </td>
                <td className="p-4 font-medium">{room.nama_tipe}</td>
                <td className="p-4">Rp {room.harga?.toLocaleString()}</td>
                <td className="p-4">
                  <button onClick={() => handleHapusKamar(room.id)} className="text-red-600 bg-red-100 px-3 py-1 rounded-lg">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}