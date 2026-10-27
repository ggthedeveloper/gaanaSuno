import React, { useState, useEffect, useRef } from 'react';
import { useAudio } from '../../context/AudioContext';
import { NavRoute } from '../layout/Sidebar';
import {
  parseVoiceCommand,
  speakResponse,
  VoiceCommandResult,
} from '../../services/voiceAssistant';
import { Mic, Sparkles, X, Send } from 'lucide-react';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: NavRoute) => void;
}

const VOICE_PROMPT_SUGGESTIONS = [
  { label: 'Play Kesariya', query: 'Play Kesariya' },
  { label: 'Play Arijit Singh', query: 'Play Arijit Singh' },
  { label: 'Start Tanpura Drone', query: 'Start Tanpura' },
  { label: 'Play Romantic Songs', query: 'Play romantic songs' },
  { label: 'Open Lounge', query: 'Open Lounge' },
  { label: 'Next Song', query: 'Next song' },
  { label: 'Volume Up', query: 'Volume up' },
];

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const {
    currentTrack,
    isPlaying,
    volume,
    playTrack,
    togglePlay,
    nextTrack,
    previousTrack,
    setVolume,
    toggleMute,
  } = useAudio();

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastResponse, setLastResponse] = useState<VoiceCommandResult | null>(null);
  const [selectedLang, setSelectedLang] = useState<'en-IN' | 'hi-IN'>('en-IN');
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  const [manualInput, setManualInput] = useState('');

  const recognitionRef = useRef<any>(null);

  // Initialize SpeechRecognition
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRec) {
      setIsSpeechSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = selectedLang;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);

        // If speech recognition marked final result
        if (event.results[0]?.isFinal) {
          executeCommand(currentTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (e) {
      console.warn('Speech recognition setup note:', e);
      setIsSpeechSupported(false);
    }
  }, [selectedLang]);

  // Start listening automatically when modal opens if supported
  useEffect(() => {
    if (isOpen) {
      setTranscript('');
      setLastResponse(null);
      startListening();
    } else {
      stopListening();
    }
  }, [isOpen]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        setTranscript('');
        recognitionRef.current.lang = selectedLang;
        recognitionRef.current.start();
      } catch (e) {
        console.warn('Start listening error:', e);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch {}
      setIsListening(false);
    }
  };

  const executeCommand = (cmdText: string) => {
    if (!cmdText.trim()) return;

    const result = parseVoiceCommand(cmdText, {
      playTrack,
      togglePlay,
      nextTrack,
      previousTrack,
      setVolume,
      toggleMute,
      onNavigate: (route) => {
        onNavigate(route);
        onClose();
      },
      currentTrack,
      isPlaying,
      volume,
    });

    setLastResponse(result);
    // Speak out response in Hindi or English
    speakResponse(
      selectedLang === 'hi-IN' ? result.speechResponseDevanagari : result.speechResponse,
      selectedLang
    );
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    setTranscript(manualInput);
    executeCommand(manualInput);
    setManualInput('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in select-none">
      <div className="relative w-full max-w-lg rounded-[2.5rem] bg-gradient-to-br from-surface via-[#181310] to-surface border-2 border-amber-500/30 p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden">
        {/* Ambient Saffron Glow Orb */}
        <div className="absolute top-0 right-1/4 -mt-20 w-72 h-72 rounded-full bg-amber-500/15 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-20 w-72 h-72 rounded-full bg-rose-500/15 blur-[100px] pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-foreground-muted hover:text-foreground hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Assistant Header */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-500 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sur-Vaani • Voice AI Assistant</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            How can I serenade you today?
          </h2>
          <p className="text-xs sm:text-sm text-foreground-muted font-medium">
            Ask to play any song, artist, mood, or control playback.
          </p>
        </div>

        {/* Language Toggle */}
        <div className="mt-4 flex justify-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedLang('en-IN')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              selectedLang === 'en-IN'
                ? 'bg-amber-500 text-black shadow-md'
                : 'bg-surface-subtle text-foreground-muted hover:text-foreground'
            }`}
          >
            English (Global & Indian)
          </button>
          <button
            type="button"
            onClick={() => setSelectedLang('hi-IN')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              selectedLang === 'hi-IN'
                ? 'bg-amber-500 text-black shadow-md'
                : 'bg-surface-subtle text-foreground-muted hover:text-foreground'
            }`}
          >
            Hindi (Hinglish)
          </button>
        </div>

        {/* Center: Glowing Animated Voice Orb & Microphone Button */}
        <div className="my-8 flex flex-col items-center justify-center">
          <div className="relative flex items-center justify-center">
            {/* Concentric soundwave pulse rings */}
            {isListening && (
              <>
                <span className="absolute w-36 h-36 rounded-full bg-amber-500/20 animate-ping" />
                <span
                  className="absolute w-28 h-28 rounded-full bg-orange-500/30 animate-pulse"
                  style={{ animationDuration: '1.2s' }}
                />
              </>
            )}

            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl cursor-pointer hover:scale-105 active:scale-95 ${
                isListening
                  ? 'bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-600 text-white shadow-amber-500/50 ring-4 ring-amber-400'
                  : 'bg-surface-subtle border-2 border-amber-500/40 text-amber-500 dark:text-amber-400 hover:border-amber-400'
              }`}
            >
              {isListening ? (
                <Mic className="w-10 h-10 animate-bounce" />
              ) : (
                <Mic className="w-10 h-10" />
              )}
            </button>
          </div>

          {/* Status Label */}
          <p className="mt-4 text-xs font-mono font-bold tracking-widest uppercase text-amber-500 dark:text-amber-400">
            {!isSpeechSupported
              ? 'Voice recognition unavailable in this browser (use text below)'
              : isListening
              ? 'Listening...'
              : 'Tap microphone to speak'}
          </p>
        </div>

        {/* Transcript or Assistant Response */}
        <div className="min-h-[70px] p-4 rounded-2xl bg-surface-subtle/80 border border-border flex flex-col items-center justify-center text-center">
          {transcript ? (
            <p className="text-sm sm:text-base font-semibold text-foreground italic">
              "{transcript}"
            </p>
          ) : lastResponse ? (
            <div className="space-y-1">
              <p className="text-sm font-bold text-foreground">
                {lastResponse.speechResponse}
              </p>
            </div>
          ) : (
            <p className="text-xs text-foreground-muted font-medium">
              Say e.g. "Play Kesariya", "Play Arijit Singh", "Romantic songs", or "Start Tanpura"
            </p>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="mt-5 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted block">
            Try saying:
          </span>
          <div className="flex flex-wrap gap-2">
            {VOICE_PROMPT_SUGGESTIONS.map((sug) => (
              <button
                key={sug.query}
                type="button"
                onClick={() => {
                  setTranscript(sug.query);
                  executeCommand(sug.query);
                }}
                className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-surface hover:bg-surface-hover border border-border hover:border-amber-500/40 text-foreground-muted hover:text-foreground transition-all cursor-pointer"
              >
                🎙️ {sug.label}
              </button>
            ))}
          </div>
        </div>

        {/* Fallback Text Input */}
        <form onSubmit={handleManualSubmit} className="mt-6 flex items-center gap-2">
          <input
            type="text"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            placeholder="Or type command e.g. 'Play Pasoori'..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-surface-subtle border border-white/10 text-xs sm:text-sm text-foreground placeholder:text-foreground-muted/60 focus:outline-none focus:border-amber-500"
          />
          <button
            type="submit"
            className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
