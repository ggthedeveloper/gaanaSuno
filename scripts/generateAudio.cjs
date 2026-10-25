const fs = require('fs');
const path = require('path');

const TRACK_PROFILES = [
  // 1: Kesariya Ishq (Raga Yaman / Romantic Acoustic)
  { id: 'track-1', baseFreq: 220.0, chords: [1, 1.25, 1.5, 1.875], tempo: 1.8, style: 'acoustic' },
  // 2: Chaap Tilak (Sufi Harmonium / Mystic Drone)
  { id: 'track-2', baseFreq: 138.59, chords: [1, 1.333, 1.5, 2.0], tempo: 2.4, style: 'drone' },
  // 3: Raat Akeli Thi (Midnight Lo-Fi Rhodes)
  { id: 'track-3', baseFreq: 164.81, chords: [1, 1.189, 1.498, 1.782], tempo: 2.2, style: 'lofi' },
  // 4: Kabira Ki Raah (Folk Sarangi / Melancholy)
  { id: 'track-4', baseFreq: 196.0, chords: [1, 1.2, 1.5, 1.732], tempo: 1.6, style: 'folk' },
  // 5: Rangla Punjab (High-Energy Bhangra Dhol Groove)
  { id: 'track-5', baseFreq: 130.81, chords: [1, 1.25, 1.5, 1.667], tempo: 0.9, style: 'rhythm' },
  // 6: Bhairavi Morning Raga (Classical Sitar & Tanpura)
  { id: 'track-6', baseFreq: 146.83, chords: [1, 1.059, 1.414, 1.888], tempo: 3.2, style: 'sitar' },
  // 7: Chai Aur Baarish (Rainy Acoustic Picking)
  { id: 'track-7', baseFreq: 246.94, chords: [1, 1.25, 1.5, 1.75], tempo: 1.7, style: 'acoustic' },
  // 8: Pehli Dafa Muskurana (Sweet Bollywood Ballad)
  { id: 'track-8', baseFreq: 261.63, chords: [1, 1.25, 1.5, 1.875], tempo: 1.5, style: 'acoustic' },
  // 9: Achyutam Keshavam (Devotional Morning Flute)
  { id: 'track-9', baseFreq: 293.66, chords: [1, 1.333, 1.5, 2.0], tempo: 2.5, style: 'flute' },
  // 10: Yaadon Ka Retro Cassette (90s Analog Warmth)
  { id: 'track-10', baseFreq: 174.61, chords: [1, 1.26, 1.498, 1.888], tempo: 1.6, style: 'lofi' },
  // 11: Dilli Wali Shaam (Indie Pop Guitar)
  { id: 'track-11', baseFreq: 220.0, chords: [1, 1.25, 1.5, 2.0], tempo: 1.4, style: 'acoustic' },
  // 12: Gaddi Fortuner (Punjabi Drill Sub-Bass)
  { id: 'track-12', baseFreq: 110.0, chords: [1, 1.2, 1.5, 1.6], tempo: 1.0, style: 'rhythm' },
  // 13: Yaman Bansuri Meditation (Evening Calm Flute)
  { id: 'track-13', baseFreq: 220.0, chords: [1, 1.414, 1.5, 1.888], tempo: 3.0, style: 'flute' },
  // 14: Channa Ve Judaai (Heartbreak Minor Piano)
  { id: 'track-14', baseFreq: 164.81, chords: [1, 1.189, 1.414, 1.682], tempo: 2.0, style: 'acoustic' },
  // 15: Dhol Dhamaka Celebration (Wedding Sangeet Beat)
  { id: 'track-15', baseFreq: 130.81, chords: [1, 1.333, 1.5, 1.75], tempo: 0.85, style: 'rhythm' },
  // 16: Nostalgic Chai Tapri (Indie Rock Strumming)
  { id: 'track-16', baseFreq: 196.0, chords: [1, 1.25, 1.5, 1.8], tempo: 1.3, style: 'acoustic' },
];

function generateWavFile(profile, outPath, durationSec = 22, sampleRate = 22050) {
  const numSamples = Math.floor(sampleRate * durationSec);
  const dataSize = numSamples * 2;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF Chunk
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // Format Chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(1, 22); // Mono
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);

  // Data Chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  let offset = 44;
  const { baseFreq, chords, tempo, style } = profile;

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    let sample = 0;

    // Chord progression cycle (changes chord every 4 beats)
    const chordIndex = Math.floor((t / (tempo * 2)) % chords.length);
    const chordMultiplier = chords[chordIndex] || 1;
    const currentBase = baseFreq * chordMultiplier;

    // Primary melodic voice
    const pulse = Math.exp(-((t % tempo) * 2.5));
    const tone1 = Math.sin(2 * Math.PI * currentBase * t);
    const tone2 = Math.sin(2 * Math.PI * (currentBase * 1.5) * t) * 0.4;
    const tone3 = Math.sin(2 * Math.PI * (currentBase * 2.0) * t) * 0.25;

    // Style-specific acoustic texture
    if (style === 'acoustic' || style === 'sitar') {
      sample = (tone1 + tone2 + tone3) * (0.3 + 0.7 * pulse);
      // Gentle sympathetic string resonance
      sample += Math.sin(2 * Math.PI * (baseFreq * 0.5) * t) * 0.15;
    } else if (style === 'drone') {
      // Tanpura / harmonium continuous rich swell
      const swell = Math.sin(2 * Math.PI * 0.25 * t) * 0.3 + 0.7;
      sample = (tone1 * 0.5 + tone2 * 0.4 + tone3 * 0.3) * swell;
    } else if (style === 'rhythm') {
      // Dhol / percussion thump
      const kick = Math.exp(-((t % (tempo * 0.5)) * 14)) * Math.sin(2 * Math.PI * 65 * t);
      sample = kick * 0.6 + (tone1 + tone2) * 0.35 * pulse;
    } else if (style === 'lofi') {
      // Warm Rhodes electric piano with soft vibrato
      const vibrato = Math.sin(2 * Math.PI * 4 * t) * 2.0;
      sample = Math.sin(2 * Math.PI * (currentBase + vibrato) * t) * 0.5 * (0.4 + 0.6 * pulse);
    } else if (style === 'flute') {
      // Breath-like bamboo bansuri harmonics with gentle tremolo
      const tremolo = Math.sin(2 * Math.PI * 5 * t) * 0.15 + 0.85;
      sample = (tone1 * 0.6 + tone2 * 0.3) * tremolo;
    } else {
      sample = (tone1 + tone2) * 0.5 * pulse;
    }

    // Soft master limiter to avoid distortion
    const clamped = Math.max(-0.95, Math.min(0.95, sample * 0.75));
    buffer.writeInt16LE(Math.floor(clamped * 32767), offset);
    offset += 2;
  }

  fs.writeFileSync(outPath, buffer);
  console.log(`Generated: ${path.basename(outPath)} (${(buffer.length / 1024).toFixed(1)} KB)`);
}

const outDir = path.join(__dirname, '../public/audio');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

console.log('Generating 16 local audio tracks for GaanaSuno...');
TRACK_PROFILES.forEach((profile) => {
  const filePath = path.join(outDir, `${profile.id}.wav`);
  generateWavFile(profile, filePath);
});
console.log('All 16 local audio tracks successfully generated!');
