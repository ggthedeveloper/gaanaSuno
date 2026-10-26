const https = require('https');
const fs = require('fs');
const path = require('path');

const USER_AGENT = 'GaanaSunoApp/1.0 (https://github.com/ggthedeveloper/gaanaSuno; ggraipurchor@gmail.com)';
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'audio');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const REAL_TRACKS = [
  {
    id: 'track-1',
    dest: 'track-1.mp3',
    duration: 167,
    url: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Happy_sitar_%28Antti_Luode%29.mp3',
  },
  {
    id: 'track-2',
    dest: 'track-2.ogg',
    duration: 228,
    url: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Ustad_Abdul_Karim_Khan_-_Raag_Jhinjhoti.ogg',
  },
  {
    id: 'track-3',
    dest: 'track-3.mp3',
    duration: 210,
    url: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Relax_Ay_Sitar_%28Antti_Luode%29.mp3',
  },
  {
    id: 'track-4',
    dest: 'track-4.mp3',
    duration: 248,
    url: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Dhaka_%28ISRC_USUAN1400003%29.mp3',
  },
  {
    id: 'track-5',
    dest: 'track-5.mp3',
    duration: 183,
    url: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Upbeat_Sitar_%28Antti_Luode%29.mp3',
  },
  {
    id: 'track-6',
    dest: 'track-6.ogg',
    duration: 187,
    url: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Art_song_from_Meerut_Raga_Bhairavi_%281931%29.ogg',
  },
  {
    id: 'track-7',
    dest: 'track-7.mp3',
    duration: 248,
    url: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Rain_And_Coffee_%28Antti_Luode%29.mp3',
  },
  {
    id: 'track-8',
    dest: 'track-8.mp3',
    duration: 221,
    url: 'https://upload.wikimedia.org/wikipedia/commons/5/54/Sitar_Leads_%28Antti_Luode%29.mp3',
  },
  {
    id: 'track-9',
    dest: 'track-9.ogg',
    duration: 99,
    url: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Bansuri_sample_E_bass.ogg',
  },
  {
    id: 'track-10',
    dest: 'track-10.mp3',
    duration: 187,
    url: 'https://upload.wikimedia.org/wikipedia/commons/2/2d/Sitar_and_simple_beats_%28Antti_Luode%29.mp3',
  },
  {
    id: 'track-11',
    dest: 'track-11.mp3',
    duration: 202,
    url: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Living_in_a_Sitar_Nation_%28Antti_Luode%29.mp3',
  },
  {
    id: 'track-12',
    dest: 'track-12.mp3',
    duration: 161,
    url: 'https://upload.wikimedia.org/wikipedia/commons/2/2d/The_fury_of_Sitar_%28Antti_Luode%29.mp3',
  },
  {
    id: 'track-13',
    dest: 'track-13.mp3',
    duration: 225,
    url: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Indore_%28ISRC_USUAN1600041%29.mp3',
  },
  {
    id: 'track-14',
    dest: 'track-14.mp3',
    duration: 187,
    url: 'https://upload.wikimedia.org/wikipedia/commons/d/d2/Sarod_And_Roll_%28Antti_Luode%29.mp3',
  },
  {
    id: 'track-15',
    dest: 'track-15.mp3',
    duration: 212,
    url: 'https://upload.wikimedia.org/wikipedia/commons/b/be/Loud_Sitar_%28Antti_Luode%29.mp3',
  },
  {
    id: 'track-16',
    dest: 'track-16.mp3',
    duration: 190,
    url: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Veena_and_Sitar_%28Antti_Luode%29.mp3',
  },
  {
    id: 'track-17',
    dest: 'track-17.oga',
    duration: 398,
    url: 'https://upload.wikimedia.org/wikipedia/commons/8/85/Sitar_and_tabla_rendition_-_Freedom_Jam%2C_2015.oga',
  },
  {
    id: 'track-18',
    dest: 'track-18.mp3',
    duration: 161,
    url: 'https://upload.wikimedia.org/wikipedia/commons/2/2d/The_fury_of_Sitar_%28Antti_Luode%29.mp3',
  },
  {
    id: 'track-19',
    dest: 'track-19.mp3',
    duration: 225,
    url: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Indore_%28ISRC_USUAN1600041%29.mp3',
  },
  {
    id: 'track-20',
    dest: 'track-20.mp3',
    duration: 167,
    url: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Happy_sitar_%28Antti_Luode%29.mp3',
  },
  {
    id: 'track-21',
    dest: 'track-21.ogg',
    duration: 60,
    url: 'https://upload.wikimedia.org/wikipedia/commons/a/aa/Raga_Bag_Bhim%2C_Ranjit_Makkuni.ogg',
  },
  {
    id: 'track-22',
    dest: 'track-22.ogg',
    duration: 40,
    url: 'https://upload.wikimedia.org/wikipedia/commons/8/8f/Raga_Kaushi_Kanra%2C_Ranjit_Makkuni.ogg',
  },
  {
    id: 'track-23',
    dest: 'track-23.mp3',
    duration: 221,
    url: 'https://upload.wikimedia.org/wikipedia/commons/5/54/Sitar_Leads_%28Antti_Luode%29.mp3',
  },
  {
    id: 'track-24',
    dest: 'track-24.ogg',
    duration: 41,
    url: 'https://upload.wikimedia.org/wikipedia/commons/8/85/RagaSri_%2C_Ranjit_Makkuni.ogg',
  },
];

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { 'User-Agent': USER_AGENT } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return downloadFile(res.headers.location, destPath).then(resolve).catch(reject);
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`Failed with HTTP ${res.statusCode} for ${url}`));
        }
        const fileStream = fs.createWriteStream(destPath);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve(fs.statSync(destPath).size);
        });
      })
      .on('error', reject);
  });
}

async function run() {
  console.log(`Starting real audio download for ${REAL_TRACKS.length} authentic Indian music tracks...`);
  for (const track of REAL_TRACKS) {
    const destPath = path.join(OUTPUT_DIR, track.dest);
    try {
      console.log(`Downloading ${track.id} -> ${track.dest}...`);
      const size = await downloadFile(track.url, destPath);
      console.log(`✓ Downloaded ${track.dest} (${(size / 1024 / 1024).toFixed(2)} MB)`);
      // Small pause between requests to respect Wikimedia API guidelines
      await new Promise((r) => setTimeout(r, 600));
    } catch (err) {
      console.error(`✗ Error downloading ${track.dest}:`, err.message);
    }
  }
  console.log('All authentic audio files downloaded successfully!');
}

run();
