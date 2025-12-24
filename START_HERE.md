# 🚀 START HERE - MezmurHub Admin Panel

## ⚡ Quick Start (Copy & Paste Commands)

### Step 1: Navigate to Project
```bash
cd "/Users/bekachalchisa/Desktop/My Apps/MezmurHub All/mezmur-admin"
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Firebase

You need to create a `.env.local` file with your Firebase configuration.

**Option A: Use your existing Flutter app's Firebase config**

Your Firebase project ID is: `mezmurhub`

1. Get your Firebase Web App credentials:
   - Go to: https://console.firebase.google.com/project/mezmurhub/settings/general
   - Under "Your apps", if no Web app exists, click "Add app" → Web (</>) icon
   - Register app as "MezmurHub Admin"
   - Copy the config values

2. Create `.env.local` file:
```bash
cat > .env.local << 'EOF'
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=mezmurhub.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=mezmurhub
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=mezmurhub.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=230741992172
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
EOF
```

3. Edit the file with your actual values:
```bash
nano .env.local
# Or use any text editor
# Replace the placeholder values with your Firebase config
# Press Ctrl+X, then Y, then Enter to save
```

### Step 4: Create Admin User

**Using Firebase Console (Easiest):**
1. Go to: https://console.firebase.google.com/project/mezmurhub/authentication/users
2. Click "Add user"
3. Email: `admin@mezmurhub.com`
4. Password: Choose a strong password
5. Click "Add user"

**Or using Firebase CLI:**
```bash
firebase login
firebase auth:users:create admin@mezmurhub.com --password "YourSecurePassword123!"
```

### Step 5: Set Admin Permissions

**Important:** You need to set admin custom claims on your user.

```bash
# First, get the user's UID
firebase auth:users:list

# Copy the UID of admin@mezmurhub.com
# Then set admin custom claims (replace USER_UID with actual UID)
firebase auth:users:update USER_UID --custom-claims '{"admin":true}'
```

**Quick Alternative for Testing:**
Temporarily modify your Firestore rules to allow any authenticated user:
```javascript
// In MezmurHub/firestore.rules - FOR TESTING ONLY
function isAdmin() {
  return request.auth != null;  // Any authenticated user
}
```
Then deploy:
```bash
cd "/Users/bekachalchisa/Desktop/My Apps/MezmurHub All/MezmurHub"
firebase deploy --only firestore
```
**Remember to change this back after testing!**

### Step 6: Start the Admin Panel
```bash
cd "/Users/bekachalchisa/Desktop/My Apps/MezmurHub All/mezmur-admin"
npm run dev
```

### Step 7: Access Admin Panel
Open your browser and go to: http://localhost:3000

Login with:
- Email: `admin@mezmurhub.com`
- Password: (the password you created)

## ✅ Success Checklist

After completing the steps above, you should be able to:
- [ ] See the login page at http://localhost:3000
- [ ] Login successfully with your admin credentials
- [ ] See the dashboard with statistics
- [ ] Navigate to Songs and Categories pages
- [ ] Create a new category
- [ ] Create a new song with lyrics
- [ ] Upload an audio file
- [ ] Edit and delete songs/categories

## 🐛 Troubleshooting

### Can't install dependencies?
```bash
# Clear npm cache and try again
npm cache clean --force
npm install
```

### "Failed to sign in" error?
1. Check your `.env.local` file has correct values
2. Verify the admin user exists in Firebase Console
3. Make sure Email/Password sign-in is enabled in Firebase Console

### "Permission denied" when creating songs?
1. Make sure you set admin custom claims: `firebase auth:users:update USER_UID --custom-claims '{"admin":true}'`
2. Or use the temporary testing workaround above

### Port 3000 already in use?
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

### Firebase CLI not installed?
```bash
npm install -g firebase-tools
firebase login
```

## 📚 Documentation Files

- **START_HERE.md** - This file (quick start)
- **QUICK_START.md** - Condensed setup guide
- **SETUP_INSTRUCTIONS.md** - Detailed setup instructions
- **README.md** - Complete project documentation
- **PROJECT_SUMMARY.md** - What was built and technical details

## 🎯 What to Do After Setup

1. **Create Categories** (e.g.):
   - Praise Songs
   - Fasting Songs
   - Easter Songs
   - Christmas Songs
   - Wedding Songs
   
2. **Add Songs**:
   - Create songs with formatted lyrics
   - Upload audio files
   - Assign to categories
   
3. **Test Mobile App**:
   - Check if songs appear in your Flutter app
   - Test audio playback
   - Verify push notifications work

4. **Deploy to Production**:
   - Choose Vercel or Firebase Hosting
   - Set up environment variables
   - Deploy and test

## 📞 Need Help?

1. **Check browser console** (F12 → Console tab)
2. **Check Firebase Console** for errors
3. **Review the documentation files** above
4. **Verify all steps were completed**

## 🎊 You're All Set!

Once you complete these steps, you'll have a fully functional admin panel for managing your Ethiopian Orthodox Mezmur songs!

---

**Time Required:** 10-15 minutes
**Difficulty:** Easy
**Result:** Professional admin panel ready to use! 🎵

Happy managing your mezmur collection! 🙏

