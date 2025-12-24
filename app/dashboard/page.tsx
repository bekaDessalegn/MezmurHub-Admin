'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Music, Folder, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalSongs: 0,
    totalCategories: 0,
    recentSongs: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const songsSnapshot = await getDocs(collection(db, 'songs'));
        const categoriesSnapshot = await getDocs(collection(db, 'categories'));

        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);

        const recentSongsQuery = query(
          collection(db, 'songs'),
          orderBy('createdAt', 'desc'),
          limit(100)
        );
        const recentSnapshot = await getDocs(recentSongsQuery);
        const recentCount = recentSnapshot.docs.filter(doc => {
          const createdAt = doc.data().createdAt?.toDate();
          return createdAt && createdAt > weekAgo;
        }).length;

        setStats({
          totalSongs: songsSnapshot.size,
          totalCategories: categoriesSnapshot.size,
          recentSongs: recentCount,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg font-semibold" style={{ color: '#3E2723' }}>Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="p-12" style={{ background: '#FFF8DC', minHeight: '100vh' }}>
      {/* Header Section - More spacing */}
      <div className="mb-16">
        <h1 className="text-4xl font-bold mb-4" style={{ color: '#3E2723' }}>
          Dashboard
        </h1>
        <div className="flex items-center gap-3">
          <div className="w-20 h-0.5" style={{ background: '#D4AF37' }}></div>
          <span className="text-2xl" style={{ color: '#D4AF37' }}>✦</span>
          <div className="w-20 h-0.5" style={{ background: '#D4AF37' }}></div>
        </div>
      </div>

      {/* Stats Cards - More spacing between cards and sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div
          className="rounded-2xl p-8 shadow-lg border-2 transition-all hover:shadow-xl"
          style={{
            background: 'white',
            borderColor: '#D4AF37'
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-semibold mb-4" style={{ color: '#8B0000' }}>
                Total Songs
              </p>
              <p className="text-4xl font-bold" style={{ color: '#3E2723' }}>
                {stats.totalSongs}
              </p>
            </div>
            <div
              className="rounded-full p-5 ml-4"
              style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 100%)' }}
            >
              <Music className="h-8 w-8" style={{ color: '#3E2723' }} />
            </div>
          </div>
        </div>

        <div
          className="rounded-2xl p-8 shadow-lg border-2 transition-all hover:shadow-xl"
          style={{
            background: 'white',
            borderColor: '#006400'
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-semibold mb-4" style={{ color: '#006400' }}>
                Categories
              </p>
              <p className="text-4xl font-bold" style={{ color: '#3E2723' }}>
                {stats.totalCategories}
              </p>
            </div>
            <div
              className="rounded-full p-5 ml-4"
              style={{ background: 'rgba(0, 100, 0, 0.15)', border: '2px solid #006400' }}
            >
              <Folder className="h-8 w-8" style={{ color: '#006400' }} />
            </div>
          </div>
        </div>

        <div
          className="rounded-2xl p-8 shadow-lg border-2 transition-all hover:shadow-xl"
          style={{
            background: 'white',
            borderColor: '#8B0000'
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-semibold mb-4" style={{ color: '#8B0000' }}>
                New This Week
              </p>
              <p className="text-4xl font-bold" style={{ color: '#3E2723' }}>
                {stats.recentSongs}
              </p>
            </div>
            <div
              className="rounded-full p-5 ml-4"
              style={{ background: 'rgba(139, 0, 0, 0.15)', border: '2px solid #8B0000' }}
            >
              <TrendingUp className="h-8 w-8" style={{ color: '#8B0000' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Section - More spacing */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-6" style={{ color: '#3E2723' }}>
          Quick Actions
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Link
          href="/songs/new"
          className="rounded-2xl p-10 shadow-lg border-2 transition-all hover:shadow-2xl hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(255, 215, 0, 0.1) 100%)',
            borderColor: '#D4AF37'
          }}
        >
          <div className="flex items-start gap-6">
            <div
              className="rounded-xl p-4 flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 100%)' }}
            >
              <Music className="h-7 w-7" style={{ color: '#3E2723' }} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-3" style={{ color: '#3E2723' }}>
                Add New Song
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: '#3E2723', opacity: 0.7 }}>
                Create a new mezmur with lyrics and audio
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/categories/new"
          className="rounded-2xl p-10 shadow-lg border-2 transition-all hover:shadow-2xl hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, rgba(0, 100, 0, 0.05) 0%, rgba(0, 100, 0, 0.1) 100%)',
            borderColor: '#006400'
          }}
        >
          <div className="flex items-start gap-6">
            <div
              className="rounded-xl p-4 flex-shrink-0"
              style={{ background: 'rgba(0, 100, 0, 0.15)', border: '2px solid #006400' }}
            >
              <Folder className="h-7 w-7" style={{ color: '#006400' }} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-3" style={{ color: '#3E2723' }}>
                Add New Category
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: '#3E2723', opacity: 0.7 }}>
                Create a new category for organizing songs
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
