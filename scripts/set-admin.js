/**
 * Script to set admin custom claims for a user
 * 
 * Usage:
 * 1. Install firebase-admin if not already: npm install firebase-admin
 * 2. Download your service account key from Firebase Console
 * 3. Set environment variable: export GOOGLE_APPLICATION_CREDENTIALS="path/to/serviceAccountKey.json"
 * 4. Run: node scripts/set-admin.js USER_EMAIL
 */

const admin = require('firebase-admin');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

async function setAdminClaim(email) {
  try {
    // Get user by email
    const user = await admin.auth().getUserByEmail(email);
    
    // Set custom claim
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    
    console.log(`✅ Successfully set admin claim for user: ${email}`);
    console.log(`User UID: ${user.uid}`);
    console.log('\nThe user needs to sign out and sign in again for the changes to take effect.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting admin claim:', error.message);
    process.exit(1);
  }
}

// Get email from command line arguments
const email = process.argv[2];

if (!email) {
  console.error('❌ Please provide a user email as an argument');
  console.log('Usage: node scripts/set-admin.js USER_EMAIL');
  process.exit(1);
}

setAdminClaim(email);

