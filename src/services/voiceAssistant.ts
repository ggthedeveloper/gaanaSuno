import { TRACKS, ARTISTS } from '../data/catalog';
import { Track, MoodTag } from '../types/music';
import { tanpuraEngine } from './tanpuraEngine';

export interface VoiceCommandResult {
  action:
    | 'play_track'
    | 'play_artist'
    | 'play_mood'
    | 'pause'
    | 'resume'
    | 'next'
    | 'previous'
    | 'volume_up'
    | 'volume_down'
    | 'mute'
    | 'tanpura_on'
    | 'tanpura_off'
    | 'navigate'
    | 'shayari'
    | 'unknown';
  speechResponse: string;
  speechResponseDevanagari: string;
  targetTrack?: Track;
  targetQueue?: Track[];
  targetRoute?: string;
}

export interface VoiceAssistantCallbacks {
  playTrack: (track: Track, queue?: Track[]) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  onNavigate: (route: any) => void;
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
}

export function parseVoiceCommand(
  rawTranscript: string,
  callbacks: VoiceAssistantCallbacks
): VoiceCommandResult {
  const text = rawTranscript.trim().toLowerCase();

  // 1. Tanpura Drone Controls (Checked first to prevent collision with generic play/stop)
  if (
    (text.includes('tanpura') || text.includes('drone')) &&
    (text.includes('on') || text.includes('shuru') || text.includes('chalao') || text.includes('play') || text.includes('start'))
  ) {
    tanpuraEngine.start();
    return {
      action: 'tanpura_on',
      speechResponse: 'Acoustic Tanpura drone activated.',
      speechResponseDevanagari: 'तानपुरा का शास्त्रीय नाद शुरू कर दिया गया है।',
    };
  }

  if (
    (text.includes('tanpura') || text.includes('drone')) &&
    (text.includes('off') || text.includes('band') || text.includes('roko') || text.includes('mute') || text.includes('stop'))
  ) {
    tanpuraEngine.stop();
    return {
      action: 'tanpura_off',
      speechResponse: 'Tanpura drone stopped.',
      speechResponseDevanagari: 'तानपुरा बंद कर दिया गया है।',
    };
  }

  // 2. Playback Pause / Stop
  if (
    text.includes('pause') ||
    text.includes('roko') ||
    text.includes('rok do') ||
    text.includes('ruk jao') ||
    text.includes('stop') ||
    text.includes('band karo')
  ) {
    if (callbacks.isPlaying) {
      callbacks.togglePlay();
    }
    return {
      action: 'pause',
      speechResponse: 'Music paused.',
      speechResponseDevanagari: 'गीत रोक दिया गया है।',
    };
  }

  // 3. Playback Resume / Play
  if (
    !text.includes('tanpura') &&
    (text === 'play' ||
      text === 'resume' ||
      text === 'shuru karo' ||
      text === 'gaana chalao' ||
      (text.includes('chalao') && text.length < 15))
  ) {
    if (!callbacks.isPlaying) {
      callbacks.togglePlay();
    }
    return {
      action: 'resume',
      speechResponse: 'Resuming playback.',
      speechResponseDevanagari: 'गीत शुरू किया जा रहा है।',
    };
  }

  // 3. Next Track
  if (
    text.includes('next') ||
    text.includes('agla') ||
    text.includes('aage badhao') ||
    text.includes('skip')
  ) {
    callbacks.nextTrack();
    return {
      action: 'next',
      speechResponse: 'Playing next track.',
      speechResponseDevanagari: 'अगला गीत बज रहा है।',
    };
  }

  // 4. Previous Track
  if (
    text.includes('previous') ||
    text.includes('pichhla') ||
    text.includes('peechhe') ||
    text.includes('back song')
  ) {
    callbacks.previousTrack();
    return {
      action: 'previous',
      speechResponse: 'Playing previous track.',
      speechResponseDevanagari: 'पिछला गीत लगाया जा रहा है।',
    };
  }

  // 5. Volume Up / Awaaz Tez
  if (
    text.includes('volume up') ||
    text.includes('awaaz badhao') ||
    text.includes('tez karo') ||
    text.includes('louder') ||
    text.includes('sound badhao')
  ) {
    const newVol = Math.round(Math.min(1, callbacks.volume + 0.2) * 100) / 100;
    callbacks.setVolume(newVol);
    return {
      action: 'volume_up',
      speechResponse: `Volume increased to ${Math.round(newVol * 100)} percent.`,
      speechResponseDevanagari: `आवाज़ ${Math.round(newVol * 100)}% कर दी गई है।`,
    };
  }

  // 6. Volume Down / Awaaz Dheemi
  if (
    text.includes('volume down') ||
    text.includes('awaaz kam karo') ||
    text.includes('dheemi karo') ||
    text.includes('softer') ||
    text.includes('sound kam')
  ) {
    const newVol = Math.round(Math.max(0, callbacks.volume - 0.2) * 100) / 100;
    callbacks.setVolume(newVol);
    return {
      action: 'volume_down',
      speechResponse: `Volume reduced to ${Math.round(newVol * 100)} percent.`,
      speechResponseDevanagari: `आवाज़ धीमी कर दी गई है (${Math.round(newVol * 100)}%)।`,
    };
  }

  // 7. Mute
  if (text.includes('mute') || text.includes('chup') || text.includes('awaaz band')) {
    callbacks.toggleMute();
    return {
      action: 'mute',
      speechResponse: 'Audio muted.',
      speechResponseDevanagari: 'आवाज़ म्यूट कर दी गई है।',
    };
  }

  // 8. Navigation commands (Mehfil, Search, Home, Library)
  if (text.includes('mehfil') || text.includes('baithak') || text.includes('turntable') || text.includes('cassette')) {
    callbacks.onNavigate('mehfil');
    return {
      action: 'navigate',
      targetRoute: 'mehfil',
      speechResponse: 'Welcome to Mehfil Baithak sanctuary.',
      speechResponseDevanagari: 'महफ़िल बैठक में आपका स्वागत है।',
    };
  }

  if (text.includes('search') || text.includes('dhoondo') || text.includes('explore')) {
    callbacks.onNavigate('search');
    return {
      action: 'navigate',
      targetRoute: 'search',
      speechResponse: 'Opening Search & Explore.',
      speechResponseDevanagari: 'खोज पटल खोला जा रहा है।',
    };
  }

  if (text.includes('home') || text.includes('ghar') || text.includes('mukhya')) {
    callbacks.onNavigate('home');
    return {
      action: 'navigate',
      targetRoute: 'home',
      speechResponse: 'Navigating to Home.',
      speechResponseDevanagari: 'मुख्य पृष्ठ पर जा रहे हैं।',
    };
  }

  if (text.includes('library') || text.includes('collection') || text.includes('liked songs')) {
    callbacks.onNavigate('library');
    return {
      action: 'navigate',
      targetRoute: 'library',
      speechResponse: 'Opening your Library.',
      speechResponseDevanagari: 'आपकी लाइब्रेरी खोली जा रही है।',
    };
  }

  // 10. Poetry / Shayari Command
  if (text.includes('shayari') || text.includes('sher') || text.includes('kavita') || text.includes('poetry')) {
    const lyric = callbacks.currentTrack?.lyrics?.[0]?.text || 'होश वालों को ख़बर क्या बे-ख़ुदी क्या चीज़ है, इश्क़ कीजे फिर समझिए ज़िंदगी क्या चीज़ है।';
    return {
      action: 'shayari',
      speechResponse: `Here is a couplet for you: ${lyric}`,
      speechResponseDevanagari: `पेश है एक शेर: "${lyric}"`,
    };
  }

  // 11. Search and Play Specific Song by Title
  // Clean command filler words: "play", "bajao", "chalao", "sunao", "song", "gaana", "please"
  const cleanTrackQuery = text
    .replace(/(play|bajao|chalao|sunao|lagao|song|gaana|geet|suno|please|chahiye)/gi, '')
    .trim();

  if (cleanTrackQuery.length >= 2) {
    const matchedTrack = TRACKS.find(
      (t) =>
        t.title.toLowerCase().includes(cleanTrackQuery) ||
        cleanTrackQuery.includes(t.title.toLowerCase()) ||
        t.titleDevanagari.includes(cleanTrackQuery)
    );

    if (matchedTrack) {
      callbacks.playTrack(matchedTrack, TRACKS);
      return {
        action: 'play_track',
        targetTrack: matchedTrack,
        speechResponse: `Playing ${matchedTrack.title} by ${matchedTrack.artist}.`,
        speechResponseDevanagari: `बजा रहे हैं: ${matchedTrack.titleDevanagari} (${matchedTrack.artistDevanagari})।`,
      };
    }
  }

  // 12. Search and Play by Artist
  const matchedArtist = ARTISTS.find(
    (a) =>
      text.includes(a.name.toLowerCase()) ||
      text.includes(a.nameDevanagari) ||
      (a.name.toLowerCase().includes('arijit') && text.includes('arijit')) ||
      (a.name.toLowerCase().includes('rahman') && text.includes('rahman')) ||
      (a.name.toLowerCase().includes('kabir') && text.includes('kabir'))
  );

  if (matchedArtist) {
    const artistTracks = TRACKS.filter((t) => t.artist.toLowerCase().includes(matchedArtist.name.toLowerCase()));
    if (artistTracks.length > 0) {
      callbacks.playTrack(artistTracks[0], artistTracks);
      return {
        action: 'play_artist',
        targetTrack: artistTracks[0],
        targetQueue: artistTracks,
        speechResponse: `Playing popular songs by ${matchedArtist.name}.`,
        speechResponseDevanagari: `${matchedArtist.nameDevanagari} के लोकप्रिय गीत बज रहे हैं।`,
      };
    }
  }

  // 13. Search and Play by Mood
  const moodKeywords: Record<string, MoodTag> = {
    romantic: 'romantic',
    romance: 'romantic',
    love: 'romantic',
    ishq: 'romantic',
    pyar: 'romantic',
    heartbreak: 'heartbreak',
    dard: 'heartbreak',
    sad: 'heartbreak',
    gham: 'heartbreak',
    chill: 'chill',
    sukoon: 'chill',
    relax: 'chill',
    lofi: 'chill',
    devotional: 'devotional',
    sufi: 'devotional',
    bhakti: 'devotional',
    nostalgic: 'nostalgic',
    purane: 'nostalgic',
    '90s': 'nostalgic',
    retro: 'nostalgic',
    party: 'energetic',
    dance: 'energetic',
    josh: 'energetic',
    punjabi: 'energetic',
    monsoon: 'monsoon',
    barish: 'monsoon',
    rain: 'monsoon',
  };

  for (const [key, moodTag] of Object.entries(moodKeywords)) {
    if (text.includes(key)) {
      const moodTracks = TRACKS.filter((t) => t.moods.includes(moodTag));
      if (moodTracks.length > 0) {
        callbacks.playTrack(moodTracks[0], moodTracks);
        return {
          action: 'play_mood',
          targetTrack: moodTracks[0],
          targetQueue: moodTracks,
          speechResponse: `Playing ${moodTag} Hindi melodies for you.`,
          speechResponseDevanagari: `आपके लिए ${moodTag} गीत पेश हैं।`,
        };
      }
    }
  }

  // Fallback: If query has any search intent, redirect to search
  if (cleanTrackQuery.length > 2) {
    callbacks.onNavigate('search');
    return {
      action: 'navigate',
      targetRoute: 'search',
      speechResponse: `Searching for "${cleanTrackQuery}".`,
      speechResponseDevanagari: `"${cleanTrackQuery}" की खोज की जा रही है।`,
    };
  }

  return {
    action: 'unknown',
    speechResponse: "Sorry, I didn't catch that. You can say 'Play Kesariya', 'Romantic gaane bajao', or 'Tanpura shuru karo'.",
    speechResponseDevanagari: 'माफ़ कीजिए, मैं समझ नहीं पाया। आप कह सकते हैं: "केसरिया बजाओ", "रोमांटिक गाने लगाओ", या "तानपुरा शुरू करो"।',
  };
}

/**
 * Text-to-speech speaker using Web Speech Synthesis API
 */
export function speakResponse(text: string, lang: 'hi-IN' | 'en-IN' = 'hi-IN'): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  try {
    window.speechSynthesis.cancel(); // Stop any pending speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 1.0;
    utterance.pitch = 1.05;

    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find((v) => v.lang.startsWith('hi') || v.lang.includes('IN'));
    if (hindiVoice) {
      utterance.voice = hindiVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('Speech synthesis note:', e);
  }
}
