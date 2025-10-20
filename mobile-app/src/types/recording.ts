/**
 * Represents a recorded audio thought/note
 */
export interface Recording {
  /** Unique identifier for the recording */
  id: string;
  /** File URI where the audio is stored */
  uri: string;
  /** Duration of the recording in milliseconds */
  duration: number;
  /** Timestamp when the recording was created */
  createdAt: number;
  /** Optional title/name for the recording */
  title?: string;
}
