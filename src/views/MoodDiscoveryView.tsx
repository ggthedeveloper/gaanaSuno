import React, { useState } from 'react';
import { MoodTag, Track, Playlist, MoodOption } from '../types/music';
import { MOOD_OPTIONS } from '../data/catalog';
import { getRecommendationsByMood } from '../services/recommendation';
import { TrackRow } from '../components/music/TrackRow';
import { PlaylistCard } from '../components/music/PlaylistCard';
import { useAudio } from '../context/AudioContext';
import { Sparkles, Play, Shuffle, Info, Activity } from 'lucide-react';

interface MoodDiscoveryViewProps {
  initialMood?: MoodOption;
  onSelectPlaylist: (playlist: Playlist) => void;
  onSelectTrack: (track: Track) => void;
}

export const MoodDiscoveryView: React.FC<MoodDiscoveryViewProps> = ({
  initialMood,
  onSelectPlaylist,
  onSelectTrack,
}) => {
  const [selectedMood, setSelectedMood] = useState<MoodTag>(initialMood?.id || 'romantic');
  const [tempo, setTempo] = useState<'any' | 'slow' | 'medium' | 'fast'>('any');

  const { playTrack } = useAudio();

  const recommendation = getRecommendationsByMood({
    mood: selectedMood,
    tempoPreference: tempo,
  });

  const activeMoodMeta = MOOD_OPTIONS.find((m) => m.id === selectedMood) || MOOD_OPTIONS[0];

  const handlePlayAll = () => {
    if (recommendation.matchedTracks.length > 0) {
      playTrack(recommendation.matchedTracks[0], recommendation.matchedTracks);
    }
  };

  const handleShufflePlay = () => {
    if (recommendation.matchedTracks.length > 0) {
      const shuffled = [...recommendation.matchedTracks].sort(() => Math.random() - 0.5);
      playTrack(shuffled[0], shuffled);
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* Header Banner */}
      <div className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br ${activeMoodMeta.gradient} text-white shadow-2xl transition-all duration-500`}>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/30 backdrop-blur-md text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Mood Discovery Engine</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight drop-shadow-md">
            {activeMoodMeta.label}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-white/90 font-medium">
            {activeMoodMeta.tagline}
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <button
              type="button"
              onClick={handlePlayAll}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-bold text-sm shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-current ml-0.5" />
              <span>Play All Songs ({recommendation.matchedTracks.length})</span>
            </button>

            <button
              type="button"
              onClick={handleShufflePlay}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white font-semibold text-sm border border-white/20 transition-all hover:scale-105"
            >
              <Shuffle className="w-4 h-4" />
              <span>Shuffle</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mood Selector Question */}
      <section className="bg-surface/50 backdrop-blur-xl p-6 rounded-3xl border border-white/8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="font-extrabold text-base text-foreground flex items-center gap-2">
              <span>How are you feeling right now?</span>
              <span className="text-xs text-foreground-muted font-normal">
                (Pick your current emotional state)
              </span>
            </h3>
          </div>

          {/* Tempo Selector Filter */}
          <div className="flex items-center gap-1.5 text-xs text-foreground-muted">
            <Activity className="w-3.5 h-3.5 text-accent" />
            <span>Tempo:</span>
            {(['any', 'slow', 'medium', 'fast'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTempo(t)}
                className={`px-3 py-1 rounded-xl uppercase text-[10px] font-bold transition-all ${
                  tempo === t
                    ? 'bg-accent text-accent-foreground shadow-sm'
                    : 'bg-surface-subtle hover:bg-surface-hover text-foreground-muted'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* 8 Mood Pill Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {MOOD_OPTIONS.map((mood) => {
            const isSelected = selectedMood === mood.id;
            return (
              <button
                key={mood.id}
                type="button"
                onClick={() => setSelectedMood(mood.id)}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all hover:scale-[1.02] active:scale-95 ${
                  isSelected
                    ? 'bg-accent/15 border-accent text-accent shadow-lg shadow-accent/10'
                    : 'bg-surface hover:bg-surface-hover border-white/5 text-foreground hover:border-white/15'
                }`}
              >
                <span className="text-2xl filter drop-shadow">{mood.emoji}</span>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-xs truncate">{mood.label}</h4>
                  <p className="text-[11px] text-foreground-muted truncate font-medium">
                    {mood.tagline}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Transparent Methodology Disclosure Badge */}
      <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-surface-subtle border border-border/50 text-xs text-foreground-muted">
        <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
        <div>
          <strong className="text-foreground">Recommendation Methodology: </strong>
          Deterministic rule-based catalog matching. Tracks are filtered according to verified metadata tags, genre classification, and tempo tempo scores. No fabricated AI audio claims.
        </div>
      </div>

      {/* Recommended Songs Table */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-foreground">
            Recommended Songs for "{activeMoodMeta.label}" ({recommendation.matchedTracks.length})
          </h3>
        </div>

        <div className="bg-surface/60 rounded-2xl border border-border/50 divide-y divide-border/30 overflow-hidden">
          {recommendation.matchedTracks.map((track, idx) => (
            <TrackRow
              key={track.id}
              track={track}
              index={idx}
              queueContext={recommendation.matchedTracks}
              onOpenDetail={onSelectTrack}
            />
          ))}
        </div>
      </section>

      {/* Matching Curated Playlists */}
      {recommendation.recommendedPlaylists.length > 0 && (
        <section>
          <h3 className="text-lg font-bold text-foreground mb-3">
            Hand-Curated "{activeMoodMeta.label}" Playlists
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {recommendation.recommendedPlaylists.map((pl) => (
              <PlaylistCard
                key={pl.id}
                playlist={pl}
                onSelect={onSelectPlaylist}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
