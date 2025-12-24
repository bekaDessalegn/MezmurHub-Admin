# MezmurHub Admin Panel - Setup Guide

## Step 1: Install Dependencies

```bash
cd mezmur-admin
npm install
```

## Step 2: Configure Firebase

1. Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

2. Add your Firebase configuration to `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDN2S5KFHQZidp-bHa2cfqsvpYgKBjWR3U
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=mezmurhub.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=mezmurhub
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=mezmurhub.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=230741992172
NEXT_PUBLIC_FIREBASE_APP_ID=1:230741992172:android:cbb39da5ea2c2dfceebbc9
```

## Step 3: Set Up Admin User

You need to grant admin access to your user account. There are two ways to do this:

### Option A: Using Firebase Admin SDK (Recommended)

1. Download your Firebase service account key:
   - Go to Firebase Console > Project Settings > Service Accounts
   - Click "Generate New Private Key"
   - Save the JSON file securely

2. Set the environment variable:
```bash
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/serviceAccountKey.json"
```

3. Install firebase-admin (if not already):
```bash
npm install -D firebase-admin
```

4. Run the script with your admin email:
```bash
node scripts/set-admin.js your-email@example.com
```

### Option B: Using Firebase Console with Cloud Function

Create a Cloud Function to set admin claims:

```javascript
// Add this to your cloud_functions/functions/index.js
exports.setAdminClaim = functions.https.onCall(async (data, context) => {
  // Check if requester is already an admin
  if (context.auth.token.admin !== true) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only admins can set admin claims.'
    );
  }

  const email = data.email;
  const user = await admin.auth().getUserByEmail(email);
  
  await admin.auth().setCustomUserClaims(user.uid, { admin: true });
  
  return { message: `Admin claim set for ${email}` };
});
```

### Option C: Manual Setup via Firebase CLI

```bash
# Install Firebase CLI if not already
npm install -g firebase-tools

# Login to Firebase
firebase login

# Open Firebase Console in browser
firebase open auth

# Manually add custom claim through Firebase Console
```

## Step 4: Update Firestore Security Rules

Ensure your Firestore rules are properly set (they should already be in your Flutter app):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() {
      return request.auth != null && 
             request.auth.token.admin == true;
    }
    
    match /songs/{songId} {
      allow read: if true;
      allow create, update, delete: if isAdmin();
    }
    
    match /categories/{categoryId} {
      allow read: if true;
      allow create, update, delete: if isAdmin();
    }
  }
}
```

## Step 5: Update Storage Rules

Ensure your Firebase Storage rules allow admin uploads:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    function isAdmin() {
      return request.auth != null && 
             request.auth.token.admin == true;
    }
    
    match /songs/{allPaths=**} {
      allow read: if true;
      allow write: if isAdmin();
    }
  }
}
```

## Step 6: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 7: First Login

1. Navigate to the login page
2. Sign in with your admin email and password
3. If you set up the admin claim correctly, you'll be redirected to the dashboard

## Troubleshooting

### "Permission Denied" Error

- Make sure the user has the admin custom claim set
- The user must sign out and sign in again after setting the claim
- Check Firestore rules are properly configured

### Firebase Configuration Errors

- Verify all environment variables in `.env.local` are correct
- Ensure the Firebase project ID matches your Flutter app
- Check that the Firebase app is registered in your project

### Upload Issues

- Verify Storage rules allow admin uploads
- Check the storage bucket name in your configuration
- Ensure your Firebase project has Storage enabled

### Build Errors

```bash
# Clear cache and rebuild
rm -rf .next
rm -rf node_modules
npm install
npm run dev
```

## Production Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add all environment variables from `.env.local`
4. Deploy

### Deploy to Other Platforms

The app can be deployed to any Node.js hosting:

```bash
npm run build
npm start
```

## Next Steps

1. Create your first category
2. Add your first song with lyrics and audio
3. Test the mobile app to see the changes
4. Set up push notifications by ensuring Cloud Functions are deployed

## Security Checklist

- [ ] `.env.local` is in `.gitignore`
- [ ] Admin claims are set for authorized users only
- [ ] Firestore rules restrict write access to admins
- [ ] Storage rules restrict uploads to admins
- [ ] Service account keys are stored securely
- [ ] Production environment variables are set in hosting platform

## Support

For additional help, refer to:
- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

