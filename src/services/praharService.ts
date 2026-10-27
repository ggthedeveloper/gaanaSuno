import { IndianPrahar, NavarasaId } from '../types/music';

export interface PraharData {
  id: IndianPrahar;
  name: string;
  nameDevanagari: string;
  englishTitle: string;
  timeRange: string;
  ragas: string[];
  emotion: string;
  description: string;
  couplet: {
    hindi: string;
    english: string;
    poet: string;
  };
  recommendedTrackIds: string[];
  accentGradient: string;
  glowColor: string;
}

export interface NavarasaData {
  id: NavarasaId;
  name: string;
  nameDevanagari: string;
  englishMeaning: string;
  deityRasa: string;
  color: string;
  gradient: string;
  quote: string;
  trackIds: string[];
}

export const PRAHAR_DATA: Record<IndianPrahar, PraharData> = {
  prabhat: {
    id: 'prabhat',
    name: 'Prabhat Prahar',
    nameDevanagari: 'प्रभात प्रहर',
    englishTitle: 'Dawn & Morning Awakening',
    timeRange: '04:00 – 08:00',
    ragas: ['Bhairav', 'Todi', 'Lalit', 'Ahir Bhairav'],
    emotion: 'Devotion, Tranquility & Awakening (भक्ति व शांति)',
    description: 'Golden morning mist, temple bells, and solemn meditative devotion as the sun rises over the river.',
    couplet: {
      hindi: 'जाग री बंसीवारे ललना, जागो मोरे प्यारे। रजनी बीती भोर भयो है, घर घर खुले किवारे॥',
      english: 'Awake, O flute player, the night has passed and dawn has arrived.',
      poet: 'Mirabai'
    },
    recommendedTrackIds: ['track-23', 'track-22', 'track-7', 'track-21'],
    accentGradient: 'from-amber-500 via-orange-400 to-yellow-300',
    glowColor: 'rgba(245, 158, 11, 0.25)',
  },
  madhyan: {
    id: 'madhyan',
    name: 'Madhyan Prahar',
    nameDevanagari: 'मध्याह्न प्रहर',
    englishTitle: 'Noon & Afternoon Radiance',
    timeRange: '08:00 – 16:00',
    ragas: ['Bilawal', 'Sarang', 'Jaunpuri', 'Bhimpalasi'],
    emotion: 'Vitality, Focus & Warm Radiance (उमंग व कर्म)',
    description: 'Brisk golden sunlight, bustling courtyards, and uplifting melodies fueling midday focus and life.',
    couplet: {
      hindi: 'माटी कहे कुम्हार से, तू क्या रोंदे मोय। इक दिन ऐसा आएगा, मैं रोंदूंगी तोय॥',
      english: 'The clay tells the potter: You knead me today, but one day I shall cradle you.',
      poet: 'Kabir Das'
    },
    recommendedTrackIds: ['track-1', 'track-15', 'track-11', 'track-12'],
    accentGradient: 'from-orange-500 via-amber-500 to-emerald-500',
    glowColor: 'rgba(234, 88, 12, 0.25)',
  },
  godhuli: {
    id: 'godhuli',
    name: 'Godhuli / Sandhya',
    nameDevanagari: 'गोधूलि संध्या',
    englishTitle: 'Twilight & Sunset Golden Hour',
    timeRange: '16:00 – 20:00',
    ragas: ['Marwa', 'Purvi', 'Yaman', 'Multani'],
    emotion: 'Longing, Nostalgia & Evening Chai (संध्या व विरह)',
    description: 'Dust raised by cattle returning home at dusk; warm roadside cutting chai with longing and twilight romance.',
    couplet: {
      hindi: 'शाम की धूप जब ढलने लगे, यादों के चिराग जलने लगे।',
      english: 'As the twilight sun recedes, the warm lamps of golden memories begin to glow.',
      poet: 'Gulzar'
    },
    recommendedTrackIds: ['track-25', 'track-6', 'track-20', 'track-27'],
    accentGradient: 'from-rose-500 via-orange-500 to-amber-600',
    glowColor: 'rgba(244, 63, 94, 0.25)',
  },
  ratri: {
    id: 'ratri',
    name: 'Ratri Prahar',
    nameDevanagari: 'रात्रि प्रहर',
    englishTitle: 'Evening Mehfil & Romance',
    timeRange: '20:00 – 00:00',
    ragas: ['Kalyan', 'Bageshri', 'Kafi', 'Bihag'],
    emotion: 'Intimate Romance & Ghazal Mehfil (इश्क़ व महफ़िल)',
    description: 'Soft candlelight, sitar strings, ghazals of deep passion, and heart-to-heart conversations into the night.',
    couplet: {
      hindi: 'होश वालों को ख़बर क्या बे-ख़ुदी क्या चीज़ है, इश्क़ कीजे फिर समझिए ज़िंदगी क्या चीज़ है।',
      english: 'What do the sober know of sweet abandonment? Fall in love, and only then comprehend life.',
      poet: 'Nida Fazli'
    },
    recommendedTrackIds: ['track-4', 'track-8', 'track-19', 'track-24'],
    accentGradient: 'from-indigo-600 via-purple-600 to-amber-500',
    glowColor: 'rgba(99, 102, 241, 0.25)',
  },
  madhyaratri: {
    id: 'madhyaratri',
    name: 'Madhyaratri',
    nameDevanagari: 'मध्यरात्रि',
    englishTitle: 'Midnight Mystique & Solace',
    timeRange: '00:00 – 04:00',
    ragas: ['Darbari Kanada', 'Malkauns', 'Bhairavi'],
    emotion: 'Majesty, Deep Contemplation & Solitude (वैराग्य व सुकून)',
    description: 'The world sleeps; profound tranquility reigns. Resonant lower octaves, spiritual mystery, and soulful lo-fi solace.',
    couplet: {
      hindi: 'रात आधी, समां सुनसान, हवा ठंडी है, हर धड़कन में तिरी याद की पाबंदी है।',
      english: 'Midnight has fallen, silence breathes deep; in every heartbeat your memory stays vigil.',
      poet: 'Faiz Ahmad Faiz'
    },
    recommendedTrackIds: ['track-13', 'track-17', 'track-3', 'track-18', 'track-31'],
    accentGradient: 'from-teal-600 via-emerald-700 to-indigo-900',
    glowColor: 'rgba(13, 148, 136, 0.25)',
  },
};

