'use client';

import { useState, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';

// 1. Komponen Internal untuk menangani searchParams
function OtpFormContent() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!email) throw new Error("Email tidak ditemukan.");

      const { data, error } = await supabase.auth.verifyOtp({
        email: email,
        token: otp,
        type: 'signup',
      });

      if (error) throw error;

      const { error: profileError } = await supabase.from('profiles').insert([
        {
          id: data.user?.id,
          nama: data.user?.user_metadata.nama,
          email: email,
          no_hp: data.user?.user_metadata.no_hp,
          alamat: data.user?.user_metadata.alamat,
          role: 'tamu'
        }
      ]);

      if (profileError) throw profileError;

      alert('Verifikasi berhasil! Silakan login.');
      router.push('/login');
    } catch (err: any) {
      alert('Verifikasi Gagal: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleVerify} className="space-y-4">
      <input 
        type="text" 
        value={otp} 
        onChange={(e) => setOtp(e.target.value)} 
        placeholder="Masukkan kode OTP" 
        className="w-full p-3 border border-gray-300 rounded-xl text-center text-lg tracking-widest text-black"
        required 
      />
      <button 
        type="submit" 
        disabled={loading} 
        className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold hover:bg-blue-700 transition disabled:bg-gray-400"
      >
        {loading ? 'Memproses...' : 'Verifikasi Sekarang'}
      </button>
    </form>
  );
}

// 2. Komponen Utama dengan Suspense
export default function VerifyOtpPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-xl font-bold text-center text-blue-950 mb-6">Verifikasi OTP</h2>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Masukkan kode 8 digit yang telah dikirim ke email Anda.
        </p>

        {/* Suspense membungkus komponen yang menggunakan useSearchParams */}
        <Suspense fallback={<p className="text-center">Loading...</p>}>
          <OtpFormContent />
        </Suspense>
      </div>
    </main>
  );
}