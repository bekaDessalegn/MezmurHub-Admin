'use client';

import { useState, useRef } from 'react';
import { Upload, X, Music } from 'lucide-react';

interface AudioUploadProps {
  onFileSelect: (file: File | null) => void;
  currentAudioUrl?: string;
}

export default function AudioUpload({ onFileSelect, currentAudioUrl }: AudioUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentAudioUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/aac'];
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid audio file (MP3, WAV, AAC)');
        return;
      }

      // Validate file size (max 50MB)
      const maxSize = 50 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('File size must be less than 50MB');
        return;
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      onFileSelect(file);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Audio File (Optional)
      </label>

      {!previewUrl ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 transition-colors hover:border-gray-400 hover:bg-gray-100"
        >
          <Upload className="h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            Click to upload audio file
          </p>
          <p className="mt-1 text-xs text-gray-500">
            MP3, WAV, or AAC (max 50MB)
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-gray-300 bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Music className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {selectedFile?.name || 'Current audio file'}
                </p>
                {selectedFile && (
                  <p className="text-xs text-gray-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          {previewUrl && (
            <audio controls className="mt-4 w-full">
              <source src={previewUrl} />
              Your browser does not support the audio element.
            </audio>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="audio/mpeg,audio/mp3,audio/wav,audio/aac"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}

