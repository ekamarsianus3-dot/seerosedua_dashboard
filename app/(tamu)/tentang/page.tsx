export default function TentangPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Tentang Penginapan Seerosedua</h1>
      
      <div className="prose max-w-none bg-gray-50 p-6 rounded-2xl border mb-8">
        <h2 className="text-xl font-bold mb-3 text-slate-800">Aturan & Tata Tertib Penginapan</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li>Waktu <strong>Check-In</strong> dimulai pukul 14:00 WIB.</li>
          <li>Waktu <strong>Check-Out</strong> maksimal pukul 12:00 WIB.</li>
          <li>Dilarang membawa hewan peliharaan ke dalam area kamar.</li>
          <li>Dilarang merokok di dalam kamar bertipe AC.</li>
          <li>Menjaga ketenangan dan kenyamanan bersama sesama tamu penginapan.</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-xl font-bold mb-3 text-slate-800">Lokasi Kami</h2>
          <p className="text-gray-600 mb-4">
            Penginapan kami berlokasi strategis di pusat <strong>Kabupaten Simpang Dua</strong>, Kalimantan Barat. Akses mudah ke area kuliner dan pusat transportasi lokal.
          </p>
          <h2 className="text-xl font-bold mb-3 text-slate-800">Media Sosial</h2>
          <div className="space-y-2">
            <p>📸 <strong>Instagram:</strong> <a href="#" className="text-blue-600 hover:underline">@seerosedua_Penginapan</a></p>
            <p>📘 <strong>Facebook:</strong> <a href="#" className="text-blue-600 hover:underline">Seerosedua Hotel Simpang Dua</a></p>
          </div>
        </div>

        <div className="w-full h-64 bg-gray-200 rounded-2xl overflow-hidden shadow">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.4286253957175!2d110.37397887472379!3d-0.8008053991914089!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e03a1c58e7dc383%3A0x52a7ad22d2897ccc!2sPenginapan%20See%20Rose%20II!5e0!3m2!1sid!2sid!4v1782383915964!5m2!1sid!2sid" 
            className="w-full h-full border-0" allowFullScreen loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
}