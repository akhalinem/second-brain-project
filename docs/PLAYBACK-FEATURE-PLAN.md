# Playback Feature Plan

**Status**: Planning Phase  
**Created**: October 23, 2025  
**Target**: Phase 1 - Core playback functionality

---

## 🎯 Overview

Add audio playback functionality to enable users to listen to their captured thoughts. This follows our audio-first philosophy and completes the capture-review cycle.

## 🎨 UX Design Principles

### Core Principles
1. **Simple & Intuitive**: Tap to play, tap to pause
2. **Visual Feedback**: Clear playback state indicators
3. **Non-Intrusive**: Doesn't overwhelm the recording list
4. **Familiar**: Uses standard audio player conventions
5. **Performant**: Instant play/pause response (< 200ms)

### User Flows

#### Primary Flow: Play from List
```
1. User sees recordings list
2. User taps on a recording card
3. Audio begins playing immediately
4. Visual indicator shows playback progress
5. User can pause/resume with same tap
6. Playback completes → auto-stop, visual reset
```

#### Secondary Flow: Quick Actions
```
- Swipe gesture → play/pause (future)
- Background playback → continue while browsing
- Scrubbing → seek to specific position (future)
```

## 🏗️ Technical Architecture

### 1. Custom Hook: `useAudioPlayback`

**Purpose**: Encapsulate all playback logic and state management

**Location**: `src/hooks/useAudioPlayback.ts`

**API Design**:
```typescript
interface AudioPlaybackState {
  isPlaying: boolean;
  currentRecordingId: string | null;
  position: number; // milliseconds
  duration: number; // milliseconds
  isLoading: boolean;
}

interface AudioPlaybackActions {
  play: (recordingId: string, uri: string) => Promise<void>;
  pause: () => Promise<void>;
  stop: () => Promise<void>;
  seekTo: (position: number) => Promise<void>; // future
}

export function useAudioPlayback(): AudioPlaybackState & AudioPlaybackActions
```

**Key Features**:
- ✅ Single audio player instance (only one recording plays at a time)
- ✅ Automatic cleanup on component unmount
- ✅ Position tracking with interval updates
- ✅ Playback completion handling
- ✅ Error handling and recovery
- ⏳ Background audio support (future)
- ⏳ Playback speed control (future)

**Implementation Details**:
```typescript
import { useEffect, useState, useRef } from 'react';
import { useAudioPlayer, AudioSource } from 'expo-audio';

// Use current expo-audio SDK 54 API
// useAudioPlayer hook for playback
// Auto-cleanup on unmount
// Position updates every 100ms during playback
```

### 2. Playback Controls Component

**Purpose**: Reusable playback UI controls

**Location**: `src/components/PlaybackControls.tsx`

**Props**:
```typescript
interface PlaybackControlsProps {
  recordingId: string;
  uri: string;
  duration: number;
  isActive: boolean; // Is this recording currently playing?
  onPlayPause: (recordingId: string) => void;
}
```

**Visual Design**:
```
┌─────────────────────────────────────┐
│  [▶/⏸]  [Progress Bar]  [Duration] │
└─────────────────────────────────────┘
```

**Elements**:
- Play/Pause button (40x40 touchable area)
- Progress bar (visual only for v1, seekable in v2)
- Current position / Total duration labels
- Loading indicator during audio loading

**States**:
- Idle: Show play button
- Loading: Show loading spinner
- Playing: Show pause button + animated progress
- Paused: Show play button with progress maintained
- Completed: Show play button, progress reset

### 3. Integration with RecordingsList

**Strategy**: Embed playback controls in each recording card

**Layout Changes**:
```
Before:
┌────────────────────────────────────┐
│ 💭  Captured thought               │
│     Yesterday · 1:23        ✕      │
└────────────────────────────────────┘

After:
┌────────────────────────────────────┐
│ 💭  Captured thought               │
│     Yesterday · 1:23        ✕      │
│     [▶] ━━━━━━━━━━━ 0:45 / 1:23   │
└────────────────────────────────────┘
```

**Interaction Model**:
- Tap on card body → expand/collapse playback controls
- Tap on play/pause → control playback
- Long press → existing delete behavior (unchanged)
- Delete button → existing delete behavior (unchanged)

### 4. State Management

**Approach**: Lift playback state to parent component

**HomeScreen manages**:
- Currently playing recording ID
- Playback state from `useAudioPlayback` hook
- Pass state down to RecordingsList

**Flow**:
```
HomeScreen
  ├─ useAudioPlayback() // Global playback state
  ├─ RecordingsList
  │   ├─ RecordingItem (recording 1)
  │   │   └─ PlaybackControls
  │   ├─ RecordingItem (recording 2)
  │   │   └─ PlaybackControls
  │   └─ ...
```

## 📦 Implementation Phases

### Phase 1: Core Playback (MVP)
**Timeline**: 1-2 development sessions

**Tasks**:
1. ✅ Create `useAudioPlayback` hook
   - Initialize audio player
   - Implement play/pause/stop
   - Track playback position
   - Handle completion

2. ✅ Create `PlaybackControls` component
   - Play/pause button
   - Progress bar (visual only)
   - Position/duration display
   - Loading state

3. ✅ Update `RecordingsList` component
   - Add expandable playback section
   - Pass playback state to controls
   - Handle play/pause interactions

4. ✅ Update `HomeScreen`
   - Integrate `useAudioPlayback` hook
   - Manage global playback state
   - Pass state to RecordingsList

5. ✅ Testing & Polish
   - Test multiple recordings
   - Verify cleanup on unmount
   - Test interruptions
   - Smooth animations

