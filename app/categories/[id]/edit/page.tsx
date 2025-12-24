'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Category } from '@/lib/types';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const [category, setCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    order: 0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  useEffect(() => {
    if (resolvedParams) {
      fetchCategory();
    }
  }, [resolvedParams]);

  async function fetchCategory() {
    if (!resolvedParams) return;

    try {
      const docRef = doc(db, 'categories', resolvedParams.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const categoryData = {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
        } as Category;

        setCategory(categoryData);
        setFormData({
          name: categoryData.name,
          description: categoryData.description || '',
          order: categoryData.order,
        });
      } else {
        toast.error('Category not found');
        router.push('/categories');
      }
    } catch (error) {
      console.error('Error fetching category:', error);
      toast.error('Failed to load category');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!resolvedParams) return;

    if (!formData.name.trim()) {
      toast.error('Please enter a category name');
      return;
    }

    setSaving(true);
    try {
      const docRef = doc(db, 'categories', resolvedParams.id);
      await updateDoc(docRef, {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        order: formData.order,
      });

      toast.success('Category updated successfully!');
      router.push('/categories');
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Failed to update category');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg">Loading category...</div>
      </div>
    );
  }

  if (!category) {
    return null;
  }

  return (
    <div className="p-8 bg-light-gold min-h-screen">
      <div className="mb-6">
        <Link
          href="/categories"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Categories
        </Link>
      </div>

      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold text-dark mb-8">Edit Category</h1>

        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-dark mb-1">
                Category Name *
              </label>
              <input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="e.g., Praise Songs, Fasting Songs"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-dark mb-1">
                Description (Optional)
              </label>
              <textarea
                id="description"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Brief description of this category"
              />
            </div>

            <div>
              <label htmlFor="order" className="block text-sm font-medium text-dark mb-1">
                Display Order
              </label>
              <input
                id="order"
                type="number"
                min="0"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="0"
              />
              <p className="mt-1 text-sm text-gray-500">
                Lower numbers appear first in the list
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Updating...' : 'Update Category'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

