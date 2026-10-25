import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { useAudio } from '../context/AudioContext';
import { Playlist, Track } from '../types/music';
import { TrackRow } from '../components/music/TrackRow';
import { PlaylistCard } from '../components/music/PlaylistCard';
import { Heart, Plus, Clock, Music2, Trash2 } from 'lucide-react';

interface LibraryViewProps {
  onSelectPlaylist: (playlist: Playlist) => void;
  onSelectTrack: (track: Track) => void;
  onOpenCreatePlaylist: () => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  onSelectPlaylist,
  onSelectTrack,
  onOpenCreatePlaylist,
}) => {
  const {
    likedTracks,
    customPlaylists,
    recentlyPlayedTracks,
    deletePlaylist,
  } = useLibrary();

  const { playTrack } = useAudio();
  const [activeTab, setActiveTab] = useState<'all' | 'liked' | 'playlists' | 'recent'>('all');

  const handlePlayLiked = () => {
    if (likedTracks.length > 0) {
      playTrack(likedTracks[0], likedTracks);
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Your Library
          </h2>
          <p className="text-xs sm:text-sm text-foreground-muted mt-0.5">
            Liked tracks, custom collections, and playback history
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenCreatePlaylist}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-accent-foreground font-bold text-xs shadow-md hover:scale-105 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Playlist</span>
        </button>
      </div>

      {/* Tab Filter Chips */}
      <div className="flex items-center gap-2 border-b border-border pb-3">
        {(['all', 'liked', 'playlists', 'recent'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all capitalize ${
              activeTab === tab
                ? 'bg-accent text-accent-foreground shadow-sm'
                : 'bg-surface hover:bg-surface-hover border border-border text-foreground-muted'
            }`}
          >
            {tab === 'all'
              ? 'All Library'
              : tab === 'liked'
              ? `Liked Songs (${likedTracks.length})`
              : tab === 'playlists'
              ? `Playlists (${customPlaylists.length})`
              : 'Recent History'}
          </button>
        ))}
      </div>

      {/* Liked Songs Hero Banner (Visible in 'all' and 'liked' tabs) */}
      {(activeTab === 'all' || activeTab === 'liked') && (
        <section>
          <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-rose-600 via-pink-700 to-amber-700 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-lg border border-white/20">
                <Heart className="w-8 h-8 sm:w-10 sm:h-10 fill-current text-white" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-white/80">
                  Collection
                </span>
                <h3 className="text-xl sm:text-3xl font-black tracking-tight">
                  Liked Songs
                </h3>
                <p className="text-xs sm:text-sm text-white/80 mt-0.5">
                  {likedTracks.length} song{likedTracks.length !== 1 ? 's' : ''} saved to your heart
                </p>
              </div>
            </div>

            {likedTracks.length > 0 && (
              <button
                type="button"
                onClick={handlePlayLiked}
                className="px-6 py-2.5 rounded-full bg-white text-rose-600 font-bold text-sm shadow-xl hover:scale-105 active:scale-95 transition-all"
              >
                Play All Liked
              </button>
            )}
          </div>

          {/* Liked Songs List */}
          {likedTracks.length > 0 && (
            <div className="mt-4 bg-surface/60 rounded-2xl border border-border/50 divide-y divide-border/30 overflow-hidden">
              {likedTracks.map((track, idx) => (
                <TrackRow
                  key={track.id}
                  track={track}
                  index={idx}
                  queueContext={likedTracks}
                  onOpenDetail={onSelectTrack}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Custom Playlists Section */}
      {(activeTab === 'all' || activeTab === 'playlists') && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
              <Music2 className="w-4 h-4 text-accent" />
              <span>Your Custom Playlists ({customPlaylists.length})</span>
            </h3>
          </div>

          {customPlaylists.length === 0 ? (
            <div className="text-center py-12 bg-surface/40 rounded-2xl border border-border/50 p-6">
              <Music2 className="w-10 h-10 text-foreground-muted mx-auto mb-2 opacity-50" />
              <h4 className="font-bold text-sm text-foreground">
                No custom playlists yet
              </h4>
              <p className="text-xs text-foreground-muted mt-1 max-w-sm mx-auto">
                Group your favorite Hindi melodies into morning playlists, workout jams, or late-night study collections.
              </p>
              <button
                type="button"
                onClick={onOpenCreatePlaylist}
                className="mt-4 px-4 py-2 rounded-xl bg-accent text-accent-foreground text-xs font-bold hover:scale-105 transition-all"
              >
                Create Your First Playlist
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {customPlaylists.map((pl) => (
                <div key={pl.id} className="relative group">
                  <PlaylistCard
                    playlist={pl}
                    onSelect={onSelectPlaylist}
                  />
                  {/* Delete Playlist Button */}
                  <button
                    type="button"
                    aria-label={`Delete ${pl.title}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Delete playlist "${pl.title}"?`)) {
                        deletePlaylist(pl.id);
                      }
                    }}
                    className="absolute top-5 right-5 p-1.5 rounded-lg bg-black/60 text-white/80 hover:text-rose-500 hover:bg-black/90 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Recently Played Section */}
      {(activeTab === 'all' || activeTab === 'recent') && recentlyPlayedTracks.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-accent" />
            <h3 className="font-bold text-lg text-foreground">
              Recently Played History
            </h3>
          </div>

          <div className="bg-surface/60 rounded-2xl border border-border/50 divide-y divide-border/30 overflow-hidden">
            {recentlyPlayedTracks.map((track, idx) => (
              <TrackRow
                key={`${track.id}-${idx}`}
                track={track}
                index={idx}
                queueContext={recentlyPlayedTracks}
                onOpenDetail={onSelectTrack}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