**Success Criteria**:
- ✅ Can play any recording from the list
- ✅ Only one recording plays at a time
- ✅ Visual feedback is clear and responsive
- ✅ No memory leaks or crashes
- ✅ Playback works offline

### Phase 2: Enhanced Controls (Future)
**Timeline**: Future iteration

**Features**:
- Seekable progress bar (scrubbing)
- Playback speed control (0.5x, 1x, 1.5x, 2x)
- Skip forward/backward (±15s buttons)
- Waveform visualization
- Mini-player for background playback

### Phase 3: Intelligence & UX (Future)
**Timeline**: Future iteration

**Features**:
- Auto-play next recording
- Queue management
- Smart playback (skip silence)
- Bookmark positions
- Share recording snippet

## 🔧 Technical Specifications

### Audio Player Configuration

```typescript
// expo-audio SDK 54 current API
import { useAudioPlayer, AudioSource } from 'expo-audio';

// Configuration
const player = useAudioPlayer(audioSource);
await player.play();
player.pause();
player.currentTime; // Position in seconds
player.duration; // Total duration in seconds
```

### Audio Mode Settings

```typescript
import { setAudioModeAsync } from 'expo-audio';

// Configure for playback
await setAudioModeAsync({
  playsInSilentMode: true, // Play even in silent mode
  allowsRecording: false,  // Playback mode
  interruptionMode: 'mixWithOthers', // Mix with other audio
});
```

### Performance Considerations

1. **Lazy Loading**: Only load audio when play is pressed
2. **Cleanup**: Release player resources on stop/unmount
3. **Single Instance**: Reuse same player for all recordings
4. **Position Updates**: Throttle to 100ms intervals (10 FPS)
5. **Memory**: Preload next recording (Phase 2)

### Error Handling

```typescript
try {
  await player.play();
} catch (error) {
  if (error.code === 'AUDIO_NOT_FOUND') {
    // Show error: Recording file missing
  } else if (error.code === 'PLAYBACK_FAILED') {
    // Show error: Playback failed
  }
  // Fallback: Reset UI to idle state
}
```

## 📱 Platform Considerations

### iOS
- Respects silent mode toggle (via `playsInSilentMode`)
- Control center integration (Phase 2)
- Lock screen controls (Phase 2)
- Background audio (Phase 2)

### Android
- Media session integration (Phase 2)
- Notification controls (Phase 2)
- Background audio (Phase 2)

## 🎨 Visual Design Specs

### Colors (Light Mode)
- Primary Action (Play): `#007AFF` (iOS blue)
- Progress Bar Track: `#E5E5EA`
- Progress Bar Fill: `#007AFF`
- Time Labels: `#8E8E93` (secondary text)

### Colors (Dark Mode)
- Primary Action (Play): `#0A84FF`
- Progress Bar Track: `#3A3A3C`
- Progress Bar Fill: `#0A84FF`
- Time Labels: `#98989D`

### Animations
- Play/Pause transition: 200ms ease-in-out
- Progress bar: Linear, updates 10x/second
- Expand/Collapse: 300ms spring animation
- Button press: Scale down to 0.95 (100ms)

## 🧪 Testing Strategy

### Unit Tests (Future)
- `useAudioPlayback` hook behavior
- Position tracking accuracy
- Cleanup on unmount
- Error handling

### Integration Tests (Future)
- Play → Pause → Resume flow
- Switch between recordings
- Delete while playing
- App backgrounding

### Manual Testing Checklist
- [ ] Play single recording
- [ ] Pause and resume
- [ ] Switch to different recording (first stops)
- [ ] Playback completes naturally
- [ ] Delete recording while playing
- [ ] Background app during playback
- [ ] Receive phone call during playback
- [ ] Low battery behavior
- [ ] Airplane mode playback (offline)
- [ ] Dark mode appearance

## 📊 Success Metrics

### Performance
- Time to start playback: **< 500ms**
- UI response to play/pause: **< 200ms**
- Position update frequency: **10 FPS** (100ms)
- Memory usage: **< 50MB** per active playback

### User Experience
- Playback reliability: **> 99%**
- User can find playback controls: **> 95%**
- Successful playback completion: **> 95%**

## 📚 References

### Documentation
- [Expo Audio Docs](https://docs.expo.dev/versions/latest/sdk/audio/)
- [React Native Animated](https://reactnative.dev/docs/animated)
- [Mobile App Spec](./MOBILE-APP.md)

### Design Inspiration
- Apple Voice Memos
- iOS Music app controls
- WhatsApp voice message playback
- Telegram voice notes

## 🚀 Next Steps

1. **Immediate**: Implement Phase 1 (Core Playback)
   - Set up `useAudioPlayback` hook
   - Create `PlaybackControls` component
   - Integrate with `RecordingsList`
   - Test and polish

2. **Short-term**: Gather user feedback
   - Observe playback usage patterns
   - Identify pain points
   - Prioritize Phase 2 features

3. **Long-term**: Enhanced features
   - Background playback
   - Smart controls
   - Intelligence layer

---

## 🎯 Design Decisions

### Why embed controls in each card?
- **Visibility**: Users can see which recording is playing
- **Context**: Duration and metadata are already there
- **Simplicity**: No separate playback screen needed for MVP

### Why single player instance?
- **Focus**: One thought at a time aligns with mindfulness
- **Simplicity**: Easier state management
- **Resources**: Better memory and battery usage
- **UX**: Clear mental model for users

### Why visual-only progress bar in Phase 1?
- **Speed**: Faster implementation
- **Testing**: Validate core playback first
- **Feedback**: See if users need scrubbing
- **Iteration**: Add based on actual usage

---

**Status**: Ready for implementation ✅
