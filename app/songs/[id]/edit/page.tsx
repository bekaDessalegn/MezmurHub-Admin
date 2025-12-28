'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
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
      let thumbnailUrl = data.imageUrl;

      // Upload new audio file if provided
      if (data.audioFile) {
        // Delete old audio file if exists
        if (song?.audioUrl) {
          try {
            const oldAudioRef = ref(storage, song.audioUrl);
            await deleteObject(oldAudioRef);
          } catch (error) {
            console.error('Error deleting old audio file:', error);
          }
        }
        const audioRef = ref(storage, `songs/${Date.now()}_${data.audioFile.name}`);
        await uploadBytes(audioRef, data.audioFile);
        audioUrl = await getDownloadURL(audioRef);
      }

      // Handle image upload/removal
      if (data.imageFile) {
        // Upload new image file
        // Delete old image file if exists
        if (song?.thumbnailUrl) {
          try {
            const oldImageRef = ref(storage, song.thumbnailUrl);
            await deleteObject(oldImageRef);
          } catch (error) {
            console.error('Error deleting old image file:', error);
          }
        }
        const imageRef = ref(storage, `song-images/${Date.now()}_${data.imageFile.name}`);
        await uploadBytes(imageRef, data.imageFile);
        thumbnailUrl = await getDownloadURL(imageRef);
      } else if (data.imageUrl === null && song?.thumbnailUrl) {
        // Image was removed - delete old file
        try {
          const oldImageRef = ref(storage, song.thumbnailUrl);
          await deleteObject(oldImageRef);
        } catch (error) {
          console.error('Error deleting old image file:', error);
        }
        thumbnailUrl = null;
      } else {
        // Keep existing image URL
        thumbnailUrl = song?.thumbnailUrl || null;
      }

      // Update song document
      const docRef = doc(db, 'songs', resolvedParams.id);
      const updateData: {
        title: string;
        lyrics: string;
        categoryIds: string[];
        audioUrl: string | null;
        thumbnailUrl: string | null;
        updatedAt: ReturnType<typeof serverTimestamp>;
      } = {
        title: data.title,
        lyrics: data.lyrics,
        categoryIds: data.categoryIds,
        audioUrl: audioUrl !== undefined ? (audioUrl || null) : song?.audioUrl || null,
        thumbnailUrl: thumbnailUrl,
        updatedAt: serverTimestamp(),
      };

      await updateDoc(docRef, updateData);

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
              imageUrl: song.thumbnailUrl,
            }}
            onSubmit={handleSubmit}
            submitLabel="Update Song"
          />
        </div>
      </div>
    </div>
  );
}
