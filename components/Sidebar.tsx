'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Music, Folder, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Songs', href: '/songs', icon: Music },
  { name: 'Categories', href: '/categories', icon: Folder },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { signOut, user } = useAuth();

  return (
    <div className="flex h-screen w-64 flex-col p-4 border-primary" style={{ background: 'linear-gradient(180deg, #3E2723 0%, #2C1810 100%)' }}>
      {/* Header */}
      <div className="flex h-20 items-center justify-center border-b-2 border-primary" style={{ background: 'rgba(212, 175, 55, 0.1)' }}>
        <div className="text-center">
          <h1 className="text-xl font-bold" style={{ color: '#D4AF37' }}>
            MezmurHub
          </h1>
          <p className="text-xs mt-1" style={{ color: '#FFFDD0', opacity: 0.8 }}>
            Admin Panel
          </p>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 space-y-2 px-3 py-6">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${isActive ? 'bg-primary text-dark border-primary shadow-lg' : 'bg-transparent text-cream'}`}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(212, 175, 55, 0.15)';
                  e.currentTarget.style.borderColor = '#D4AF37';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = 'transparent';
                }
              }}
            >
              <Icon className="h-5 w-5" style={{ color: isActive ? '#3E2723' : '#D4AF37' }} />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      {/* User Info & Logout */}
      <div className="border-t-2 p-4 border-primary bg-cream bg-opacity-5">
        <div className="mb-3 px-2">
          <p className="text-xs font-semibold mb-1" style={{ color: '#D4AF37' }}>
            Signed in as
          </p>
          <p className="text-xs truncate" style={{ color: '#FFFDD0', opacity: 0.9 }}>
            {user?.email}
          </p>
        </div>
        <button
          onClick={() => signOut()}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all bg-red bg-opacity-20 text-cream border-red"
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#8B0000';
            e.currentTarget.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(139, 0, 0, 0.2)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
