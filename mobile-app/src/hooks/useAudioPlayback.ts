import { useEffect, useState, useCallback } from 'react';
import { useAudioPlayer, useAudioPlayerStatus, setAudioModeAsync } from 'expo-audio';

export interface AudioPlaybackState {
  /** Whether audio is currently playing */
  isPlaying: boolean;
  /** ID of the currently playing/loaded recording */
  currentRecordingId: string | null;
  /** Current playback position in milliseconds */
  position: number;
  /** Duration of current audio in milliseconds */
  duration: number;
  /** Whether the player is loading audio */
  isLoading: boolean;
}

export interface AudioPlaybackActions {
  /** Play or resume a recording */
  play: (recordingId: string, uri: string) => Promise<void>;
  /** Pause the current playback */
  pause: () => void;
  /** Stop playback and reset */
  stop: () => void;
}

/**
 * Custom hook for audio playback functionality
 * Uses expo-audio SDK 54 current API (useAudioPlayer, useAudioPlayerStatus)
 * 
 * Features:
 * - Single player instance (only one recording plays at a time)
 * - Automatic cleanup on unmount
 * - Position tracking in real-time
 * - Playback completion handling
 */
export function useAudioPlayback(): AudioPlaybackState & AudioPlaybackActions {
  const [currentRecordingId, setCurrentRecordingId] = useState<string | null>(null);
  const [currentUri, setCurrentUri] = useState<string | null>(null);
  
  // Initialize audio player with no source initially
  // Will be replaced when user taps play
  const player = useAudioPlayer(null, {
    updateInterval: 100, // Update position 10x per second for smooth UI
  });
  
  // Get real-time playback status
  const status = useAudioPlayerStatus(player);

  // Configure audio mode for playback
  useEffect(() => {
    configureAudioMode();
  }, []);

  /**
   * Configure audio mode for playback
   * Note: We allow recording to coexist since the app needs both capabilities
   */
  async function configureAudioMode() {
    try {
      await setAudioModeAsync({
        playsInSilentMode: true, // Play even when device is in silent mode
        allowsRecording: true,   // Allow recording to work alongside playback
      });
    } catch (error) {
      console.error('Error configuring audio mode:', error);
    }
  }

  /**
   * Handle playback completion
   * Reset to beginning so user can replay
   */
  useEffect(() => {
    if (status.didJustFinish) {
      // Audio finished playing - seek back to start
      // Note: expo-audio doesn't auto-reset, so we do it manually
      player.seekTo(0);
    }
  }, [status.didJustFinish, player]);

  /**
   * Play or resume a recording
   * If a different recording is requested, stop current and load new one
   */
  const play = useCallback(async (recordingId: string, uri: string) => {
    try {
      // If this is a different recording, replace the audio source
      if (recordingId !== currentRecordingId || uri !== currentUri) {
        // Replace the audio source
        player.replace(uri);
        setCurrentRecordingId(recordingId);
        setCurrentUri(uri);
        
        // Wait a brief moment for the player to load
        // The status.isLoaded will become true when ready
      }

      // Start or resume playback
      player.play();
    } catch (error) {
      console.error('Error playing audio:', error);
      // Reset state on error
      setCurrentRecordingId(null);
      setCurrentUri(null);
    }
  }, [currentRecordingId, currentUri, player]);

  /**
   * Pause the current playback
   */
  const pause = useCallback(() => {
    try {
      player.pause();
    } catch (error) {
      console.error('Error pausing audio:', error);
    }
  }, [player]);

  /**
   * Stop playback and reset
   */
  const stop = useCallback(() => {
    try {
      player.pause();
      player.seekTo(0);
      setCurrentRecordingId(null);
      setCurrentUri(null);
    } catch (error) {
      console.error('Error stopping audio:', error);
    }
  }, [player]);

  return {
    // State
    isPlaying: status.playing,
    currentRecordingId,
    position: status.currentTime * 1000, // Convert seconds to milliseconds
    duration: status.duration * 1000,    // Convert seconds to milliseconds
    isLoading: !status.isLoaded && currentRecordingId !== null,
    
    // Actions
    play,
    pause,
    stop,
  };
}