export const NAVARASA_DATA: Record<NavarasaId, NavarasaData> = {
  shringara: {
    id: 'shringara',
    name: 'Shringara',
    nameDevanagari: 'शृंगार रस',
    englishMeaning: 'Love, Romance & Sublime Beauty',
    deityRasa: 'Lord Vishnu (Dark & Radiant)',
    color: '#f43f5e',
    gradient: 'from-rose-500 via-pink-600 to-rose-700',
    quote: 'प्रेम और सौंदर्य का दिव्य रस — जहां सांसें गीत बन जाती हैं।',
    trackIds: ['track-1', 'track-4', 'track-10', 'track-19'],
  },
  hasya: {
    id: 'hasya',
    name: 'Hasya & Ullas',
    nameDevanagari: 'हास्य व उल्लास रस',
    englishMeaning: 'Mirth, Joy, Festive Celebration',
    deityRasa: 'Pramatha (Luminous White)',
    color: '#10b981',
    gradient: 'from-emerald-500 via-teal-600 to-green-600',
    quote: 'जीवन का उत्सव — ढोल की थाप और यारों की महफ़िल।',
    trackIds: ['track-5', 'track-16', 'track-26', 'track-32'],
  },
  karuna: {
    id: 'karuna',
    name: 'Karuna',
    nameDevanagari: 'करुण रस',
    englishMeaning: 'Pathos, Longing & Heartbreak',
    deityRasa: 'Yama (Soft Dove Ash)',
    color: '#6366f1',
    gradient: 'from-indigo-500 via-blue-600 to-slate-700',
    quote: 'विरह की मीठी टीस — जो दर्द में भी रूह को सुकून दे।',
    trackIds: ['track-9', 'track-14', 'track-18', 'track-30'],
  },
  shanta: {
    id: 'shanta',
    name: 'Shanta',
    nameDevanagari: 'शांत रस',
    englishMeaning: 'Peace, Stillness & Equanimity',
    deityRasa: 'Parabrahman (Pure Moon Pearl)',
    color: '#06b6d4',
    gradient: 'from-cyan-500 via-teal-600 to-sky-700',
    quote: 'मन की निस्तब्धता — जहां शोर थम जाता है और आत्मा गाती है।',
    trackIds: ['track-3', 'track-7', 'track-20', 'track-28'],
  },
  adbhuta: {
    id: 'adbhuta',
    name: 'Adbhuta',
    nameDevanagari: 'अद्भुत रस',
    englishMeaning: 'Wonder, Magic & Indie Mystique',
    deityRasa: 'Brahma (Golden Amber)',
    color: '#f59e0b',
    gradient: 'from-amber-500 via-yellow-600 to-orange-600',
    quote: 'हैरत और अजूबा — नयापन जो मन को चकित कर दे।',
    trackIds: ['track-8', 'track-25', 'track-27', 'track-31'],
  },
  veera: {
    id: 'veera',
    name: 'Veera',
    nameDevanagari: 'वीर रस',
    englishMeaning: 'Valor, Energy & Electric Power',
    deityRasa: 'Indra (Saffron Gold)',
    color: '#ef4444',
    gradient: 'from-red-600 via-orange-600 to-amber-700',
    quote: 'अदम्य साहस और ऊर्जा — सीने में धड़कता हुआ स्वाभिमान।',
    trackIds: ['track-12', 'track-15', 'track-29', 'track-5'],
  },
  bhakti: {
    id: 'bhakti',
    name: 'Bhakti & Samarpan',
    nameDevanagari: 'भक्ति व समर्पण रस',
    englishMeaning: 'Devotion, Sacred Surrender & Sufi Ecstasy',
    deityRasa: 'Shiva / Krishna (Divine Saffron)',
    color: '#d97706',
    gradient: 'from-amber-600 via-orange-700 to-rose-800',
    quote: 'ख़ुदा और बंदे का एकाकार — कबीर और अमीर खुसरो का अनहद नाद।',
    trackIds: ['track-2', 'track-13', 'track-22', 'track-23'],
  },
};

/**
 * Returns current Prahar based on current local hour
 */
export function getCurrentPrahar(): PraharData {
  const hour = new Date().getHours();
  if (hour >= 4 && hour < 8) return PRAHAR_DATA.prabhat;
  if (hour >= 8 && hour < 16) return PRAHAR_DATA.madhyan;
  if (hour >= 16 && hour < 20) return PRAHAR_DATA.godhuli;
  if (hour >= 20 || hour < 0) return PRAHAR_DATA.ratri;
  return PRAHAR_DATA.madhyaratri;
}
