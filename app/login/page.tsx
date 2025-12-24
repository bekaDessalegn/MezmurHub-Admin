'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';
import { Music } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signIn(email, password);
      toast.success('Welcome to MezmurHub Admin!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pattern-bg" style={{ background: 'linear-gradient(135deg, #FFF8DC 0%, #FFFDD0 50%, #FFF8DC 100%)' }}>
      <div className="w-full max-w-md px-6">
        {/* Decorative Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4" style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 100%)', boxShadow: '0 10px 30px rgba(212, 175, 55, 0.3)' }}>
            <Music className="h-10 w-10" style={{ color: '#3E2723' }} />
          </div>
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#3E2723' }}>
            MezmurHub
          </h1>
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-12 h-0.5" style={{ background: '#D4AF37' }}></div>
            <span className="text-xl" style={{ color: '#D4AF37' }}>✦</span>
            <div className="w-12 h-0.5" style={{ background: '#D4AF37' }}></div>
          </div>
          <p className="text-sm" style={{ color: '#8B0000', fontWeight: 600 }}>
            Ethiopian Orthodox Mezmur
          </p>
          <p className="text-xs mt-1" style={{ color: '#3E2723', opacity: 0.7 }}>
            Admin Panel
          </p>
        </div>

        {/* Login Card */}
        <div 
          className="rounded-2xl p-12 shadow-2xl backdrop-blur-sm"
          style={{ 
            background: 'rgba(255, 255, 255, 0.95)',
            border: '2px solid #D4AF37',
            boxShadow: '0 20px 60px rgba(62, 39, 35, 0.15)'
          }}
        >
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold mb-3" style={{ color: '#3E2723' }}>
              Admin Sign In
            </h2>
            <p className="text-sm" style={{ color: '#3E2723', opacity: 0.7 }}>
              Enter your credentials to manage songs
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-7">
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-semibold mb-3"
                style={{ color: '#3E2723' }}
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl px-5 py-4 focus:outline-none focus:ring-2 transition-all"
                style={{ 
                  background: '#FFFDD0',
                  border: '2px solid #D4AF37',
                  color: '#3E2723',
                  fontSize: '15px'
                }}
                onFocus={(e) => e.target.style.borderColor = '#8B0000'}
                onBlur={(e) => e.target.style.borderColor = '#D4AF37'}
                placeholder="admin@mezmurhub.com"
              />
            </div>

            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-semibold mb-3"
                style={{ color: '#3E2723' }}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl px-5 py-4 focus:outline-none focus:ring-2 transition-all"
                style={{ 
                  background: '#FFFDD0',
                  border: '2px solid #D4AF37',
                  color: '#3E2723',
                  fontSize: '15px'
                }}
                onFocus={(e) => e.target.style.borderColor = '#8B0000'}
                onBlur={(e) => e.target.style.borderColor = '#D4AF37'}
                placeholder="••••••••"
              />
            </div>

            <div className="pt-8">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl px-6 py-5 font-bold text-base transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{ 
                  background: loading ? '#aaa' : 'linear-gradient(135deg, #D4AF37 0%, #FFD700 100%)',
                  color: '#3E2723',
                  boxShadow: loading ? 'none' : '0 6px 20px rgba(212, 175, 55, 0.4)',
                  border: '2px solid #D4AF37'
                }}
              >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
              </button>
            </div>
          </form>

          {/* Decorative Footer */}
          <div className="mt-10 pt-8 border-t" style={{ borderColor: '#D4AF37' }}>
            <p className="text-center text-xs" style={{ color: '#3E2723', opacity: 0.6 }}>
              Protected Admin Access Only
            </p>
          </div>
        </div>

        {/* Bottom Decoration */}
        <div className="text-center mt-8">
          <p className="text-xs" style={{ color: '#3E2723', opacity: 0.5 }}>
            © 2024 MezmurHub. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
