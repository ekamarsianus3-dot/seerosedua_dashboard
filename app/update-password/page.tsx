'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isReady, setIsReady] = useState(false); // Tambahkan state untuk menunggu sesi
  const router = useRouter();

  useEffect(() => {
    // Supabase secara otomatis memproses hash di URL.
    // Kita perlu mendeteksi apakah sesi sudah siap sebelum user mengklik tombol.
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsReady(true);
      }
    });

    // Cek jika sudah ada sesi aktif
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setIsReady(true);
    });

    return () => { data.subscription.unsubscribe(); };
  }, []);

  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password: password });
    
    if (error) {
      alert('Gagal: ' + error.message);
    } else {
      alert('Password berhasil diubah!');
      router.push('/login');
    }
    setLoading(false);
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-slate-900">
      <div className="w-full max-w-md bg-white/95 p-8 rounded-2xl shadow-2xl text-black">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-950">Set Password Baru</h2>
        
        {!isReady ? (
          <p className="text-center text-gray-500">Memvalidasi sesi... mohon tunggu.</p>
        ) : (
          <form onSubmit={updatePassword} className="space-y-4">
            <input 
              type="password" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full p-3 border rounded-xl text-black" 
              placeholder="Masukkan password baru" 
            />
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold"
            >
              {loading ? 'Memproses...' : 'Simpan Password Baru'}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}