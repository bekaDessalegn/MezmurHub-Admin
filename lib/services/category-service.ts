import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import { Category, CreateCategoryData } from '../types';

const CATEGORIES_COLLECTION = 'categories';

export async function getAllCategories(): Promise<Category[]> {
  const categoriesRef = collection(db, CATEGORIES_COLLECTION);
  const q = query(categoriesRef, orderBy('order', 'asc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      description: data.description,
      iconUrl: data.iconUrl,
      order: data.order || 0,
      createdAt: data.createdAt?.toDate() || new Date(),
    } as Category;
  });
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const categoryRef = doc(db, CATEGORIES_COLLECTION, id);
  const snapshot = await getDoc(categoryRef);

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();
  return {
    id: snapshot.id,
    name: data.name,
    description: data.description,
    iconUrl: data.iconUrl,
    order: data.order || 0,
    createdAt: data.createdAt?.toDate() || new Date(),
  } as Category;
}

export async function createCategory(data: CreateCategoryData): Promise<string> {
  const categoriesRef = collection(db, CATEGORIES_COLLECTION);

  const categoryData = {
    name: data.name,
    description: data.description || null,
    iconUrl: data.iconUrl || null,
    order: data.order || 0,
    createdAt: Timestamp.now(),
  };

  const docRef = await addDoc(categoriesRef, categoryData);
  return docRef.id;
}

export async function updateCategory(
  id: string,
  data: Partial<CreateCategoryData>
): Promise<void> {
  const categoryRef = doc(db, CATEGORIES_COLLECTION, id);
  await updateDoc(categoryRef, data);
}

export async function deleteCategory(id: string): Promise<void> {
  const categoryRef = doc(db, CATEGORIES_COLLECTION, id);
  await deleteDoc(categoryRef);
}

