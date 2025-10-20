import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

interface RecordButtonProps {
  isRecording: boolean;
  duration: number;
  onPress: () => void;
  disabled?: boolean;
}

/**
 * Large, prominent button for recording audio
 * Shows recording state and duration
 */
export function RecordButton({
  isRecording,
  duration,
  onPress,
  disabled = false,
}: RecordButtonProps) {
  const formatDuration = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          isRecording && styles.buttonRecording,
          disabled && styles.buttonDisabled,
        ]}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <View style={[styles.innerCircle, isRecording && styles.innerCircleRecording]} />
      </TouchableOpacity>
      
      {isRecording && (
        <Text style={styles.duration}>{formatDuration(duration)}</Text>
      )}
      
      <Text style={styles.label}>
        {isRecording ? 'Tap to Stop' : 'Tap to Record'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  button: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  buttonRecording: {
    backgroundColor: '#FF3B30',
  },
  buttonDisabled: {
    backgroundColor: '#C7C7CC',
    opacity: 0.5,
  },
  innerCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
  },
  innerCircleRecording: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  duration: {
    marginTop: 16,
    fontSize: 28,
    fontWeight: '600',
    color: '#FF3B30',
    fontVariant: ['tabular-nums'],
  },
  label: {
    marginTop: 8,
    fontSize: 16,
    color: '#8E8E93',
  },
});
