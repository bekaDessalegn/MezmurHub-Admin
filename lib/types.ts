export interface Song {
  id: string;
  title: string;
  lyrics: string;
  categoryIds: string[];
  audioUrl?: string;
  thumbnailUrl?: string;
  playCount: number;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, unknown>;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  iconUrl?: string;
  order: number;
  createdAt: Date;
}

export interface SongFormData {
  title: string;
  lyrics: string;
  categoryIds: string[];
  audioFile?: File | null;
  audioUrl?: string;
  imageFile?: File | null;
  imageUrl?: string | null;
}

export interface CreateSongData {
  title: string;
  lyrics: string;
  categoryIds: string[];
  audioUrl?: string | null;
  thumbnailUrl?: string | null;
}

export interface UpdateSongData {
  title?: string;
  lyrics?: string;
  categoryIds?: string[];
  audioUrl?: string | null;
  thumbnailUrl?: string | null;
  playCount?: number;
  metadata?: Record<string, unknown>;
}

export interface CreateCategoryData {
  name: string;
  description?: string;
  iconUrl?: string;
  order?: number;
}

export interface UpdateCategoryData {
  name?: string;
  description?: string;
  iconUrl?: string;
  order?: number;
}
