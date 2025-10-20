import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, SafeAreaView, Alert, useColorScheme, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { RecordButton } from '../components/RecordButton';
import { RecordingsList } from '../components/RecordingsList';
import { useAudioCapture } from '../hooks/useAudioCapture';
import { getRecordings, deleteRecording } from '../utils/storage';
import { Recording } from '../types/recording';

/**
 * Home screen - main interface for capturing thoughts
 * Audio-first design with prominent record button
 */
export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  
  const {
    isRecording,
    duration,
    hasPermission,
    canRecord,
    startRecording,
    stopRecording,
    requestPermission,
  } = useAudioCapture();

  // Load recordings on mount
  useEffect(() => {
    loadRecordings();
  }, []);

  /**
   * Load recordings from storage
   */
  const loadRecordings = async () => {
    try {
      const data = await getRecordings();
      setRecordings(data);
    } catch (error) {
      console.error('Error loading recordings:', error);
      Alert.alert('Error', 'Failed to load recordings');
    }
  };

  /**
   * Handle refresh pull
   */
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadRecordings();
    setRefreshing(false);
  }, []);

  /**
   * Handle record button press
   */
  const handleRecordPress = async () => {
    console.log('Record button pressed', { isRecording, hasPermission, canRecord });
    
    try {
      if (isRecording) {
        console.log('Stopping recording...');
        // Stop recording
        const recording = await stopRecording();
        if (recording) {
          console.log('Recording saved:', recording);
          // Reload list to show new recording
          await loadRecordings();
        }
      } else {
        console.log('Starting recording...');
        // Start recording
        if (hasPermission === false) {
          console.log('Permission denied');
          Alert.alert(
            'Permission Required',
            'Microphone access is required to record audio. Please grant permission in Settings.',
            [{ text: 'OK' }]
          );
          return;
        }
        
        if (hasPermission === null) {
          console.log('Requesting permission...');
          const granted = await requestPermission();
          if (!granted) {
            console.log('Permission not granted');
            return;
          }
        }
        
        console.log('Calling startRecording...');
        await startRecording();
        console.log('Recording started');
      }
    } catch (error) {
      console.error('Recording error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      Alert.alert(
        'Recording Error',
        `Failed to record audio: ${errorMessage}`
      );
    }
  };

  /**
   * Handle recording deletion
   */
  const handleDelete = async (id: string) => {
    try {
      await deleteRecording(id);
      await loadRecordings();
    } catch (error) {
      console.error('Error deleting recording:', error);
      Alert.alert('Error', 'Failed to delete recording');
    }
  };

  return (
    <SafeAreaView style={[styles.container, colorScheme === 'dark' && styles.containerDark]}>
      <StatusBar style="auto" />
      
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, colorScheme === 'dark' && styles.headerTitleDark]}>
            My Thoughts
          </Text>
          <Text style={[styles.headerSubtitle, colorScheme === 'dark' && styles.headerSubtitleDark]}>
            {recordings.length === 0 ? 'No thoughts yet' : recordings.length === 1 ? '1 thought saved' : `${recordings.length} thoughts saved`}
          </Text>
        </View>

        {/* Recordings list takes most of the space */}
        <View style={styles.listContainer}>
          <RecordingsList
            recordings={recordings}
            onDelete={handleDelete}
            onRefresh={handleRefresh}
            refreshing={refreshing}
          />
        </View>

        {/* Record button at bottom - always accessible */}
        <View style={[styles.recordContainer, colorScheme === 'dark' && styles.recordContainerDark]}>
          <RecordButton
            isRecording={isRecording}
            duration={duration}
            onPress={handleRecordPress}
            disabled={false}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  containerDark: {
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  headerTitleDark: {
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#8E8E93',
  },
  headerSubtitleDark: {
    color: '#98989D',
  },
  listContainer: {
    flex: 1,
  },
  recordContainer: {
    backgroundColor: '#F2F2F7',
    paddingBottom: 20,
  },
  recordContainerDark: {
    backgroundColor: '#000000',
  },
});
