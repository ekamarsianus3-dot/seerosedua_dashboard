'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react'; // Import ikon

export default function RegisterPage() {
  const [formData, setFormData] = useState({ 
    nama: '', 
    email: '', 
    no_hp: '', 
    alamat: '', 
    password: '' 
  });
  const [showPassword, setShowPassword] = useState(false); // State untuk toggle password
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password.length < 6) {
      alert("Password minimal harus 6 karakter!");
      setLoading(false);
      return;
    }

    try {
      const { error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: { 
            nama: formData.nama, 
            no_hp: formData.no_hp, 
            alamat: formData.alamat 
          }
        }
      });

      if (authError) throw authError;

      alert('Pendaftaran berhasil! Silakan cek email Anda untuk kode verifikasi.');
      router.push(`/verify-otp?email=${encodeURIComponent(formData.email)}`);

    } catch (err: any) {
      console.error("Error:", err);
      alert("Pendaftaran Gagal: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-2xl font-bold text-center text-blue-950 mb-6">Daftar Akun Baru</h2>
        
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase block mb-1">Nama Lengkap</label>
            <input type="text" required value={formData.nama} onChange={(e) => setFormData({...formData, nama: e.target.value})} className="w-full p-3 border border-gray-300 rounded-xl text-sm text-black" placeholder="Masukan Nama Anda" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase block mb-1">Email</label>
            <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full p-3 border border-gray-300 rounded-xl text-sm text-black" placeholder="Masukan Email Anda" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase block mb-1">No. HP</label>
            <input type="text" required value={formData.no_hp} onChange={(e) => setFormData({...formData, no_hp: e.target.value})} className="w-full p-3 border border-gray-300 rounded-xl text-sm text-black" placeholder="Masukan No Hp Anda" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase block mb-1">Alamat</label>
            <textarea required value={formData.alamat} onChange={(e) => setFormData({...formData, alamat: e.target.value})} className="w-full p-3 border border-gray-300 rounded-xl text-sm text-black" rows={2} placeholder="Alamat lengkap" />
          </div>
          
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase block mb-1">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'} 
                required 
                value={formData.password} 
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                className="w-full p-3 pr-11 border border-gray-300 rounded-xl text-sm text-black" 
                placeholder="Masukan Password" 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-blue-600 transition"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold hover:bg-blue-700 transition disabled:bg-gray-400">
            {loading ? 'Memproses...' : 'Daftar Sekarang'}
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-gray-500">
          Sudah punya akun? <Link href="/login" className="text-blue-600 font-bold hover:underline">Masuk</Link>
        </div>
      </div>
    </main>
  );
}