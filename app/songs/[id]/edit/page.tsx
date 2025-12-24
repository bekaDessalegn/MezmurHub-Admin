'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { Song, SongFormData } from '@/lib/types';
import SongForm from '@/components/SongForm';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function EditSongPage({ params }: { params: Promise<{ id: string }> }) {
  const [song, setSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(true);
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  useEffect(() => {
    if (resolvedParams) {
      fetchSong();
    }
  }, [resolvedParams]);

  async function fetchSong() {
    if (!resolvedParams) return;

    try {
      const docRef = doc(db, 'songs', resolvedParams.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setSong({
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        } as Song);
      } else {
        toast.error('Song not found');
        router.push('/songs');
      }
    } catch (error) {
      console.error('Error fetching song:', error);
      toast.error('Failed to load song');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(data: SongFormData) {
    if (!resolvedParams) return;

    try {
      let audioUrl = data.audioUrl;

      // Upload new audio file if provided
      if (data.audioFile) {
        const audioRef = ref(storage, `songs/${Date.now()}_${data.audioFile.name}`);
        await uploadBytes(audioRef, data.audioFile);
        audioUrl = await getDownloadURL(audioRef);
      }

      // Update song document
      const docRef = doc(db, 'songs', resolvedParams.id);
      await updateDoc(docRef, {
        title: data.title,
        lyrics: data.lyrics,
        categoryIds: data.categoryIds,
        audioUrl: audioUrl || null,
        updatedAt: serverTimestamp(),
      });

      toast.success('Song updated successfully!');
      router.push('/songs');
    } catch (error) {
      console.error('Error updating song:', error);
      toast.error('Failed to update song');
      throw error;
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg">Loading song...</div>
      </div>
    );
  }

  if (!song) {
    return null;
  }

  return (
    <div className="p-8" style={{ background: '#FFF8DC', minHeight: '100vh' }}>
      {/* Back link with spacing */}
      <div className="mb-8">
        <Link
          href="/songs"
          className="inline-flex items-center gap-2 text-sm font-semibold transition-colors"
          style={{ color: '#3E2723', opacity: 0.7 }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#D4AF37';
            e.currentTarget.style.opacity = '1';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#3E2723';
            e.currentTarget.style.opacity = '0.7';
          }}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Songs
        </Link>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Header with spacing */}
        <h1 className="text-3xl font-bold mb-10" style={{ color: '#3E2723' }}>
          Edit Song
        </h1>

        {/* Form container with proper padding */}
        <div 
          className="rounded-2xl shadow-lg p-10 border-2"
          style={{ background: 'white', borderColor: '#D4AF37' }}
        >
          <SongForm
            initialData={{
              title: song.title,
              lyrics: song.lyrics,
              categoryIds: song.categoryIds,
              audioUrl: song.audioUrl,
            }}
            onSubmit={handleSubmit}
            submitLabel="Update Song"
          />
        </div>
      </div>
    </div>
  );
}
