# 🚀 Quick Start - Firebase Integration

## Setup Langkah per Langkah

### 1. Install Dependencies

```bash
npm install firebase
```

### 2. Setup Firebase Project

1. Buka [Firebase Console](https://console.firebase.google.com/)
2. Create new project atau gunakan existing
3. Enable **Firestore Database**:
   - Pilih menu "Build" > "Firestore Database"
   - Klik "Create database"
   - Pilih mode "Start in test mode" (untuk development)
   - Pilih location terdekat (asia-southeast2 - Jakarta)

### 3. Get Firebase Configuration

1. Di Firebase Console, klik ⚙️ (Settings) > Project settings
2. Scroll ke "Your apps" section
3. Klik tombol `</>` (Web) untuk register web app
4. Copy konfigurasi yang diberikan

### 4. Setup Environment Variables

Buat file `.env.local` di root project:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 5. Seed Initial Data

```bash
node scripts/seedIncidents.js
```

### 6. Run Development Server

```bash
npm run dev
```

## 📋 Firestore Security Rules

Paste ini di Firebase Console > Firestore > Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /incidents/{incidentId} {
      // Public read access
      allow read: if true;

      // Anyone can create (untuk testing)
      // Di production, ubah ke: allow create: if request.auth != null
      allow create: if true;

      // Allow update dan delete untuk testing
      // Di production, tambahkan authentication check
      allow update, delete: if true;
    }
  }
}
```

## 🚀 Deploy ke Vercel

### Setup di Vercel Dashboard

1. Push code ke GitHub
2. Import project di [Vercel](https://vercel.com)
3. Add Environment Variables di Settings:

   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

4. Deploy!

### Via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

## 📊 Struktur Data Firestore

Collection: `incidents`

```javascript
{
  type: "Active" | "Unverified" | "Resolved",
  status: "active" | "unverified" | "resolved",
  location: string,
  description: string,
  coordinates: {
    lat: number,
    lng: number
  },
  address: string,
  confidence: number,
  createdAt: Timestamp,
  updatedAt: Timestamp,
  metadata: {
    source: string,
    priority: string,
    category: string,
    verified: boolean
  }
}
```

## 🛠️ API Usage

```javascript
// Get all incidents
import { getIncidents } from "./services/incidentService";
const incidents = await getIncidents({ limitCount: 20 });

// Subscribe to real-time updates
import { subscribeToIncidents } from "./services/incidentService";
const unsubscribe = subscribeToIncidents((incidents) => {
  console.log("Updated:", incidents);
});

// Create new incident
import { createIncident } from "./services/incidentService";
await createIncident({
  type: "Unverified",
  status: "unverified",
  location: "Jl. Example",
  description: "Description...",
  coordinates: { lat: -6.5569, lng: 107.4433 },
  address: "Full address",
  confidence: 80,
});
```

## 🔒 Production Security Checklist

- [ ] Update Firestore rules untuk require authentication
- [ ] Enable App Check di Firebase Console
- [ ] Add rate limiting
- [ ] Enable monitoring dan alerts
- [ ] Review dan limit Firestore indexes
- [ ] Setup backup schedule

## 📚 Documentation

Baca file lengkap: [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)

## 🆘 Troubleshooting

### "Firebase not initialized"

- Check `.env.local` file exists
- Restart dev server after creating `.env.local`

### "Permission denied"

- Check Firestore security rules
- Make sure rules allow public read

### Data tidak muncul

- Check Firebase Console > Firestore Database
- Verify collection name: `incidents`
- Run seed script: `node scripts/seedIncidents.js`
