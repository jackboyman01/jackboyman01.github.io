# 🔥 Firebase Setup Guide for Guest Book

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `jacksoundworks-guestbook` (or your preferred name)
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Firestore Database

1. In your Firebase project, click "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (for now - we'll secure it later)
4. Select a location close to your users (e.g., `us-central1`)
5. Click "Done"

## Step 3: Get Your Firebase Config

1. In Firebase Console, click the gear icon ⚙️ next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (</>) to add a web app
5. Enter app nickname: `jacksoundworks-guestbook`
6. Click "Register app"
7. Copy the `firebaseConfig` object

## Step 4: Update Your Configuration

1. Open `firebase-config.js` in your project
2. Replace the placeholder config with your actual Firebase config:

```javascript
const firebaseConfig = {
    apiKey: "your-actual-api-key",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};
```

## Step 5: Set Up Firestore Security Rules

1. In Firebase Console, go to Firestore Database
2. Click "Rules" tab
3. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow anyone to read guest book messages
    match /guestBookMessages/{document} {
      allow read: if true;
      allow write: if true; // For now - we'll secure this later
    }
  }
}
```

4. Click "Publish"

## Step 6: Test Your Guest Book

1. Upload your files to your web server
2. Visit your guest book page
3. Try leaving a message
4. Check Firebase Console → Firestore Database to see your messages

## 🔒 Security Note

The current setup allows anyone to read and write messages. For production, you should:

1. Add rate limiting
2. Add content moderation
3. Implement user authentication
4. Add spam protection

## 📊 Monitoring

- Check Firebase Console → Firestore Database to see all messages
- Monitor usage in Firebase Console → Usage and billing
- Set up alerts for unusual activity

## 🚀 Features

✅ **Shared Messages**: All visitors see the same messages
✅ **Real-time**: Messages appear instantly
✅ **Persistent**: Messages stored forever in the cloud
✅ **Scalable**: Handles unlimited messages
✅ **Free Tier**: 50,000 reads/day, 20,000 writes/day

## 🆘 Troubleshooting

**"Firebase not loaded" error:**
- Check that `firebase-config.js` is loaded before `guest-book.js`
- Verify your Firebase config is correct
- Check browser console for errors

**Messages not appearing:**
- Check Firestore security rules
- Verify database is created and enabled
- Check browser console for errors

**Permission errors:**
- Make sure Firestore is in test mode
- Check security rules allow read/write

---

Your guest book is now ready to share messages between all visitors! 🦊💕✨ 