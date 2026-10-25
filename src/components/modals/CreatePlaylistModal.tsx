import React, { useState } from 'react';
import { useLibrary } from '../../context/LibraryContext';
import { Playlist } from '../../types/music';
import { X, Plus, Music2 } from 'lucide-react';

interface CreatePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlaylistCreated?: (playlist: Playlist) => void;
}

export const CreatePlaylistModal: React.FC<CreatePlaylistModalProps> = ({
  isOpen,
  onClose,
  onPlaylistCreated,
}) => {
  const { createPlaylist } = useLibrary();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newPl = createPlaylist(title.trim(), description.trim() || undefined);
    setTitle('');
    setDescription('');
    onClose();
    onPlaylistCreated?.(newPl);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Create Playlist"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in"
    >
      <div className="w-full max-w-md bg-surface border border-border shadow-2xl rounded-2xl p-6 relative">
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface-active transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center">
            <Music2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-foreground">
              Create New Playlist
            </h3>
            <p className="text-xs text-foreground-muted">
              Organize your favorite Hindi and Indian melodies into custom collections
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              Playlist Title *
            </label>
            <input
              type="text"
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Morning Chai Ragas, Midnight Indie, Roadtrip..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-subtle border border-border text-foreground text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Give your playlist a mood or memory description..."
              className="w-full px-3.5 py-2 rounded-xl bg-surface-subtle border border-border text-foreground text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/60">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-border text-xs font-semibold text-foreground-muted hover:text-foreground hover:bg-surface-hover transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-accent text-accent-foreground text-xs font-bold shadow-md hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create Playlist</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
