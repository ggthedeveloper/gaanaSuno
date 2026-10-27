import React, { useState, useMemo } from 'react';
import { Track, DeckMode, NavarasaId } from '../types/music';
import { TRACKS } from '../data/catalog';
import { useAudio } from '../context/AudioContext';
import {
  getCurrentPrahar,
  NAVARASA_DATA,
  PraharData,
  NavarasaData,
} from '../services/praharService';
import { TanpuraBar } from '../components/mehfil/TanpuraBar';
import { TurntableDeck } from '../components/mehfil/TurntableDeck';
import { CassetteDeck } from '../components/mehfil/CassetteDeck';
import { MandalaVisualizer } from '../components/mehfil/MandalaVisualizer';
import { TrackRow } from '../components/music/TrackRow';
import {
  Disc,
  Radio,
  Sparkles,
  Clock,
  Heart,
  Copy,
  Check,
  Compass,
  Play,
} from 'lucide-react';

interface MehfilViewProps {
  onSelectTrack: (track: Track) => void;
}

export const MehfilView: React.FC<MehfilViewProps> = ({ onSelectTrack }) => {
  const { currentTrack, playTrack } = useAudio();
  const [deckMode, setDeckMode] = useState<DeckMode>('turntable');
  const [selectedRasa, setSelectedRasa] = useState<NavarasaId>('shringara');
  const [copiedQuote, setCopiedQuote] = useState(false);

  // Live time cycle calculation
  const currentPrahar: PraharData = useMemo(() => getCurrentPrahar(), []);

  // Filtered tracks for current time period
  const praharTracks = useMemo(() => {
    return TRACKS.filter((t) => currentPrahar.recommendedTrackIds.includes(t.id));
  }, [currentPrahar]);

  // Selected emotional rasa data and tracks
  const rasaData: NavarasaData = NAVARASA_DATA[selectedRasa];
  const rasaTracks = useMemo(() => {
    return TRACKS.filter((t) => rasaData.trackIds.includes(t.id));
  }, [rasaData]);

  // Current lyric snippet for the Quote Card
  const currentLyric = useMemo(() => {
    if (!currentTrack || !currentTrack.lyrics || currentTrack.lyrics.length === 0) {
      return {
        text: 'You alone are my destination, you alone my lifelong companion...',
        translation: 'Tu hi meri manzil, tu hi mera humsafar...',
      };
    }
    return currentTrack.lyrics[0];
  }, [currentTrack]);

  const handleCopyQuote = () => {
    if (!currentTrack) return;
    const textToCopy = `"${currentLyric.text}"\n— ${currentTrack.title} (${currentTrack.artist})\n\nListened on GaanaSuno 🪔`;
    navigator.clipboard?.writeText(textToCopy);
    setCopiedQuote(true);
    setTimeout(() => setCopiedQuote(false), 2200);
  };

  const handlePlayPraharPlaylist = () => {
    if (praharTracks.length > 0) {
      playTrack(praharTracks[0], praharTracks);
    }
  };

  return (
    <div className="space-y-10 pb-20 animate-fade-in select-none">
      {/* 1. Time Cycle Atmosphere Banner */}
      <div className="relative overflow-hidden rounded-[2.5rem] p-6 sm:p-10 bg-gradient-to-br from-surface via-surface-subtle to-surface border border-border shadow-xl">
        {/* Ambient atmospheric glow */}
        <div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-[140px] pointer-events-none"
          style={{ backgroundColor: currentPrahar.glowColor }}
        />

        <div className="relative z-10 max-w-4xl">
          {/* Cycle Badge & Live Time */}
          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 text-accent text-xs font-bold uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5" />
              <span>{currentPrahar.name} ({currentPrahar.englishTitle})</span>
            </div>
            <span className="text-xs font-mono text-foreground-muted bg-surface-subtle px-2.5 py-1 rounded-full border border-border">
              {currentPrahar.timeRange}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-foreground tracking-tight leading-tight">
            The Acoustic Listening Lounge
          </h1>
          <p className="text-sm sm:text-base text-foreground-muted mt-2 font-medium">
            {currentPrahar.description}
          </p>

          {/* Raga Recommendation & Classical Couplet */}
          <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-surface-subtle border border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Recommended Ragas for this Hour:</span>
                <span className="text-foreground font-semibold">{currentPrahar.ragas.join(', ')}</span>
              </div>
              <p className="text-sm italic text-foreground font-medium">
                "{currentPrahar.couplet.english}"
              </p>
              <p className="text-xs text-foreground-muted">
                — {currentPrahar.couplet.poet}
              </p>
            </div>

            <button
              type="button"
              onClick={handlePlayPraharPlaylist}
              className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-accent-foreground font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Play Period Ragas</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Procedural Acoustic Tanpura Drone Bar */}
      <TanpuraBar />

      {/* 3. Tactile Analog Deck Controls & View */}
      <div className="space-y-4">
        {/* Deck Mode Selector Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 bg-surface p-1.5 rounded-2xl border border-border shadow-sm">
            <button
              type="button"
              onClick={() => setDeckMode('turntable')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                deckMode === 'turntable'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-foreground-muted hover:text-foreground hover:bg-surface-subtle'
              }`}
            >
              <Disc className="w-4 h-4" />
              <span>Sitar Turntable</span>
            </button>

            <button
              type="button"
              onClick={() => setDeckMode('cassette')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                deckMode === 'cassette'
                  ? 'bg-stone-800 text-amber-400 border border-stone-600 shadow-md'
                  : 'text-foreground-muted hover:text-foreground hover:bg-surface-subtle'
              }`}
            >
              <Radio className="w-4 h-4" />
              <span>Vintage Cassette Deck</span>
            </button>

            <button
              type="button"
              onClick={() => setDeckMode('mandala')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                deckMode === 'mandala'
                  ? 'bg-purple-800 text-amber-300 border border-purple-600 shadow-md'
                  : 'text-foreground-muted hover:text-foreground hover:bg-surface-subtle'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Spectral Mandala</span>
            </button>
          </div>

          <span className="text-xs font-mono text-foreground-muted hidden sm:inline">
            Tactile Analog Master Player
          </span>
        </div>

        {/* Selected Deck Output */}
        {deckMode === 'turntable' && (
          <TurntableDeck track={currentTrack} onSelectTrack={onSelectTrack} />
        )}
        {deckMode === 'cassette' && <CassetteDeck track={currentTrack} />}
        {deckMode === 'mandala' && <MandalaVisualizer track={currentTrack} />}
      </div>

      {/* 4. Highlight & Lyrics Quote Card */}
      {currentTrack && (
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-surface border border-border shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="space-y-2 max-w-2xl">
              <span className="text-[11px] font-bold uppercase tracking-wider text-accent flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 fill-current text-rose-500" />
                Featured Lyrics & Status Quote
              </span>
              <p className="text-xl sm:text-2xl font-serif italic text-foreground leading-snug">
                "{currentLyric.translation || currentLyric.text}"
              </p>
              <p className="text-xs text-foreground-muted font-medium">
                — {currentTrack.title} ({currentTrack.artist})
              </p>
            </div>

            <button
              type="button"
              onClick={handleCopyQuote}
              className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-subtle hover:bg-surface-hover border border-border text-foreground font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
            >
              {copiedQuote ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-500 font-bold">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-accent" />
                  <span>Copy Quote Card</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* 5. Emotional Sound Compass */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent mb-1">
              <Compass className="w-3.5 h-3.5" />
              <span>Aesthetic Moods</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Emotional Sound Compass
            </h2>
            <p className="text-xs sm:text-sm text-foreground-muted">
              Classical emotional archetypes mapped to timeless melodies
            </p>
          </div>
        </div>

        {/* 7 Rasa Pills Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {(Object.keys(NAVARASA_DATA) as NavarasaId[]).map((rasaId) => {
            const data = NAVARASA_DATA[rasaId];
            const isSelected = selectedRasa === rasaId;
            return (
              <button
                key={rasaId}
                type="button"
                onClick={() => setSelectedRasa(rasaId)}
                className={`flex flex-col p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-surface border-accent shadow-md ring-2 ring-accent/30'
                    : 'bg-surface hover:bg-surface-hover border-border'
                }`}
              >
                <span
                  className="w-3 h-3 rounded-full mb-2"
                  style={{ backgroundColor: data.color }}
                />
                <span className="font-extrabold text-sm text-foreground">
                  {data.name}
                </span>
                <span className="text-[10px] text-foreground-muted mt-1 line-clamp-1">
                  {data.englishMeaning}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Rasa Description & Track Collection */}
        <div className="p-5 sm:p-6 rounded-3xl bg-surface border border-border shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
            <div>
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <span>{rasaData.name}</span>
                <span className="text-xs font-mono text-foreground-muted">
                  ({rasaData.englishMeaning})
                </span>
              </h3>
              <p className="text-xs text-foreground-muted mt-0.5">
                {rasaData.englishMeaning} — Curated harmonious melodies
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                if (rasaTracks.length > 0) playTrack(rasaTracks[0], rasaTracks);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-accent-foreground font-bold text-xs uppercase tracking-wider transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md self-start sm:self-auto"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Play All {rasaTracks.length} Songs</span>
            </button>
          </div>

          {/* Tracks List */}
          <div className="space-y-1">
            {rasaTracks.map((tr, idx) => (
              <TrackRow
                key={tr.id}
                track={tr}
                index={idx}
                queueContext={rasaTracks}
                onOpenDetail={onSelectTrack}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
