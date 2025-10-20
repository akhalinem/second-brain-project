import AsyncStorage from '@react-native-async-storage/async-storage';
import { File, Paths } from 'expo-file-system';
import { Recording } from '../types/recording';

const RECORDINGS_KEY = '@second_brain:recordings';

/**
 * Get all recordings metadata from storage
 */
export async function getRecordings(): Promise<Recording[]> {
  try {
    const data = await AsyncStorage.getItem(RECORDINGS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading recordings:', error);
    return [];
  }
}

/**
 * Save a new recording metadata to storage
 */
export async function saveRecording(recording: Recording): Promise<void> {
  try {
    const recordings = await getRecordings();
    recordings.unshift(recording); // Add to beginning of list
    await AsyncStorage.setItem(RECORDINGS_KEY, JSON.stringify(recordings));
  } catch (error) {
    console.error('Error saving recording:', error);
    throw error;
  }
}

/**
 * Delete a recording and its audio file
 */
export async function deleteRecording(id: string): Promise<void> {
  try {
    const recordings = await getRecordings();
    const recording = recordings.find((r) => r.id === id);
    
    if (recording) {
      // Delete audio file
      const file = new File(recording.uri);
      if (file.exists) {
        file.delete();
      }
      
      // Remove from metadata
      const updated = recordings.filter((r) => r.id !== id);
      await AsyncStorage.setItem(RECORDINGS_KEY, JSON.stringify(updated));
    }
  } catch (error) {
    console.error('Error deleting recording:', error);
    throw error;
  }
}

/**
 * Generate a file path for a new recording
 */
export function generateRecordingPath(): string {
  const timestamp = Date.now();
  const filename = `recording_${timestamp}.m4a`;
  const file = new File(Paths.document, filename);
  return file.uri;
}
