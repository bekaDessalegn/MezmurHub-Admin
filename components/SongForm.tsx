'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Category, SongFormData } from '@/lib/types';
import RichTextEditor from './RichTextEditor';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface SongFormProps {
  initialData?: Partial<SongFormData>;
  onSubmit: (data: SongFormData) => Promise<void>;
  submitLabel: string;
}

export default function SongForm({ initialData, onSubmit, submitLabel }: SongFormProps) {
  const [formData, setFormData] = useState<SongFormData>({
    title: initialData?.title || '',
    lyrics: initialData?.lyrics || '',
    categoryIds: initialData?.categoryIds || [],
    audioUrl: initialData?.audioUrl,
    imageUrl: initialData?.imageUrl,
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const snapshot = await getDocs(collection(db, 'categories'));
      const categoriesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      })) as Category[];
      setCategories(categoriesData.sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }

  function handleCategoryToggle(categoryId: string) {
    setFormData(prev => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter(id => id !== categoryId)
        : [...prev.categoryIds, categoryId],
    }));
  }

  function handleAudioChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['audio/mpeg', 'audio/wav', 'audio/aac', 'audio/mp3'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a valid audio file (MP3, WAV, or AAC)');
        return;
      }
      
      // Validate file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        alert('File size must be less than 50MB');
        return;
      }
      
      setAudioFile(file);
    }
  }

  function removeAudioFile() {
    setAudioFile(null);
    setFormData(prev => ({ ...prev, audioUrl: undefined }));
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a valid image file (JPEG, PNG, or WebP)');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }
      
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  function removeImageFile() {
    setImageFile(null);
    setImagePreview(null);
    setFormData(prev => ({ ...prev, imageUrl: null }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Please enter a song title');
      return;
    }
    
    if (!formData.lyrics.trim()) {
      alert('Please enter song lyrics');
      return;
    }
    
    if (formData.categoryIds.length === 0) {
      alert('Please select at least one category');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        ...formData,
        audioFile,
        imageFile,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-semibold mb-2" style={{ color: '#3E2723' }}>
          Song Title *
        </label>
        <input
          id="title"
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full rounded-xl px-4 py-3 focus:outline-none transition-all border-2"
          style={{ 
            background: '#FFFDD0',
            borderColor: '#D4AF37',
            color: '#3E2723',
            fontSize: '15px'
          }}
          onFocus={(e) => e.target.style.borderColor = '#8B0000'}
          onBlur={(e) => e.target.style.borderColor = '#D4AF37'}
          placeholder="Enter song title"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2" style={{ color: '#3E2723' }}>
          Lyrics *
        </label>
        <RichTextEditor
          content={formData.lyrics}
          onChange={(content) => setFormData({ ...formData, lyrics: content })}
        />
        <p className="mt-2 text-sm" style={{ color: '#3E2723', opacity: 0.6 }}>
          Use the formatting toolbar to add bold, italic, verses, and chorus sections.
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-3" style={{ color: '#3E2723' }}>
          Categories * (Select at least one)
        </label>
        {categories.length === 0 ? (
          <p className="text-sm" style={{ color: '#8B0000' }}>
            No categories available. Please create categories first.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map((category) => (
              <label
                key={category.id}
                className="flex items-center space-x-2 cursor-pointer p-3 rounded-xl border-2 transition-all"
                style={{
                  background: formData.categoryIds.includes(category.id) 
                    ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(255, 215, 0, 0.15) 100%)'
                    : 'white',
                  borderColor: formData.categoryIds.includes(category.id) ? '#D4AF37' : '#FFFDD0',
                }}
              >
                <input
                  type="checkbox"
                  checked={formData.categoryIds.includes(category.id)}
                  onChange={() => handleCategoryToggle(category.id)}
                  className="rounded"
                  style={{ accentColor: '#D4AF37' }}
                />
                <span className="text-sm font-medium" style={{ color: '#3E2723' }}>
                  {category.name}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2" style={{ color: '#3E2723' }}>
          Song Image (Optional)
        </label>
        
        {!imageFile && !imagePreview ? (
          <div 
            className="border-2 border-dashed rounded-2xl p-8 transition-all hover:border-solid"
            style={{ borderColor: '#D4AF37', background: 'rgba(212, 175, 55, 0.05)' }}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="flex flex-col items-center cursor-pointer"
            >
              <div 
                className="rounded-full p-4 mb-3"
                style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 100%)' }}
              >
                <ImageIcon className="h-8 w-8" style={{ color: '#3E2723' }} />
              </div>
              <span className="text-sm font-semibold" style={{ color: '#3E2723' }}>
                Click to upload image
              </span>
              <span className="text-xs mt-1" style={{ color: '#3E2723', opacity: 0.6 }}>
                JPEG, PNG, or WebP (Max 5MB)
              </span>
            </label>
          </div>
        ) : (
          <div 
            className="rounded-xl p-4 border-2"
            style={{ background: '#FFFDD0', borderColor: '#D4AF37' }}
          >
            <div className="flex items-center gap-4">
              {imagePreview && (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Song preview"
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div 
                    className="rounded-full p-2"
                    style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 100%)' }}
                  >
                    <ImageIcon className="h-5 w-5" style={{ color: '#3E2723' }} />
                  </div>
                  <span className="text-sm font-medium" style={{ color: '#3E2723' }}>
                    {imageFile?.name || 'Existing image'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={removeImageFile}
                  className="text-xs px-3 py-1 rounded-lg transition-all"
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
                  Remove Image
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2" style={{ color: '#3E2723' }}>
          Audio File (Optional)
        </label>
        
        {!audioFile && !formData.audioUrl ? (
          <div 
            className="border-2 border-dashed rounded-2xl p-8 transition-all hover:border-solid"
            style={{ borderColor: '#D4AF37', background: 'rgba(212, 175, 55, 0.05)' }}
          >
            <input
              type="file"
              accept="audio/*"
              onChange={handleAudioChange}
              className="hidden"
              id="audio-upload"
            />
            <label
              htmlFor="audio-upload"
              className="flex flex-col items-center cursor-pointer"
            >
              <div 
                className="rounded-full p-4 mb-3"
                style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 100%)' }}
              >
                <Upload className="h-8 w-8" style={{ color: '#3E2723' }} />
              </div>
              <span className="text-sm font-semibold" style={{ color: '#3E2723' }}>
                Click to upload audio
              </span>
              <span className="text-xs mt-1" style={{ color: '#3E2723', opacity: 0.6 }}>
                MP3, WAV, or AAC (Max 50MB)
              </span>
            </label>
          </div>
        ) : (
          <div 
            className="flex items-center justify-between rounded-xl p-4 border-2"
            style={{ background: '#FFFDD0', borderColor: '#D4AF37' }}
          >
            <div className="flex items-center gap-3">
              <div 
                className="rounded-full p-2"
                style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 100%)' }}
              >
                <Upload className="h-5 w-5" style={{ color: '#3E2723' }} />
              </div>
              <span className="text-sm font-medium" style={{ color: '#3E2723' }}>
                {audioFile?.name || 'Existing audio file'}
              </span>
            </div>
            <button
              type="button"
              onClick={removeAudioFile}
              className="rounded-lg p-2 transition-all"
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
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      <div className="flex gap-4 pt-6">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 rounded-xl px-6 py-4 font-bold text-base transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
              Saving...
            </span>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  );
}

