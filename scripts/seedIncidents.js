import { createIncident } from '../src/services/incidentService.js';

const sampleIncidents = [
  {
    type: 'Active',
    status: 'active',
    location: 'Jl. Veteran, Kec. Purwakarta',
    description: 'Terdeteksi aktivitas mencurigakan dengan potensi konflik antar kelompok di area persimpangan jalan veteran. Sistem AI mendeteksi kerumunan massa dengan gerakan tidak normal.',
    coordinates: { lat: -6.5550, lng: 107.4410 },
    address: 'Jl. Veteran No. 45, Kec. Purwakarta',
    confidence: 92,
    metadata: {
      source: 'ai_detection',
      priority: 'high',
      category: 'crime',
      verified: false
    }
  },
  {
    type: 'Unverified',
    status: 'unverified',
    location: 'Kantor Kecamatan Jatiluhur',
    description: 'Laporan warga tentang aktivitas tidak biasa di area kantor kecamatan. Perlu verifikasi lebih lanjut dari petugas lapangan.',
    coordinates: { lat: -6.5700, lng: 107.4600 },
    address: 'Jl. Raya Jatiluhur, Kec. Jatiluhur',
    confidence: 88,
    metadata: {
      source: 'citizen_report',
      priority: 'medium',
      category: 'social',
      verified: false
    }
  },
  {
    type: 'Resolved',
    status: 'resolved',
    location: 'Pasar Baru, Purwakarta',
    description: 'Kasus pencurian berhasil ditangani, pelaku diamankan petugas. Barang bukti telah diamankan dan tersangka dalam proses hukum.',
    coordinates: { lat: -6.5580, lng: 107.4450 },
    address: 'Pasar Baru, Jl. Pasar No. 12, Purwakarta',
    confidence: 95,
    metadata: {
      source: 'manual',
      priority: 'low',
      category: 'crime',
      verified: true,
      verifiedBy: 'admin_001'
    }
  },
  {
    type: 'Active',
    status: 'active',
    location: 'Alun-alun Purwakarta',
    description: 'Deteksi aktivitas demonstrasi spontan di area alun-alun. Tim keamanan telah disiagakan untuk monitoring.',
    coordinates: { lat: -6.5565, lng: 107.4425 },
    address: 'Alun-alun Purwakarta, Jl. Veteran',
    confidence: 89,
    metadata: {
      source: 'ai_detection',
      priority: 'high',
      category: 'social',
      verified: false
    }
  },
  {
    type: 'Unverified',
    status: 'unverified',
    location: 'Jl. Ibrahim Singadilaga',
    description: 'Laporan warga mengenai kendaraan mencurigakan parkir dalam waktu lama. Perlu investigasi lebih lanjut.',
    coordinates: { lat: -6.5585, lng: 107.4470 },
    address: 'Jl. Ibrahim Singadilaga No. 88, Purwakarta',
    confidence: 78,
    metadata: {
      source: 'citizen_report',
      priority: 'medium',
      category: 'crime',
      verified: false
    }
  },
  {
    type: 'Resolved',
    status: 'resolved',
    location: 'Terminal Purwakarta',
    description: 'Penertiban PKL di area terminal telah selesai dilaksanakan. Situasi kembali kondusif.',
    coordinates: { lat: -6.5620, lng: 107.4380 },
    address: 'Terminal Purwakarta, Jl. Terminal',
    confidence: 100,
    metadata: {
      source: 'manual',
      priority: 'low',
      category: 'infrastructure',
      verified: true,
      verifiedBy: 'admin_002'
    }
  },
  {
    type: 'Unverified',
    status: 'unverified',
    location: 'Kantor Bupati Purwakarta',
    description: 'Laporan kegiatan transparansi LHKPN sedang berlangsung. Monitoring aktivitas pejabat.',
    coordinates: { lat: -6.5540, lng: 107.4440 },
    address: 'Kantor Bupati Purwakarta, Jl. Gandanegara',
    confidence: 85,
    metadata: {
      source: 'citizen_report',
      priority: 'low',
      category: 'social',
      verified: false
    }
  },
  {
    type: 'Active',
    status: 'active',
    location: 'Jl. KK Singawinata',
    description: 'Kecelakaan lalu lintas dengan korban luka ringan. Tim medis dan polisi sudah berada di lokasi.',
    coordinates: { lat: -6.5575, lng: 107.4415 },
    address: 'Jl. KK Singawinata No. 23, Purwakarta',
    confidence: 93,
    metadata: {
      source: 'ai_detection',
      priority: 'high',
      category: 'infrastructure',
      verified: true,
      verifiedBy: 'dispatcher_001'
    }
  }
];

async function seedIncidents() {
  console.log('🌱 Starting to seed incidents data...\n');

  for (let i = 0; i < sampleIncidents.length; i++) {
    try {
      const incident = sampleIncidents[i];
      const id = await createIncident(incident);
      console.log(`✅ [${i + 1}/${sampleIncidents.length}] Created incident: ${incident.location} (ID: ${id})`);
    } catch (error) {
      console.error(`❌ Error seeding incident ${i + 1}:`, error.message);
    }
  }

  console.log('\n🎉 Seeding completed!');
  console.log(`📊 Total incidents created: ${sampleIncidents.length}`);
  process.exit(0);
}

// Run the seed function
seedIncidents().catch(error => {
  console.error('Fatal error during seeding:', error);
  process.exit(1);
});
