'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react'; // Import ikon

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        if (authError.message === "Invalid login credentials") {
          setErrorMessage("Email atau password yang Anda masukkan salah.");
        } else {
          setErrorMessage(authError.message);
        }
        setLoading(false);
        return;
      }

      if (authData?.user) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', authData.user.id)
          .single();

        if (profileError) {
          router.push('/');
          return;
        }

        if (profileData?.role === 'admin') {
          router.push('/admin-dashboard'); 
        } else {
          router.push('/'); 
        }
      }
    } catch (err: any) {
      setErrorMessage('Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center px-4 py-8 bg-slate-900">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{ backgroundImage: "url('/images/bg-login.jpg')" }}
      />
      <div className="absolute inset-0 bg-black/60 pointer-events-none" />

      <div className="w-full max-w-md bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl text-black border border-gray-100 relative z-30">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-950">Masuk Akun</h2>
        
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 text-sm rounded-xl text-center">
            {errorMessage}
          </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase block mb-1">Email</label>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full p-2.5 border border-gray-200 rounded-xl text-sm" 
              placeholder="nama@email.com" 
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-gray-700 uppercase">Password</label>
                <Link href="/forgot-password" className="text-xs font-bold text-blue-600 hover:underline">
                    Lupa password?
                </Link>
            </div>
            
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'} 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full p-2.5 pr-11 border border-gray-200 rounded-xl text-sm" 
                placeholder="••••••••" 
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

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold hover:bg-blue-700 transition disabled:bg-gray-400 mt-2 text-sm"
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-gray-500">
          Belum memiliki akun?{' '}
          <Link href="/register" className="text-blue-600 font-bold hover:underline">Daftar di sini</Link>
        </div>
      </div>
    </main>
  );
}