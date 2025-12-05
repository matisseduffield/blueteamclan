# Firebase Setup Guide

This guide explains how to set up Firebase for the Blue Team Clan website.

## What is Firebase?

Firebase provides:
- **Firestore** - NoSQL database for clan data, members, events
- **Authentication** - User sign-in and registration
- **Storage** - Upload images, media files
- **Real-time updates** - Live member status, event notifications

## Setup Steps

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"** or **"Add project"**
3. Enter project name: `blue-team-clan`
4. Accept terms and click **"Create project"**
5. Wait for project initialization to complete

### 2. Get Firebase Configuration

1. In Firebase Console, click the **"Settings"** icon (⚙️) → **"Project settings"**
2. Scroll down to **"Your apps"** section
3. Click **"Web"** (or create a new web app)
4. You'll see the Firebase configuration object:
   ```javascript
   {
     apiKey: "...",
     authDomain: "...",
     projectId: "...",
     storageBucket: "...",
     messagingSenderId: "...",
     appId: "..."
   }
   ```

### 3. Add Firebase Config to Your Project

1. Copy your values from Firebase Console
2. Create or update `.env.local` in your project root:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

### 4. Enable Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click **"Create database"**
3. Choose region closest to your players
4. Start in **"Production mode"** (we'll set up security rules later)
5. Click **"Enable"**

### 5. Enable Authentication

1. Go to **Authentication** → **"Get started"**
2. Enable sign-in methods you want:
   - **Email/Password** (recommended for clan members)
   - **Google** (optional)
   - **Discord** (optional)

### 6. Enable Storage (Optional - for images/media)

1. Go to **Storage** → **"Get started"**
2. Choose region (same as Firestore is recommended)
3. Click **"Done"**

## Usage in Your Project

### Import Firebase
```typescript
import { auth, db, storage } from "@/lib/firebase";
```

### Example: Read data from Firestore
```typescript
import { collection, getDocs } from "firebase/firestore";

async function getMembers() {
  const membersRef = collection(db, "members");
  const snapshot = await getDocs(membersRef);
  return snapshot.docs.map(doc => doc.data());
}
```

### Example: Create a new document
```typescript
import { collection, addDoc } from "firebase/firestore";

async function addMember(memberData) {
  const docRef = await addDoc(collection(db, "members"), memberData);
  return docRef.id;
}
```

### Example: Update a document
```typescript
import { doc, updateDoc } from "firebase/firestore";

async function updateMember(memberId, updates) {
  const memberRef = doc(db, "members", memberId);
  await updateDoc(memberRef, updates);
}
```

## Security Rules (Important!)

In **Firestore Security Rules**, set appropriate permissions:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read, authenticated write
    match /members/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Events readable by all, writable by admin
    match /events/{document=**} {
      allow read: if true;
      allow write: if request.auth.uid == "admin_uid";
    }
  }
}
```

## Firestore Data Structure (Recommended)

```
collections/
├── members/
│   └── {memberId}/
│       ├── name: string
│       ├── role: string (leader, elder, member)
│       ├── trophies: number
│       ├── joinDate: timestamp
│       └── avatar: string (URL)
│
├── events/
│   └── {eventId}/
│       ├── title: string
│       ├── description: string
│       ├── date: timestamp
│       ├── type: string (war, cwl, challenge)
│       └── status: string (scheduled, ongoing, completed)
│
└── clan/
    └── info/
        ├── name: string
        ├── tag: string
        ├── level: number
        ├── warWins: number
        └── description: string
```

## Next Steps

1. ✅ Set up Firebase project
2. ✅ Get API credentials
3. ✅ Add to `.env.local`
4. ✅ Enable Firestore
5. Create Firestore collections (members, events, clan)
6. Build database-connected pages
7. Deploy to Cloudflare Pages (Firebase works with static exports!)

## Troubleshooting

**"Firebase is not initialized"?**
- Check that `.env.local` has all Firebase credentials
- Verify `NEXT_PUBLIC_` prefix on all Firebase env vars
- Restart dev server: `npm run dev`

**Firestore security errors?**
- Update security rules to allow your operations
- Test in Firestore Console first

**Can't read from Firestore?**
- Ensure Firestore is enabled in Firebase Console
- Check security rules allow read access
- Verify collection name spelling

---

For more info: [Firebase Documentation](https://firebase.google.com/docs)
