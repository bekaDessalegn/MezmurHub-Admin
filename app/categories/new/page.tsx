'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NewCategoryPage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    order: 0,
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Please enter a category name');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'categories'), {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        iconUrl: null,
        order: formData.order,
        createdAt: serverTimestamp(),
      });

      toast.success('Category created successfully!');
      router.push('/categories');
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('Failed to create category');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8" style={{ background: '#FFF8DC', minHeight: '100vh' }}>
      {/* Back link with spacing */}
      <div className="mb-8">
        <Link
          href="/categories"
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
          Back to Categories
        </Link>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Header with spacing */}
        <h1 className="text-3xl font-bold mb-10" style={{ color: '#3E2723' }}>
          Add New Category
        </h1>

        {/* Form container with proper padding */}
        <div 
          className="rounded-2xl shadow-lg p-10 border-2"
          style={{ background: 'white', borderColor: '#D4AF37' }}
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold mb-3" style={{ color: '#3E2723' }}>
                Category Name *
              </label>
              <input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-xl px-5 py-4 focus:outline-none transition-all border-2"
                style={{ 
                  background: '#FFFDD0',
                  borderColor: '#D4AF37',
                  color: '#3E2723',
                  fontSize: '15px'
                }}
                onFocus={(e) => e.target.style.borderColor = '#8B0000'}
                onBlur={(e) => e.target.style.borderColor = '#D4AF37'}
                placeholder="e.g., Praise Songs, Fasting Songs"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-semibold mb-3" style={{ color: '#3E2723' }}>
                Description (Optional)
              </label>
              <textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full rounded-xl px-5 py-4 focus:outline-none transition-all border-2"
                style={{ 
                  background: '#FFFDD0',
                  borderColor: '#D4AF37',
                  color: '#3E2723',
                  fontSize: '15px'
                }}
                onFocus={(e) => e.target.style.borderColor = '#8B0000'}
                onBlur={(e) => e.target.style.borderColor = '#D4AF37'}
                placeholder="Brief description of this category"
              />
            </div>

            <div>
              <label htmlFor="order" className="block text-sm font-semibold mb-3" style={{ color: '#3E2723' }}>
                Display Order
              </label>
              <input
                id="order"
                type="number"
                min="0"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                className="w-full rounded-xl px-5 py-4 focus:outline-none transition-all border-2"
                style={{ 
                  background: '#FFFDD0',
                  borderColor: '#D4AF37',
                  color: '#3E2723',
                  fontSize: '15px'
                }}
                onFocus={(e) => e.target.style.borderColor = '#8B0000'}
                onBlur={(e) => e.target.style.borderColor = '#D4AF37'}
                placeholder="0"
              />
              <p className="mt-3 text-sm" style={{ color: '#3E2723', opacity: 0.6 }}>
                Lower numbers appear first in the list
              </p>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl px-6 py-5 font-bold text-base transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
                    Creating...
                  </span>
                ) : (
                  'Create Category'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
