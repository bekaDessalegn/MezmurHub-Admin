'use client';

import { useRouter } from 'next/navigation';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { SongFormData } from '@/lib/types';
import SongForm from '@/components/SongForm';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NewSongPage() {
  const router = useRouter();

  async function handleSubmit(data: SongFormData) {
    try {
      let audioUrl = data.audioUrl;

      // Upload audio file if provided
      if (data.audioFile) {
        const audioRef = ref(storage, `songs/${Date.now()}_${data.audioFile.name}`);
        await uploadBytes(audioRef, data.audioFile);
        audioUrl = await getDownloadURL(audioRef);
      }

      // Create song document
      await addDoc(collection(db, 'songs'), {
        title: data.title,
        lyrics: data.lyrics,
        categoryIds: data.categoryIds,
        audioUrl: audioUrl || null,
        thumbnailUrl: null,
        playCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        metadata: null,
      });

      toast.success('Song created successfully!');
      router.push('/songs');
    } catch (error) {
      console.error('Error creating song:', error);
      toast.error('Failed to create song');
      throw error;
    }
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
          Add New Song
        </h1>

        {/* Form container with proper padding */}
        <div 
          className="rounded-2xl shadow-lg p-10 border-2"
          style={{ background: 'white', borderColor: '#D4AF37' }}
        >
          <SongForm onSubmit={handleSubmit} submitLabel="Create Song" />
        </div>
      </div>
    </div>
  );
}
