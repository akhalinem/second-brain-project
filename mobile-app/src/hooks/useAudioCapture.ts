import { useEffect, useState } from 'react';
import {
  useAudioRecorder,
  useAudioRecorderState,
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
} from 'expo-audio';
import { Recording } from '../types/recording';
import { generateRecordingPath, saveRecording } from '../utils/storage';

export interface AudioCaptureState {
  /** Whether a recording is currently in progress */
  isRecording: boolean;
  /** Duration of current recording in milliseconds */
  duration: number;
  /** Whether recording permission has been granted */
  hasPermission: boolean | null;
  /** Whether the recorder is ready to record */
  canRecord: boolean;
}

export interface AudioCaptureActions {
  /** Start recording audio */
  startRecording: () => Promise<void>;
  /** Stop recording and save the audio */
  stopRecording: () => Promise<Recording | null>;
  /** Request microphone permissions */
  requestPermission: () => Promise<boolean>;
}

/**
 * Custom hook for audio recording functionality
 * Follows expo-audio SDK 54 current best practices
 */
export function useAudioCapture(): AudioCaptureState & AudioCaptureActions {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [recordingPath, setRecordingPath] = useState<string | null>(null);

  // Initialize audio recorder with high quality preset
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder);

  // Configure audio mode on mount
  useEffect(() => {
    configureAudioMode();
  }, []);

  /**
   * Configure audio mode for recording
   */
  async function configureAudioMode() {
    try {
      await setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });
    } catch (error) {
      console.error('Error configuring audio mode:', error);
    }
  }

  /**
   * Request microphone permission
   */
  async function requestPermission(): Promise<boolean> {
    try {
      const { granted } = await requestRecordingPermissionsAsync();
      setHasPermission(granted);
      return granted;
    } catch (error) {
      console.error('Error requesting permission:', error);
      setHasPermission(false);
      return false;
    }
  }

  /**
   * Start recording audio
   */
  async function startRecording(): Promise<void> {
    try {
      // Configure audio mode for recording (in case playback changed it)
      await configureAudioMode();
      
      // Check permission first
      if (hasPermission === null) {
        const granted = await requestPermission();
        if (!granted) {
          throw new Error('Recording permission not granted');
        }
      } else if (!hasPermission) {
        throw new Error('Recording permission not granted');
      }

      // Generate path for new recording
      const path = generateRecordingPath();
      setRecordingPath(path);

      // Prepare and start recording
      await recorder.prepareToRecordAsync();
      recorder.record();
    } catch (error) {
      console.error('Error starting recording:', error);
      throw error;
    }
  }

  /**
   * Stop recording and save the audio
   */
  async function stopRecording(): Promise<Recording | null> {
    try {
      if (!recorderState.isRecording) {
        return null;
      }

      // Stop the recording
      await recorder.stop();

      // Get the recording URI and duration
      const uri = recorder.uri;
      const duration = recorderState.durationMillis;

      if (!uri) {
        throw new Error('Recording URI is null');
      }

      // Create recording metadata
      const recording: Recording = {
        id: Date.now().toString(),
        uri,
        duration,
        createdAt: Date.now(),
      };

      // Save to storage
      await saveRecording(recording);

      // Reset path
      setRecordingPath(null);

      return recording;
    } catch (error) {
      console.error('Error stopping recording:', error);
      throw error;
    }
  }

  return {
    // State
    isRecording: recorderState.isRecording,
    duration: recorderState.durationMillis,
    hasPermission,
    canRecord: recorderState.canRecord,
    // Actions
    startRecording,
    stopRecording,
    requestPermission,
  };
}
