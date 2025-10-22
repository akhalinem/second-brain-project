import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  useColorScheme,
} from 'react-native';

interface PlaybackControlsProps {
  /** ID of this recording */
  recordingId: string;
  /** URI of the audio file */
  uri: string;
  /** Total duration in milliseconds */
  duration: number;
  /** Whether this recording is currently active (playing or loaded) */
  isActive: boolean;
  /** Whether audio is currently playing */
  isPlaying: boolean;
  /** Current position in milliseconds */
  position: number;
  /** Whether the player is loading this audio */
  isLoading: boolean;
  /** Callback when play/pause is pressed */
  onPlayPause: (recordingId: string, uri: string) => void;
}

/**
 * Playback controls component for audio recordings
 * Displays play/pause button, progress bar, and time labels
 */
export function PlaybackControls({
  recordingId,
  uri,
  duration,
  isActive,
  isPlaying,
  position,
  isLoading,
  onPlayPause,
}: PlaybackControlsProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  /**
   * Format milliseconds to MM:SS
   */
  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  /**
   * Calculate progress percentage
   */
  const progressPercentage = isActive && duration > 0 
    ? Math.min((position / duration) * 100, 100)
    : 0;

  return (
    <View style={styles.container}>
      {/* Play/Pause Button */}
      <TouchableOpacity
        style={[styles.playButton, isDark && styles.playButtonDark]}
        onPress={() => onPlayPause(recordingId, uri)}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color={isDark ? '#0A84FF' : '#007AFF'} />
        ) : (
          <Text style={[styles.playIcon, isDark && styles.playIconDark]}>
            {isPlaying && isActive ? '⏸' : '▶'}
          </Text>
        )}
      </TouchableOpacity>

      {/* Progress Container */}
      <View style={styles.progressContainer}>
        {/* Progress Bar */}
        <View style={[styles.progressTrack, isDark && styles.progressTrackDark]}>
          <View
            style={[
              styles.progressFill,
              isDark && styles.progressFillDark,
              { width: `${progressPercentage}%` },
            ]}
          />
        </View>

        {/* Time Labels */}
        <View style={styles.timeContainer}>
          <Text style={[styles.timeText, isDark && styles.timeTextDark]}>
            {isActive ? formatTime(position) : formatTime(0)}
          </Text>
          <Text style={[styles.timeText, isDark && styles.timeTextDark]}>
            {formatTime(duration)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  playButtonDark: {
    backgroundColor: '#2C2C2E',
  },
  playIcon: {
    fontSize: 18,
    color: '#007AFF',
  },
  playIconDark: {
    color: '#0A84FF',
  },
  progressContainer: {
    flex: 1,
  },
  progressTrack: {
    height: 3,
    backgroundColor: '#E5E5EA',
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  progressTrackDark: {
    backgroundColor: '#3A3A3C',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 1.5,
  },
  progressFillDark: {
    backgroundColor: '#0A84FF',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  timeText: {
    fontSize: 12,
    color: '#8E8E93',
    fontVariant: ['tabular-nums'],
  },
  timeTextDark: {
    color: '#98989D',
  },
});
