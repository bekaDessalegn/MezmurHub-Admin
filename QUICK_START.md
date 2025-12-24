# Quick Start Guide

## Prerequisites Checklist
- [ ] Node.js 18+ installed
- [ ] Firebase project exists (mezmurhub)
- [ ] Firebase Authentication enabled
- [ ] Firestore Database configured
- [ ] Firebase Storage enabled

## Quick Setup (5 minutes)

### 1. Get Firebase Web Config
```bash
# Go to Firebase Console → Project Settings → General → Your apps
# Click "Add app" → Web → Register app as "MezmurHub Admin"
# Copy the config values
```

### 2. Create Environment File
```bash
cd "/Users/bekachalchisa/Desktop/My Apps/MezmurHub All/mezmur-admin"

# Create .env.local with your Firebase config
cat > .env.local << 'EOF'
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=mezmurhub.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=mezmurhub
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=mezmurhub.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=230741992172
NEXT_PUBLIC_FIREBASE_APP_ID=your_web_app_id
EOF

# Edit the file with your actual values
nano .env.local
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Create Admin User

**Option A: Firebase Console**
1. Go to Firebase Console → Authentication → Users
2. Click "Add user"
3. Email: `admin@mezmurhub.com`
4. Password: (choose secure password)

**Option B: Firebase CLI**
```bash
firebase auth:users:create admin@mezmurhub.com --password "SecurePassword123!"
```

### 5. Set Admin Permissions

**Get User UID:**
```bash
firebase auth:users:list
# Copy the UID of admin@mezmurhub.com
```

**Set Admin Custom Claims:**
```bash
firebase auth:users:update [USER_UID] --custom-claims '{"admin":true}'
```

### 6. Start Development Server
```bash
npm run dev
```

### 7. Access Admin Panel
Open http://localhost:3000 and login with:
- Email: `admin@mezmurhub.com`
- Password: (your chosen password)

## Essential Commands

```bash
# Development
npm run dev          # Start dev server at localhost:3000
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run linter

# Firebase
firebase login                    # Login to Firebase
firebase projects:list           # List projects
firebase auth:users:list         # List users
firebase deploy --only firestore # Deploy Firestore rules
firebase deploy --only storage   # Deploy Storage rules
firebase deploy --only functions # Deploy Cloud Functions

# Deployment
vercel                # Deploy to Vercel
vercel --prod        # Deploy to production
```

## Testing Checklist

After setup, test these features:

1. **Authentication**
   - [ ] Login works
   - [ ] Redirect to dashboard after login
   - [ ] Logout works

2. **Categories**
   - [ ] Create new category
   - [ ] View categories list
   - [ ] Edit category
   - [ ] Delete category

3. **Songs**
   - [ ] Create song with lyrics only
   - [ ] Create song with audio file
   - [ ] View songs list
   - [ ] Edit song
   - [ ] Update audio file
   - [ ] Delete song

4. **Dashboard**
   - [ ] View statistics
   - [ ] Quick action links work

## Common Issues & Quick Fixes

### Issue: "Failed to sign in"
```bash
# Check Firebase config
cat .env.local

# Verify user exists
firebase auth:users:list
```

### Issue: "Permission denied" creating songs
```bash
# Check if admin claim is set
firebase auth:users:list

# Set admin claim
firebase auth:users:update [USER_UID] --custom-claims '{"admin":true}'
```

### Issue: Cannot upload audio
```bash
# Deploy storage rules
firebase deploy --only storage

# Check storage rules allow authenticated writes
```

### Issue: Build errors
```bash
# Clear cache and rebuild
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

## Project Structure
```
mezmur-admin/
├── app/                    # Pages
│   ├── dashboard/         # Dashboard
│   ├── songs/             # Songs CRUD
│   ├── categories/        # Categories CRUD
│   └── login/             # Login page
├── components/            # UI components
├── contexts/              # React contexts
├── lib/                   # Utils & config
└── .env.local            # Firebase config (you create this)
```

## What's Included

✅ **Authentication System**
- Login page with email/password
- Protected routes with middleware
- Auth context for user state

✅ **Song Management**
- Create/edit/delete songs
- Rich text editor for lyrics
- Audio file upload (MP3, WAV, AAC)
- Category assignment
- Search and filter

✅ **Category Management**
- Create/edit/delete categories
- Display order management
- Description support

✅ **Dashboard**
- Total songs count
- Total categories count
- New songs this week
- Quick action links

✅ **UI/UX**
- Clean, modern design
- Responsive layout
- Sidebar navigation
- Toast notifications
- Loading states
- Confirmation dialogs

## Firebase Integration

The admin panel uses:
- **Firebase Auth**: Admin authentication
- **Firestore**: Songs and categories storage
- **Storage**: Audio file storage
- **Cloud Functions**: Push notifications (already deployed)

## Next Steps

1. ✅ Complete setup above
2. 🎵 Create a few categories
3. 🎤 Add your first song
4. 📱 Test notifications on mobile app
5. 🚀 Deploy to production

## Need Help?

1. Check `SETUP_INSTRUCTIONS.md` for detailed setup
2. Read `README.md` for full documentation
3. Review Firebase Console for errors
4. Check browser console for client errors

## Production Deployment

**Vercel (Recommended):**
```bash
vercel login
vercel
# Add environment variables in Vercel dashboard
vercel --prod
```

**Firebase Hosting:**
```bash
npm run build
firebase deploy --only hosting
```

---

**Time to complete:** ~5-10 minutes
**Difficulty:** Easy
**Prerequisites:** Firebase project, Node.js installed

Happy managing! 🎵

