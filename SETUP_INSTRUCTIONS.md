# Setup Instructions for MezmurHub Admin Panel

## Step 1: Get Firebase Configuration

1. Open your existing MezmurHub Flutter app's Android configuration:
   - File location: `MezmurHub/android/app/google-services.json`

2. Extract the following values from the file:
   - `project_id`
   - `mobilesdk_app_id`
   - `api_key`
   - `storage_bucket`

3. Create `.env.local` file in the `mezmur-admin` directory:

```bash
cd "/Users/bekachalchisa/Desktop/My Apps/MezmurHub All/mezmur-admin"
touch .env.local
```

4. Add your Firebase configuration to `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=mezmurhub.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=mezmurhub
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=mezmurhub.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=230741992172
NEXT_PUBLIC_FIREBASE_APP_ID=1:230741992172:web:your_web_app_id
```

**Note:** You need to create a Web app in Firebase Console if you haven't already:
- Go to Firebase Console > Project Settings > General
- Scroll to "Your apps" section
- Click "Add app" > Select Web (</>) icon
- Register app with nickname "MezmurHub Admin"
- Copy the configuration values

## Step 2: Install Dependencies

```bash
cd "/Users/bekachalchisa/Desktop/My Apps/MezmurHub All/mezmur-admin"
npm install
```

## Step 3: Create Admin User

You need to create an admin user to access the panel:

### Option A: Using Firebase Console (Easiest)
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your "mezmurhub" project
3. Go to Authentication > Users
4. Click "Add user"
5. Enter email: `admin@mezmurhub.com`
6. Enter password: Choose a secure password
7. Click "Add user"

### Option B: Using Firebase CLI
```bash
firebase auth:users:create admin@mezmurhub.com --password "YourSecurePassword123!"
```

## Step 4: Enable Web Authentication in Firebase

1. Go to Firebase Console > Authentication > Sign-in method
2. Make sure "Email/Password" is enabled
3. Add your domain to authorized domains if deploying:
   - Click "Add domain"
   - Add your deployment domain (e.g., `mezmurhub-admin.vercel.app`)

## Step 5: Update Firestore Security Rules (Already Done)

Your existing Firestore rules already support admin access. The rules check for `request.auth.token.admin == true`.

To set admin custom claims on a user:

### Option A: Using Cloud Function
Create a Cloud Function to set admin claims:

```javascript
// Add to your Cloud Functions
exports.setAdminClaim = functions.https.onCall(async (data, context) => {
  // Only allow specific email to become admin
  if (data.email !== 'admin@mezmurhub.com') {
    throw new functions.https.HttpsError('permission-denied', 'Not authorized');
  }
  
  const user = await admin.auth().getUserByEmail(data.email);
  await admin.auth().setCustomUserClaims(user.uid, { admin: true });
  
  return { message: 'Admin claim set successfully' };
});
```

### Option B: Using Firebase CLI (Recommended for initial setup)
```bash
# Get user UID first
firebase auth:users:list

# Set custom claims (replace USER_UID with actual UID)
firebase auth:users:update USER_UID --custom-claims '{"admin":true}'
```

### Option C: Temporarily Allow All Authenticated Users (For Testing Only)

If you just want to test the admin panel quickly, you can temporarily modify the Firestore rules:

```javascript
// In firestore.rules - TESTING ONLY
function isAdmin() {
  return request.auth != null;  // Any authenticated user
}
```

**Important:** Change this back to the secure version after testing!

## Step 6: Update Storage Rules

Make sure your Firebase Storage rules allow authenticated admins to upload:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /songs/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;  // Or add admin check
    }
  }
}
```

Deploy the rules:
```bash
firebase deploy --only storage
```

## Step 7: Run the Admin Panel

```bash
npm run dev
```

The admin panel will be available at: http://localhost:3000

## Step 8: Login

1. Navigate to http://localhost:3000
2. You'll be redirected to the login page
3. Enter your admin credentials:
   - Email: `admin@mezmurhub.com`
   - Password: Your chosen password

4. Click "Sign In"

## Step 9: Test the Features

1. **Dashboard**: View statistics about songs and categories
2. **Add Category**: Create a few categories (e.g., "Praise Songs", "Fasting Songs", "Easter Songs")
3. **Add Song**: Create a test song with lyrics and optionally upload audio
4. **Edit/Delete**: Test editing and deleting songs and categories

## Troubleshooting

### "Failed to sign in" Error
- Check that your `.env.local` file has correct Firebase configuration
- Verify the user exists in Firebase Console > Authentication
- Make sure Email/Password sign-in is enabled

### "Permission denied" When Creating Songs
- Check Firestore rules are deployed
- Verify admin custom claims are set on your user
- Or temporarily use the test version of rules (any authenticated user)

### Audio Upload Fails
- Check Firebase Storage rules allow writes
- Verify file size is under 50MB
- Ensure file format is MP3, WAV, or AAC

### Cannot Access Dashboard
- Clear browser cache and cookies
- Check browser console for errors
- Verify authentication is working

## Production Deployment

### Deploy to Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Add environment variables in Vercel dashboard:
   - Go to Project Settings > Environment Variables
   - Add all `NEXT_PUBLIC_*` variables from `.env.local`

4. Redeploy:
```bash
vercel --prod
```

### Deploy to Firebase Hosting

1. Build the app:
```bash
npm run build
```

2. Configure Firebase hosting:
```bash
firebase init hosting
```

3. Deploy:
```bash
firebase deploy --only hosting
```

## Security Checklist

- [ ] Created strong admin password
- [ ] Set admin custom claims on admin users only
- [ ] Verified Firestore rules check for admin token
- [ ] Updated Storage rules to allow admin uploads only
- [ ] Added authorized domains in Firebase Console
- [ ] Enabled App Check for additional security (optional)
- [ ] Set up environment variables securely
- [ ] Never commit `.env.local` to version control

## Next Steps

1. Create additional admin users as needed
2. Set up backup strategies for Firestore data
3. Configure monitoring and alerts
4. Set up staging environment for testing
5. Document your workflow for adding songs

## Support

If you encounter any issues:
1. Check the browser console for errors
2. Review Firebase Console logs
3. Verify all configuration values
4. Test with Firebase Authentication emulator locally

For additional help, refer to:
- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)

