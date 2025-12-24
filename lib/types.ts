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
  metadata?: Record<string, any>;
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
}
