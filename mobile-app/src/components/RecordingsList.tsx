import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  useColorScheme,
  Animated,
  Pressable,
} from 'react-native';
import { Recording } from '../types/recording';

interface RecordingsListProps {
  recordings: Recording[];
  onDelete: (id: string) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
}

/**
 * List component displaying recent recordings
 */
export function RecordingsList({
  recordings,
  onDelete,
  onRefresh,
  refreshing = false,
}: RecordingsListProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const isToday = date.toDateString() === now.toDateString();
    
    // Just now / minutes ago
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    // Today with contextual labels
    if (isToday) {
      const hour = date.getHours();
      if (diffHours < 3) return `${diffHours}h ago`;
      if (hour < 12) return 'This morning';
      if (hour < 17) return 'This afternoon';
      return 'Earlier today';
    }
    
    // Yesterday
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    // This week
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'long' });
    }
    
    // Older
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const formatDuration = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Thought',
      'Are you sure you want to delete this thought?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete(id),
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Recording }) => (
    <Pressable
      style={({ pressed }) => [
        styles.itemContainer,
        isDark && styles.itemContainerDark,
        pressed && styles.itemPressed,
      ]}
      onLongPress={() => handleDelete(item.id)}
    >
      <View style={styles.itemContent}>
        {/* Thought icon */}
        <View style={[styles.iconContainer, isDark && styles.iconContainerDark]}>
          <Text style={styles.thoughtIcon}>💭</Text>
        </View>

        {/* Thought info */}
        <View style={styles.itemInfo}>
          <Text style={[styles.itemTitle, isDark && styles.itemTitleDark]} numberOfLines={2}>
            {item.title || 'Captured thought'}
          </Text>
          <Text style={[styles.itemMeta, isDark && styles.itemMetaDark]}>
            {formatDate(item.createdAt)} · {formatDuration(item.duration)}
          </Text>
        </View>

        {/* Delete button */}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.deleteIcon}>✕</Text>
        </TouchableOpacity>
      </View>
    </Pressable>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={[styles.emptyIcon, isDark && styles.emptyIconDark]}>
        <Text style={styles.emptyIconText}>💭</Text>
      </View>
      <Text style={[styles.emptyTitle, isDark && styles.emptyTitleDark]}>Your thoughts live here</Text>
      <Text style={[styles.emptyText, isDark && styles.emptyTextDark]}>
        Capture fleeting ideas before they disappear.{'\n'}
        Your mind is for having ideas, not holding them.
      </Text>
    </View>
  );

  return (
    <FlatList
      data={recordings}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={[
        styles.listContent,
        recordings.length === 0 && styles.listContentEmpty,
      ]}
      ListEmptyComponent={renderEmpty}
      onRefresh={onRefresh}
      refreshing={refreshing}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  listContentEmpty: {
    flex: 1,
  },
  itemContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  itemContainerDark: {
    backgroundColor: '#1C1C1E',
    shadowOpacity: 0.3,
  },
  itemPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconContainerDark: {
    backgroundColor: '#2C2C2E',
  },
  thoughtIcon: {
    fontSize: 28,
  },
  itemInfo: {
    flex: 1,
    marginRight: 8,
  },
  itemTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
    lineHeight: 22,
  },
  itemTitleDark: {
    color: '#FFFFFF',
  },
  itemMeta: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 18,
  },
  itemMetaDark: {
    color: '#98989D',
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteIcon: {
    fontSize: 18,
    color: '#8E8E93',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyIconDark: {
    backgroundColor: '#2C2C2E',
  },
  emptyIconText: {
    fontSize: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyTitleDark: {
    color: '#FFFFFF',
  },
  emptyText: {
    fontSize: 17,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 24,
  },
  emptyTextDark: {
    color: '#98989D',
  },
});
