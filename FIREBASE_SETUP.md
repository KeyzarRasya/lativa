# Firebase Firestore Setup untuk LATIVA

## 📋 Struktur Database

### Collection: `incidents`

Setiap dokumen dalam collection `incidents` memiliki struktur berikut:

```javascript
{
  // Required fields
  type: "Active" | "Unverified" | "Resolved",
  status: "active" | "unverified" | "resolved",
  location: "Jl. Veteran, Kec. Purwakarta",
  description: "Terdeteksi aktivitas mencurigakan...",
  coordinates: {
    lat: -6.5550,
    lng: 107.4410
  },
  address: "Jl. Veteran, Kec. Purwakarta",

  // Auto-generated fields
  createdAt: Timestamp,
  updatedAt: Timestamp,

  // Optional fields
  confidence: 92,              // 0-100
  createdBy: "user_id",        // User ID if authenticated
  metadata: {
    source: "citizen_report" | "ai_detection" | "manual",
    priority: "low" | "medium" | "high",
    category: "crime" | "infrastructure" | "social",
    images: ["url1", "url2"],  // Optional images
    verified: false,
    verifiedBy: "admin_id",
    verifiedAt: Timestamp
  }
}
```

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
cd lativa
npm install firebase
```

### 2. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable Firestore Database
4. Go to Project Settings > General > Your apps
5. Register a web app and copy the configuration

### 3. Configure Environment Variables

Create `.env.local` file in root directory:

```env
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:xxxxxxxxxxxxx
```

⚠️ **PENTING**: Jangan commit file `.env.local` ke Git!

### 4. Setup Firestore Security Rules

Di Firebase Console > Firestore Database > Rules, copy paste rules berikut:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Incidents collection rules
    match /incidents/{incidentId} {
      // Anyone can read incidents (public data)
      allow read: if true;

      // Authenticated users can create incidents
      allow create: if request.auth != null
                    && request.resource.data.keys().hasAll(['type', 'status', 'location', 'description', 'coordinates'])
                    && request.resource.data.coordinates.keys().hasAll(['lat', 'lng'])
                    && request.resource.data.status in ['active', 'unverified', 'resolved'];

      // Only creator or admin can update
      allow update: if request.auth != null
                    && (request.auth.uid == resource.data.createdBy
                        || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');

      // Only admin can delete
      allow delete: if request.auth != null
                    && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

**Note untuk development**: Untuk testing awal, bisa gunakan rules ini (TIDAK AMAN untuk production):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### 5. Create Firestore Indexes

Di Firebase Console > Firestore Database > Indexes, buat composite indexes:

#### Index 1: Status + CreatedAt

- Collection: `incidents`
- Fields:
  - `status` (Ascending)
  - `createdAt` (Descending)
- Query scope: Collection

#### Index 2: Status + UpdatedAt

- Collection: `incidents`
- Fields:
  - `status` (Ascending)
  - `updatedAt` (Descending)
- Query scope: Collection

**Atau** tunggu error di Console browser saat query, Firebase akan memberikan link untuk auto-generate index.

## 📊 Seed Data (Initial Data)

Gunakan script berikut untuk populate initial data:

```javascript
// scripts/seedIncidents.js
import { createIncident } from "../src/services/incidentService";

const sampleIncidents = [
  {
    type: "Active",
    status: "active",
    location: "Jl. Veteran, Kec. Purwakarta",
    description:
      "Terdeteksi aktivitas mencurigakan dengan potensi konflik antar kelompok",
    coordinates: { lat: -6.555, lng: 107.441 },
    address: "Jl. Veteran No. 45, Kec. Purwakarta",
    confidence: 92,
    metadata: {
      source: "ai_detection",
      priority: "high",
      category: "crime",
    },
  },
  {
    type: "Unverified",
    status: "unverified",
    location: "Kantor Kecamatan Jatiluhur",
    description:
      "Laporan warga tentang aktivitas tidak biasa di area kantor kecamatan",
    coordinates: { lat: -6.57, lng: 107.46 },
    address: "Jl. Raya Jatiluhur, Kec. Jatiluhur",
    confidence: 88,
    metadata: {
      source: "citizen_report",
      priority: "medium",
      category: "social",
    },
  },
  {
    type: "Resolved",
    status: "resolved",
    location: "Pasar Baru, Purwakarta",
    description: "Kasus pencurian berhasil ditangani, pelaku diamankan petugas",
    coordinates: { lat: -6.558, lng: 107.445 },
    address: "Pasar Baru, Jl. Pasar No. 12, Purwakarta",
    confidence: 95,
    metadata: {
      source: "manual",
      priority: "low",
      category: "crime",
      verified: true,
    },
  },
];

async function seedData() {
  for (const incident of sampleIncidents) {
    try {
      const id = await createIncident(incident);
      console.log("Created incident:", id);
    } catch (error) {
      console.error("Error seeding incident:", error);
    }
  }
}

seedData();
```

## 🚀 Deployment ke Vercel

### Environment Variables di Vercel

1. Go to Vercel Dashboard > Your Project > Settings > Environment Variables
2. Add semua variable dari `.env.local`:

   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

3. Set environment: Production, Preview, Development (pilih semuanya)

### Vercel Configuration

Create `vercel.json` (optional, untuk custom routing):

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

## 📱 Usage Examples

### Get All Incidents

```javascript
import { getIncidents } from "./services/incidentService";

const incidents = await getIncidents({
  status: "active",
  limitCount: 10,
});
```

### Real-time Subscription

```javascript
import { subscribeToIncidents } from "./services/incidentService";

const unsubscribe = subscribeToIncidents((incidents) => {
  console.log("Updated incidents:", incidents);
  setIncidents(incidents);
});

// Cleanup
return () => unsubscribe();
```

### Create New Incident

```javascript
import { createIncident } from "./services/incidentService";

const newIncident = {
  type: "Unverified",
  status: "unverified",
  location: "Jl. Example",
  description: "Description here...",
  coordinates: { lat: -6.555, lng: 107.441 },
  address: "Full address",
  confidence: 80,
};

const id = await createIncident(newIncident);
```

## 🔒 Security Best Practices

1. **Never commit** `.env.local` atau firebase config ke Git
2. **Enable App Check** di Firebase Console untuk production
3. **Implement rate limiting** untuk prevent spam
4. **Use Authentication** untuk user-submitted reports
5. **Validate data** di client-side sebelum submit
6. **Monitor usage** di Firebase Console untuk detect abuse

## 📈 Monitoring & Analytics

1. Firebase Console > Firestore Database > Usage
2. Monitor read/write operations
3. Set budget alerts untuk avoid overages
4. Firestore free tier:
   - 50K reads/day
   - 20K writes/day
   - 20K deletes/day
   - 1 GB storage

## 🆘 Troubleshooting

### Error: "Missing or insufficient permissions"

- Check Firestore security rules
- Pastikan rules allow read: if true untuk public read

### Error: "The query requires an index"

- Click link di error message
- Firebase akan auto-generate index

### Data tidak muncul

- Check Firebase Console > Firestore Database
- Verify collection name: `incidents`
- Check browser console untuk errors

## 📚 Additional Resources

- [Firebase Docs](https://firebase.google.com/docs/firestore)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
