import type { Metadata } from 'next';
import { Noto_Serif } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

const notoSerif = Noto_Serif({ 
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MezmurHub Admin',
  description: 'Admin panel for MezmurHub - Ethiopian Orthodox Mezmur songs',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={notoSerif.className}>
        <AuthProvider>
          {children}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#FFF8DC',
                color: '#3E2723',
                border: '2px solid #D4AF37',
                fontFamily: 'Noto Serif, serif',
              },
              success: {
                iconTheme: {
                  primary: '#006400',
                  secondary: '#FFF8DC',
                },
              },
              error: {
                iconTheme: {
                  primary: '#8B0000',
                  secondary: '#FFF8DC',
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
