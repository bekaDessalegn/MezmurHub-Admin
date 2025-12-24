'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Song, Category } from '@/lib/types';
import Link from 'next/link';
import { Plus, Edit, Trash2, Music } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function SongsPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSongs();
    fetchCategories();
  }, []);

  async function fetchSongs() {
    try {
      const q = query(collection(db, 'songs'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const songsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Song[];
      setSongs(songsData);
    } catch (error) {
      console.error('Error fetching songs:', error);
      toast.error('Failed to load songs');
    } finally {
      setLoading(false);
    }
  }

  async function fetchCategories() {
    try {
      const snapshot = await getDocs(collection(db, 'categories'));
      const categoriesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      })) as Category[];
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this song?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'songs', id));
      setSongs(songs.filter(song => song.id !== id));
      toast.success('Song deleted successfully');
    } catch (error) {
      console.error('Error deleting song:', error);
      toast.error('Failed to delete song');
    }
  }

  function getCategoryNames(categoryIds: string[]) {
    return categoryIds
      .map(id => categories.find(cat => cat.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ background: '#FFF8DC' }}>
        <div className="text-center">
          <div 
            className="inline-flex rounded-full p-4 mb-4 animate-pulse"
            style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 100%)' }}
          >
            <Music className="h-8 w-8" style={{ color: '#3E2723' }} />
          </div>
          <div className="text-lg font-semibold" style={{ color: '#3E2723' }}>
            Loading songs...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8" style={{ background: '#FFF8DC', minHeight: '100vh' }}>
      {/* Header with spacing */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold mb-3" style={{ color: '#3E2723' }}>
            Songs
          </h1>
          <div className="flex items-center gap-2">
            <div className="w-16 h-0.5" style={{ background: '#D4AF37' }}></div>
            <span style={{ color: '#D4AF37' }}>✦</span>
          </div>
        </div>
        <Link
          href="/songs/new"
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105"
          style={{ 
            background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 100%)',
            color: '#3E2723',
            boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)',
            border: '2px solid #D4AF37'
          }}
        >
          <Plus className="h-5 w-5" />
          Add New Song
        </Link>
      </div>

      {/* Content with proper spacing */}
      {songs.length === 0 ? (
        <div 
          className="rounded-2xl p-16 text-center shadow-lg border-2"
          style={{ background: 'white', borderColor: '#D4AF37' }}
        >
          <div 
            className="inline-flex rounded-full p-6 mb-6"
            style={{ background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(255, 215, 0, 0.15) 100%)' }}
          >
            <Music className="h-12 w-12" style={{ color: '#D4AF37' }} />
          </div>
          <h3 className="text-xl font-bold mb-3" style={{ color: '#3E2723' }}>
            No songs yet
          </h3>
          <p className="mb-8" style={{ color: '#3E2723', opacity: 0.7 }}>
            Get started by creating your first mezmur song.
          </p>
          <Link
            href="/songs/new"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105"
            style={{ 
              background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 100%)',
              color: '#3E2723',
              boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)',
              border: '2px solid #D4AF37'
            }}
          >
            <Plus className="h-5 w-5" />
            Add New Song
          </Link>
        </div>
      ) : (
        <div 
          className="rounded-2xl shadow-lg overflow-hidden border-2"
          style={{ background: 'white', borderColor: '#D4AF37' }}
        >
          <table className="min-w-full">
            <thead style={{ background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(255, 215, 0, 0.1) 100%)' }}>
              <tr className="border-b-2" style={{ borderColor: '#D4AF37' }}>
                <th className="px-8 py-5 text-left text-xs font-bold uppercase tracking-wider" style={{ color: '#3E2723' }}>
                  Title
                </th>
                <th className="px-8 py-5 text-left text-xs font-bold uppercase tracking-wider" style={{ color: '#3E2723' }}>
                  Categories
                </th>
                <th className="px-8 py-5 text-left text-xs font-bold uppercase tracking-wider" style={{ color: '#3E2723' }}>
                  Audio
                </th>
                <th className="px-8 py-5 text-left text-xs font-bold uppercase tracking-wider" style={{ color: '#3E2723' }}>
                  Created
                </th>
                <th className="px-8 py-5 text-right text-xs font-bold uppercase tracking-wider" style={{ color: '#3E2723' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {songs.map((song) => (
                <tr 
                  key={song.id} 
                  className="border-b transition-all"
                  style={{ borderColor: 'rgba(212, 175, 55, 0.2)' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(212, 175, 55, 0.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
                  <td className="px-8 py-5">
                    <div className="text-sm font-bold" style={{ color: '#3E2723' }}>
                      {song.title}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="text-sm" style={{ color: '#3E2723', opacity: 0.8 }}>
                      {getCategoryNames(song.categoryIds) || 'No categories'}
                    </div>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    <span 
                      className="inline-flex px-3 py-1 text-xs font-bold rounded-full"
                      style={{
                        background: song.audioUrl ? 'rgba(0, 100, 0, 0.15)' : 'rgba(139, 0, 0, 0.15)',
                        color: song.audioUrl ? '#006400' : '#8B0000',
                        border: '1px solid',
                        borderColor: song.audioUrl ? '#006400' : '#8B0000'
                      }}
                    >
                      {song.audioUrl ? '✓ Audio' : '✗ No Audio'}
                    </span>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-sm" style={{ color: '#3E2723', opacity: 0.7 }}>
                    {format(song.createdAt, 'MMM d, yyyy')}
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/songs/${song.id}/edit`}
                        className="p-2 rounded-lg transition-all"
                        style={{ background: 'rgba(212, 175, 55, 0.1)', color: '#D4AF37' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'linear-gradient(135deg, #D4AF37 0%, #FFD700 100%)';
                          e.currentTarget.style.color = '#3E2723';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)';
                          e.currentTarget.style.color = '#D4AF37';
                        }}
                      >
                        <Edit className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(song.id)}
                        className="p-2 rounded-lg transition-all"
                        style={{ background: 'rgba(139, 0, 0, 0.1)', color: '#8B0000' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#8B0000';
                          e.currentTarget.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(139, 0, 0, 0.1)';
                          e.currentTarget.style.color = '#8B0000';
                        }}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
