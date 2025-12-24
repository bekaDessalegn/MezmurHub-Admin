# MezmurHub Admin Panel

A modern, web-based admin panel for managing Ethiopian Orthodox Mezmur songs. Built with Next.js, Firebase, and Tailwind CSS.

## Features

- 🔐 **Secure Authentication** - Admin-only access with Firebase Authentication
- 🎵 **Song Management** - Create, edit, and delete songs with lyrics and audio
- 📁 **Category Management** - Organize songs with dynamic categories
- ✍️ **Rich Text Editor** - Format lyrics with bold, italic, verses, and chorus
- 🎧 **Audio Upload** - Upload and manage audio files (MP3, WAV, AAC)
- 📊 **Dashboard** - Overview of songs, categories, and recent activity
- 📱 **Push Notifications** - Automatic notifications when new songs are added

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Authentication:** Firebase Auth
- **Database:** Firebase Firestore
- **Storage:** Firebase Storage
- **Rich Text:** Tiptap Editor
- **Icons:** Lucide React

## Prerequisites

- Node.js 18+ and npm
- Firebase project with the following services enabled:
  - Authentication (Email/Password)
  - Firestore Database
  - Firebase Storage
  - Cloud Functions (for push notifications)

## Getting Started

### 1. Clone and Install

```bash
cd mezmur-admin
npm install
```

### 2. Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (mezmurhub)
3. Go to Project Settings > General > Your apps
4. Copy your web app's Firebase configuration
5. Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
NEXT_PUBLIC_FIREBASE_PROJECT_ID=mezmurhub
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
```

### 3. Set Up Admin User

You need to create an admin user in Firebase:

```bash
# Using Firebase CLI
firebase auth:users:create admin@mezmurhub.com --password "your-secure-password"
```

Or create a user through the Firebase Console > Authentication > Users > Add user

### 4. Set Admin Custom Claims (Optional but Recommended)

To enable admin-only access, set custom claims on your admin user:

```javascript
// Using Firebase Admin SDK or Cloud Functions
admin.auth().setCustomUserClaims(uid, { admin: true });
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and sign in with your admin credentials.

## Project Structure

```
mezmur-admin/
├── app/                    # Next.js app router pages
│   ├── dashboard/         # Dashboard page
│   ├── songs/             # Song management pages
│   ├── categories/        # Category management pages
│   ├── login/             # Login page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page (redirects to dashboard)
├── components/            # Reusable components
│   ├── Sidebar.tsx        # Navigation sidebar
│   ├── RichTextEditor.tsx # Lyrics editor
│   └── SongForm.tsx       # Song form component
├── contexts/              # React contexts
│   └── AuthContext.tsx    # Authentication context
├── lib/                   # Utilities and configurations
│   ├── firebase.ts        # Firebase initialization
│   └── types.ts           # TypeScript types
├── middleware.ts          # Route protection
└── .env.local            # Environment variables (create this)
```

## Data Models

### Song
```typescript
{
  id: string;
  title: string;
  lyrics: string;              // HTML formatted text
  categoryIds: string[];
  audioUrl?: string;
  thumbnailUrl?: string;
  playCount: number;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}
```

### Category
```typescript
{
  id: string;
  name: string;
  description?: string;
  iconUrl?: string;
  order: number;
  createdAt: Date;
}
```

## Features Guide

### Song Management

1. **Create Song**
   - Navigate to Songs > Add New Song
   - Enter song title (required)
   - Add formatted lyrics using the rich text editor (required)
   - Select one or more categories (required)
   - Optionally upload an audio file (MP3, WAV, or AAC, max 50MB)
   - Click "Create Song"

2. **Edit Song**
   - Click the edit icon next to any song
   - Update fields as needed
   - Upload a new audio file to replace the existing one
   - Click "Update Song"

3. **Delete Song**
   - Click the trash icon next to any song
   - Confirm deletion

### Category Management

1. **Create Category**
   - Navigate to Categories > Add New Category
   - Enter category name (required)
   - Add optional description
   - Set display order (lower numbers appear first)
   - Click "Create Category"

2. **Edit Category**
   - Click the edit icon next to any category
   - Update fields as needed
   - Click "Update Category"

3. **Delete Category**
   - Click the trash icon next to any category
   - Confirm deletion (songs will not be deleted)

## Push Notifications

The Cloud Functions deployed with your Firebase project automatically send push notifications when new songs are added. Users who subscribe to the "new_songs" topic in the mobile app will receive these notifications.

## Security

- Only authenticated users can access the admin panel
- Firestore security rules enforce admin-only write access
- Admin routes are protected by middleware
- File uploads are validated for type and size

## Firestore Security Rules

The admin panel works with the existing Firestore rules in your Flutter app:

```javascript
// Songs Collection - Public read, admin write
match /songs/{songId} {
  allow read: if true;
  allow create, update, delete: if isAdmin();
}

// Categories Collection - Public read, admin write
match /categories/{categoryId} {
  allow read: if true;
  allow create, update, delete: if isAdmin();
}
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel project settings
4. Deploy

### Deploy to Firebase Hosting

```bash
npm run build
firebase deploy --only hosting
```

## Troubleshooting

### Authentication Issues
- Ensure Firebase Auth is enabled in your project
- Check that email/password sign-in is enabled
- Verify environment variables are correct

### Upload Issues
- Check Firebase Storage rules allow authenticated writes
- Verify file size is under 50MB
- Ensure file format is MP3, WAV, or AAC

### Build Errors
- Clear `.next` folder and rebuild: `rm -rf .next && npm run build`
- Update dependencies: `npm update`

## Support

For issues or questions, please refer to:
- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## License

This project is part of the MezmurHub app ecosystem.
