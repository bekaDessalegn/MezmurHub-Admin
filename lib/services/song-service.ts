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
  where,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase';
import { Song, CreateSongData, UpdateSongData } from '../types';

const SONGS_COLLECTION = 'songs';

export async function getAllSongs(): Promise<Song[]> {
  const songsRef = collection(db, SONGS_COLLECTION);
  const q = query(songsRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title,
      lyrics: data.lyrics,
      categoryIds: data.categoryIds || [],
      audioUrl: data.audioUrl,
      thumbnailUrl: data.thumbnailUrl,
      playCount: data.playCount || 0,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      metadata: data.metadata,
    } as Song;
  });
}

export async function getSongById(id: string): Promise<Song | null> {
  const songRef = doc(db, SONGS_COLLECTION, id);
  const snapshot = await getDoc(songRef);

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();
  return {
    id: snapshot.id,
    title: data.title,
    lyrics: data.lyrics,
    categoryIds: data.categoryIds || [],
    audioUrl: data.audioUrl,
    thumbnailUrl: data.thumbnailUrl,
    playCount: data.playCount || 0,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
    metadata: data.metadata,
  } as Song;
}

export async function createSong(data: CreateSongData): Promise<string> {
  const songsRef = collection(db, SONGS_COLLECTION);
  const now = Timestamp.now();

  const songData = {
    title: data.title,
    lyrics: data.lyrics,
    categoryIds: data.categoryIds,
    audioUrl: data.audioUrl || null,
    thumbnailUrl: data.thumbnailUrl || null,
    playCount: 0,
    createdAt: now,
    updatedAt: now,
    metadata: {},
  };

  const docRef = await addDoc(songsRef, songData);
  return docRef.id;
}

export async function updateSong(id: string, data: UpdateSongData): Promise<void> {
  const songRef = doc(db, SONGS_COLLECTION, id);
  const updateData = {
    ...data,
    updatedAt: Timestamp.now(),
  };

  await updateDoc(songRef, updateData);
}

export async function deleteSong(id: string): Promise<void> {
  const song = await getSongById(id);
  
  // Delete audio file if exists
  if (song?.audioUrl) {
    try {
      const audioRef = ref(storage, song.audioUrl);
      await deleteObject(audioRef);
    } catch (error) {
      console.error('Error deleting audio file:', error);
    }
  }

  // Delete image file if exists
  if (song?.thumbnailUrl) {
    try {
      const imageRef = ref(storage, song.thumbnailUrl);
      await deleteObject(imageRef);
    } catch (error) {
      console.error('Error deleting image file:', error);
    }
  }

  // Delete song document
  const songRef = doc(db, SONGS_COLLECTION, id);
  await deleteDoc(songRef);
}

export async function uploadAudioFile(file: File, songTitle: string): Promise<string> {
  const timestamp = Date.now();
  const fileName = `songs/${timestamp}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
  const storageRef = ref(storage, fileName);

  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);

  return downloadURL;
}

export async function uploadImageFile(file: File): Promise<string> {
  const timestamp = Date.now();
  const fileName = `song-images/${timestamp}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
  const storageRef = ref(storage, fileName);

  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);

  return downloadURL;
}

export async function getSongsByCategory(categoryId: string): Promise<Song[]> {
  const songsRef = collection(db, SONGS_COLLECTION);
  const q = query(
    songsRef,
    where('categoryIds', 'array-contains', categoryId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title,
      lyrics: data.lyrics,
      categoryIds: data.categoryIds || [],
      audioUrl: data.audioUrl,
      thumbnailUrl: data.thumbnailUrl,
      playCount: data.playCount || 0,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      metadata: data.metadata,
    } as Song;
  });
}

