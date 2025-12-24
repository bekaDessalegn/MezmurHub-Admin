'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Category } from '@/lib/types';
import Link from 'next/link';
import { Plus, Edit, Trash2, Folder } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const q = query(collection(db, 'categories'), orderBy('order', 'asc'));
      const snapshot = await getDocs(q);
      const categoriesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      })) as Category[];
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this category? Songs using this category will not be deleted but will lose this category assignment.')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'categories', id));
      setCategories(categories.filter(category => category.id !== id));
      toast.success('Category deleted successfully');
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ background: '#FFF8DC' }}>
        <div className="text-center">
          <div
            className="inline-flex rounded-full p-4 mb-4 animate-pulse"
            style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 100%)' }}
          >
            <Folder className="h-8 w-8" style={{ color: '#3E2723' }} />
          </div>
          <div className="text-lg font-semibold" style={{ color: '#3E2723' }}>
            Loading categories...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-light-gold min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2 text-dark">
            Categories
          </h1>
          <div className="flex items-center gap-2">
            <div className="w-16 h-0.5" style={{ background: '#D4AF37' }}></div>
            <span style={{ color: '#D4AF37' }}>✦</span>
          </div>
        </div>
        <Link
          href="/categories/new"
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-primary text-dark shadow-lg border-primary transform hover:scale-105"
        >
          <Plus className="h-5 w-5" />
          Add New Category
        </Link>
      </div>

      {categories.length === 0 ? (
        <div
          className="rounded-2xl p-12 text-center shadow-lg border-2 bg-white border-primary"
        >
          <div
            className="inline-flex rounded-full p-6 mb-4"
            style={{ background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(255, 215, 0, 0.15) 100%)' }}
          >
            <Folder className="h-12 w-12 text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-dark">
            No categories yet
          </h3>
          <p className="mb-6 text-dark" style={{ opacity: 0.7 }}>
            Get started by creating your first category.
          </p>
          <Link
            href="/categories/new"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-primary text-dark shadow-lg border-primary transform hover:scale-105"
          >
            <Plus className="h-5 w-5" />
            Add New Category
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
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: '#3E2723' }}>
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: '#3E2723' }}>
                  Description
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: '#3E2723' }}>
                  Order
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: '#3E2723' }}>
                  Created
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider" style={{ color: '#3E2723' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr
                  key={category.id}
                  className="border-b transition-all"
                  style={{ borderColor: 'rgba(212, 175, 55, 0.2)' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(212, 175, 55, 0.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold" style={{ color: '#3E2723' }}>
                      {category.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm" style={{ color: '#3E2723', opacity: 0.8 }}>
                      {category.description || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className="inline-flex px-3 py-1 text-xs font-bold rounded-full"
                      style={{
                        background: 'rgba(0, 100, 0, 0.15)',
                        color: '#006400',
                        border: '1px solid #006400'
                      }}
                    >
                      {category.order}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#3E2723', opacity: 0.7 }}>
                    {format(category.createdAt, 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/categories/${category.id}/edit`}
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
                        onClick={() => handleDelete(category.id)}
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
