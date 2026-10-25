import React from 'react';
import { Artist, Track } from '../types/music';
import { TRACKS, ALBUMS } from '../data/catalog';
import { TrackRow } from '../components/music/TrackRow';
import { useAudio } from '../context/AudioContext';
import { Play, ArrowLeft, Users, Disc } from 'lucide-react';

interface ArtistDetailViewProps {
  artist: Artist;
  onBack: () => void;
  onSelectTrack: (track: Track) => void;
}

export const ArtistDetailView: React.FC<ArtistDetailViewProps> = ({
  artist,
  onBack,
  onSelectTrack,
}) => {
  const { playTrack } = useAudio();

  // Find all tracks matching this artist name
  const artistTracks = TRACKS.filter(
    (t) =>
      t.artist.toLowerCase().includes(artist.name.toLowerCase()) ||
      artist.popularTrackIds.includes(t.id)
  );

  const artistAlbums = ALBUMS.filter((alb) =>
    alb.artist.toLowerCase().includes(artist.name.toLowerCase())
  );

  const handlePlayArtist = () => {
    if (artistTracks.length > 0) {
      playTrack(artistTracks[0], artistTracks);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground-muted hover:text-foreground transition-colors py-1"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back (वापस जाएं)</span>
      </button>

      {/* Artist Hero Banner */}
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 p-6 sm:p-8 rounded-3xl bg-surface/70 border border-border/60 shadow-xl">
        <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden shadow-2xl shrink-0 border-4 border-border/50">
          <img
            src={artist.imageUrl}
            alt={artist.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="min-w-0 flex-1 text-center md:text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-accent bg-accent/15 px-2.5 py-1 rounded-full">
            Verified Indian Artist
          </span>

          <h2 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight mt-3">
            {artist.name}
          </h2>

          <p className="text-base sm:text-lg font-hindi text-foreground-muted mt-0.5">
            {artist.nameDevanagari} • {artist.role}
          </p>

          <p className="text-xs sm:text-sm text-foreground-muted mt-2 max-w-xl leading-relaxed">
            {artist.bio}
          </p>

          <div className="flex items-center justify-center md:justify-start gap-2 text-xs text-foreground-subtle mt-3">
            <Users className="w-3.5 h-3.5 text-accent" />
            <span className="font-semibold text-foreground">{artist.monthlyListeners}</span>
            <span>monthly listeners</span>
          </div>

          <div className="mt-5">
            <button
              type="button"
              disabled={artistTracks.length === 0}
              onClick={handlePlayArtist}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-accent text-accent-foreground font-bold text-sm shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 transition-all"
            >
              <Play className="w-4 h-4 fill-current ml-0.5" />
              <span>Play All Tracks ({artistTracks.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Popular Songs */}
      <section>
        <h3 className="text-lg font-bold text-foreground mb-3">
          Popular Songs by {artist.name}
        </h3>

        <div className="bg-surface/60 rounded-2xl border border-border/50 divide-y divide-border/30 overflow-hidden">
          {artistTracks.map((track, idx) => (
            <TrackRow
              key={track.id}
              track={track}
              index={idx}
              queueContext={artistTracks}
              onOpenDetail={onSelectTrack}
            />
          ))}
        </div>
      </section>

      {/* Discography / Albums */}
      {artistAlbums.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Disc className="w-4 h-4 text-accent" />
            <h3 className="text-lg font-bold text-foreground">
              Discography & Albums
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {artistAlbums.map((alb) => (
              <div
                key={alb.id}
                className="p-3 rounded-2xl bg-surface/60 border border-border/40 hover:border-border transition-all"
              >
                <img
                  src={alb.coverUrl}
                  alt={alb.title}
                  className="w-full aspect-square object-cover rounded-xl shadow-md"
                />
                <h4 className="font-bold text-sm text-foreground truncate mt-2">
                  {alb.title}
                </h4>
                <p className="text-xs text-foreground-muted">{alb.year} • {alb.genre}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
