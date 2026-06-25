import Link from 'next/link';

export default function TamuHomePage() {
  return (
    <div className="w-full bg-white text-gray-800">
      
      {/* 1. Full-Screen Video Hero */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Menggunakan background gambar hero-home.jpg jika video tidak tersedia */}
        <video 
          autoPlay loop muted playsInline 
          className="absolute z-0 min-w-full min-h-full object-cover"
          poster="/images/hero-home.jpg"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        
        <div className="relative z-20 text-center text-white px-4 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-md">
            Rasakan Kemewahan Menginap Terbaik
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Suasana tenang dengan fasilitas eksklusif untuk kenyamanan istirahat Anda.
          </p>
          <Link href="/kamar" className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-8 py-4 rounded-xl transition shadow-lg text-lg">
            Pesan Kamar Sekarang
          </Link>
        </div>
      </section>

      {/* 2. Cuplikan Kamar Terpopuler */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-blue-950">Kamar Terpopuler Kami</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Kamar Tipe AC */}
          <div className="border rounded-2xl overflow-hidden shadow-md bg-white">
            <img 
              src="/images/kamar-ac.jpg" 
              alt="Deluxe Room" 
              className="w-full h-64 object-cover" 
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=600';
              }}
            />
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">Tipe AC (Deluxe)</h3>
              <p className="text-gray-600 mb-4">Kapasitas: 2 Orang • Kamar mandi dalam, TV, Free WiFi.</p>
              <p className="text-blue-600 font-bold text-xl">Rp 200.000 / malam</p>
            </div>
          </div>
          
          {/* Kamar Tipe Kipas Angin */}
          <div className="border rounded-2xl overflow-hidden shadow-md bg-white">
            <img 
              src="/images/kamar-kipas.jpg" 
              alt="Standard Room" 
              className="w-full h-64 object-cover" 
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=600';
              }}
            />
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">Tipe Kipas Angin (Standard)</h3>
              <p className="text-gray-600 mb-4">Kapasitas: 2 Orang • Kenyamanan alami dengan sirkulasi udara optimal.</p>
              <p className="text-blue-600 font-bold text-xl">Rp 100.000 / malam</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Fasilitas Unggulan */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-950">Fasilitas Unggulan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Menggunakan foto hero-home sebagai representasi fasilitas jika belum ada foto resto */}
            <img 
              src="/images/hero-home.jpg" 
              alt="Restoran Hotel" 
              className="rounded-2xl shadow-lg w-full h-80 object-cover" 
            />
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Cafe Eksklusif</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Nikmati hidangan lokal dan internasional berkualitas yang disiapkan langsung oleh koki profesional kami dalam suasana yang nyaman dan mewah.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Peta dan Kontak */}
      <section className="py-16 max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4 text-blue-950">Lokasi & Kontak</h2>
          <p className="mb-2"><strong>Alamat:</strong> Kabupaten Ketapang,Kecamatan Simpang Dua, Kalimantan Barat</p>
          <p className="mb-2"><strong>WhatsApp:</strong> +62 812-5041-2234</p>
          <p className="mb-6"><strong>Email:</strong> seerosedua@gmail.com</p>
        </div>
        <div className="w-full h-64 bg-gray-200 rounded-2xl overflow-hidden shadow-inner">
          <iframe 
            src="https://maps.google.com/maps?q=Simpang%20Dua,%20Kalimantan%20Barat&t=&z=13&ie=UTF8&iwloc=&output=embed" 
            className="w-full h-full border-0" 
            allowFullScreen 
            loading="lazy"
          ></iframe>
        </div>
      </section>
    </div>
  );
}