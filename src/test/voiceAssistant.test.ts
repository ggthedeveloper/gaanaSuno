import { describe, it, expect, vi, beforeEach } from 'vitest';
import { parseVoiceCommand, VoiceAssistantCallbacks } from '../services/voiceAssistant';
import { TRACKS } from '../data/catalog';

describe('Sur-Vaani Voice Assistant Parser', () => {
  let mockCallbacks: VoiceAssistantCallbacks;

  beforeEach(() => {
    mockCallbacks = {
      playTrack: vi.fn(),
      togglePlay: vi.fn(),
      nextTrack: vi.fn(),
      previousTrack: vi.fn(),
      setVolume: vi.fn(),
      toggleMute: vi.fn(),
      onNavigate: vi.fn(),
      currentTrack: TRACKS[0],
      isPlaying: true,
      volume: 0.6,
    };
  });

  it('handles pause command in English and Hindi', () => {
    const res1 = parseVoiceCommand('pause', mockCallbacks);
    expect(res1.action).toBe('pause');
    expect(mockCallbacks.togglePlay).toHaveBeenCalled();

    mockCallbacks.isPlaying = true;
    const res2 = parseVoiceCommand('gaana roko', mockCallbacks);
    expect(res2.action).toBe('pause');
  });

  it('handles resume and play command', () => {
    mockCallbacks.isPlaying = false;
    const res = parseVoiceCommand('play', mockCallbacks);
    expect(res.action).toBe('resume');
    expect(mockCallbacks.togglePlay).toHaveBeenCalled();
  });

  it('handles next and previous track commands', () => {
    const nextRes = parseVoiceCommand('next song please', mockCallbacks);
    expect(nextRes.action).toBe('next');
    expect(mockCallbacks.nextTrack).toHaveBeenCalled();

    const prevRes = parseVoiceCommand('pichhla gaana lagao', mockCallbacks);
    expect(prevRes.action).toBe('previous');
    expect(mockCallbacks.previousTrack).toHaveBeenCalled();
  });

  it('handles volume up and down commands', () => {
    const volUp = parseVoiceCommand('awaaz badhao', mockCallbacks);
    expect(volUp.action).toBe('volume_up');
    expect(mockCallbacks.setVolume).toHaveBeenCalledWith(0.8);

    const volDown = parseVoiceCommand('volume down', mockCallbacks);
    expect(volDown.action).toBe('volume_down');
    expect(mockCallbacks.setVolume).toHaveBeenCalledWith(0.4);
  });

  it('handles Tanpura drone activation and deactivation', () => {
    const tanpuraOn = parseVoiceCommand('tanpura shuru karo', mockCallbacks);
    expect(tanpuraOn.action).toBe('tanpura_on');

    const tanpuraOff = parseVoiceCommand('tanpura off', mockCallbacks);
    expect(tanpuraOff.action).toBe('tanpura_off');
  });

  it('handles navigation to Mehfil and Search', () => {
    const mehfil = parseVoiceCommand('mehfil lounge kholo', mockCallbacks);
    expect(mehfil.action).toBe('navigate');
    expect(mockCallbacks.onNavigate).toHaveBeenCalledWith('mehfil');

    const search = parseVoiceCommand('search kholo', mockCallbacks);
    expect(search.action).toBe('navigate');
    expect(mockCallbacks.onNavigate).toHaveBeenCalledWith('search');
  });

  it('searches and plays a specific track by name', () => {
    const playKesariya = parseVoiceCommand('Kesariya bajao', mockCallbacks);
    expect(playKesariya.action).toBe('play_track');
    expect(playKesariya.targetTrack?.title).toMatch(/Kesariya/i);
    expect(mockCallbacks.playTrack).toHaveBeenCalled();
  });

  it('searches and plays by artist name', () => {
    const playArijit = parseVoiceCommand('Arijit Singh ke gaane chalao', mockCallbacks);
    expect(playArijit.action).toBe('play_artist');
    expect(playArijit.targetTrack?.artist).toMatch(/Arijit/i);
    expect(mockCallbacks.playTrack).toHaveBeenCalled();
  });

  it('searches and plays by mood', () => {
    const playRomantic = parseVoiceCommand('romantic gaane sunao', mockCallbacks);
    expect(playRomantic.action).toBe('play_mood');
    expect(mockCallbacks.playTrack).toHaveBeenCalled();
  });
});
