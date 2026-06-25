'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function KamarTamuPage() {
  const [roomTypes, setRoomTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const router = useRouter();

  const fetchRooms = async () => {
    setLoading(true);
    const { data } = await supabase.from('room_types').select('*');
    setRoomTypes(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchRooms(); }, []);

  const getRoomImages = (namaKamar: string) => {
    const name = namaKamar.toLowerCase();
    if (name.includes('ac')) return ['/images/ac1.jpg', '/images/ac2.jpg'];
    return ['/images/kipas1.jpg', '/images/kipas2.jpg'];
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pt-28 pb-12">
      <h1 className="text-3xl font-extrabold text-blue-950 mb-8">Pilihan Tipe Kamar</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        {roomTypes.map((room) => (
          <div key={room.id} className="bg-white rounded-3xl border shadow-sm overflow-hidden flex flex-col">
            {/* Foto Kamar - Slider Manual */}
            <div className="h-64 flex overflow-x-auto snap-x scrollbar-hide">
              {getRoomImages(room.nama_tipe).map((src, i) => (
                <img 
                  key={i}
                  src={src} 
                  alt="Kamar" 
                  className="w-full h-full object-cover cursor-pointer snap-center flex-shrink-0"
                  onClick={() => setSelectedImage(src)}
                />
              ))}
            </div>

            {/* Konten Detail */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{room.nama_tipe}</h3>
                <p className="text-gray-500 text-sm mt-2">{room.deskripsi}</p>
                
                {/* Bagian Fasilitas */}
                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span>👤</span> Kapasitas: <strong>{room.kapasitas || 2} Orang</strong>
                  </div>
                  {room.fasilitas && (
                    <div className="flex items-start gap-2">
                      <span>✨</span> 
                      <span>{typeof room.fasilitas === 'string' ? room.fasilitas : room.fasilitas.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Harga & Tombol */}
              <div className="mt-6 pt-6 border-t flex justify-between items-center">
                <p className="text-xl font-black text-blue-600">Rp {(room.harga || 0).toLocaleString('id-ID')}</p>
                <button 
                  onClick={() => router.push(`/pesan?type=${room.id}`)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition"
                >
                  Pesan Kamar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Fullscreen */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <img src={selectedImage} className="max-w-full max-h-full rounded-lg shadow-2xl" />
          <button className="absolute top-5 right-5 text-white text-3xl font-light hover:text-gray-300">×</button>
        </div>
      )}
    </div>
  );
}