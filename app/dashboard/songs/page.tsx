'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Music } from 'lucide-react';
import { getAllSongs, deleteSong } from '@/lib/services/song-service';
import { getAllCategories } from '@/lib/services/category-service';
import { Song, Category } from '@/lib/types';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function SongsPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [songsData, categoriesData] = await Promise.all([
        getAllSongs(),
        getAllCategories(),
      ]);
      setSongs(songsData);
      setCategories(categoriesData);
    } catch (error) {
      toast.error('Failed to load songs');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    setDeleting(id);
    try {
      await deleteSong(id);
      setSongs(songs.filter((song) => song.id !== id));
      toast.success('Song deleted successfully');
    } catch (error) {
      toast.error('Failed to delete song');
      console.error(error);
    } finally {
      setDeleting(null);
    }
  }

  function getCategoryNames(categoryIds: string[]) {
    return categoryIds
      .map((id) => categories.find((cat) => cat.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading songs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Songs</h1>
          <p className="mt-2 text-gray-600">Manage all songs in the app</p>
        </div>
        <Link
          href="/dashboard/songs/new"
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          Add Song
        </Link>
      </div>

      {songs.length === 0 ? (
        <div className="rounded-lg bg-white p-12 text-center shadow-md">
          <Music className="mx-auto h-16 w-16 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No songs yet</h3>
          <p className="mt-2 text-gray-600">Get started by creating your first song</p>
          <Link
            href="/dashboard/songs/new"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            <Plus className="h-5 w-5" />
            Add Song
          </Link>
        </div>
      ) : (
        <div className="rounded-lg bg-white shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Categories
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Audio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {songs.map((song) => (
                  <tr key={song.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{song.title}</div>
                      <div className="text-sm text-gray-500">
                        {song.lyrics.substring(0, 60)}...
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {getCategoryNames(song.categoryIds) || '-'}
                    </td>
                    <td className="px-6 py-4">
                      {song.audioUrl ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                          <Music className="h-3 w-3" />
                          Available
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                          No audio
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {format(song.createdAt, 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/dashboard/songs/${song.id}/edit`}
                          className="rounded p-2 text-blue-600 hover:bg-blue-50"
                        >
                          <Edit className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(song.id, song.title)}
                          disabled={deleting === song.id}
                          className="rounded p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
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
        </div>
      )}
    </div>
  );
}

