'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { createSong, uploadAudioFile } from '@/lib/services/song-service';
import { getAllCategories } from '@/lib/services/category-service';
import { Category } from '@/lib/types';
import RichTextEditor from '@/components/RichTextEditor';
import AudioUpload from '@/components/AudioUpload';

export default function NewSongPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    lyrics: '',
    categoryIds: [] as string[],
  });

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (error) {
        toast.error('Failed to load categories');
      }
    }
    loadCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.lyrics) {
      toast.error('Title and lyrics are required');
      return;
    }

    setLoading(true);

    try {
      let audioUrl: string | undefined;

      // Upload audio file if selected
      if (audioFile) {
        toast.loading('Uploading audio...', { id: 'upload' });
        audioUrl = await uploadAudioFile(audioFile, formData.title);
        toast.success('Audio uploaded!', { id: 'upload' });
      }

      // Create song
      await createSong({
        title: formData.title,
        lyrics: formData.lyrics,
        categoryIds: formData.categoryIds,
        audioUrl,
      });

      toast.success('Song created successfully!');
      router.push('/dashboard/songs');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create song';
      toast.error(errorMessage);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryToggle = (categoryId: string) => {
    setFormData((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter((id) => id !== categoryId)
        : [...prev.categoryIds, categoryId],
    }));
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link
          href="/dashboard/songs"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Songs
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-gray-900">Add New Song</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Song Title *
              </label>
              <input
                id="title"
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                placeholder="Enter song title"
              />
            </div>

            {/* Lyrics */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lyrics *
              </label>
              <RichTextEditor
                content={formData.lyrics}
                onChange={(content) => setFormData({ ...formData, lyrics: content })}
              />
            </div>

            {/* Categories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categories
              </label>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {categories.map((category) => (
                  <label
                    key={category.id}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border-2 p-3 transition-colors ${
                      formData.categoryIds.includes(category.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.categoryIds.includes(category.id)}
                      onChange={() => handleCategoryToggle(category.id)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-900">
                      {category.name}
                    </span>
                  </label>
                ))}
              </div>
              {categories.length === 0 && (
                <p className="text-sm text-gray-500">
                  No categories available.{' '}
                  <Link href="/dashboard/categories" className="text-blue-600 hover:underline">
                    Create one first
                  </Link>
                </p>
              )}
            </div>

            {/* Audio Upload */}
            <AudioUpload onFileSelect={setAudioFile} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Link
            href="/dashboard/songs"
            className="rounded-lg border border-gray-300 px-6 py-2 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Creating...' : 'Create Song'}
          </button>
        </div>
      </form>
    </div>
  );
}

