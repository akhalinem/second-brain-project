# Second Brain Mobile App

Audio-first mobile app for capturing thoughts instantly.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npx expo start
```

## 📱 Running on Devices

### iOS
```bash
npx expo run:ios
```

### Android
```bash
npx expo run:android
```

### Web
```bash
npx expo start --web
```

## 🛠️ Tech Stack

- **React Native with Expo SDK 54** - Cross-platform mobile framework
- **TypeScript** - Type-safe development
- **expo-audio** - Audio recording (current non-deprecated API)
- **expo-file-system** - Local file storage
- **@react-native-async-storage/async-storage** - Metadata storage

## 📦 Key Dependencies

### Audio Recording
- `expo-audio@~1.0.13` - Modern audio recording API
  - Uses `useAudioRecorder` hook for recording
  - Supports background recording on iOS
  - Non-deprecated replacement for expo-av recording

### Storage
- `expo-file-system` - Save audio files locally
- `@react-native-async-storage/async-storage` - Store metadata

## 🎯 Architecture Principles

Following the [Mobile App Specification](../docs/MOBILE-APP.md):

1. **Audio-First**: Voice recording is the primary input method
2. **Speed-First**: < 2s app launch, < 1s widget access target
3. **Offline-First**: Full functionality without network
4. **Background-Capable**: Continue recording when app is backgrounded

## 🔧 Configuration

Audio permissions and background modes are configured in `app.json`:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-audio",
        {
          "microphonePermission": "Allow Second Brain to record your thoughts and ideas."
        }
      ]
    ],
    "ios": {
      "infoPlist": {
        "UIBackgroundModes": ["audio"]
      }
    }
  }
}
```

## 📚 Documentation

- [Main README](../README.md) - Project motivation and vision
- [Mobile App Spec](../docs/MOBILE-APP.md) - Detailed mobile requirements
- [Expo Audio Docs](https://docs.expo.dev/versions/latest/sdk/audio/) - Official audio API documentation

## ✨ Current Features

### Implemented
- ✅ **Audio Recording** - One-tap recording with visual feedback
- ✅ **Recordings List** - View all captured thoughts with timestamps
- ✅ **Local Storage** - Offline-first with persistent storage
- ✅ **Delete Recordings** - Long-press to remove recordings
- ✅ **Permission Handling** - Graceful microphone permission requests
- ✅ **Duration Display** - Real-time recording duration

## 📁 Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── RecordButton.tsx
│   └── RecordingsList.tsx
├── hooks/           # Custom React hooks
│   └── useAudioCapture.ts
├── screens/         # Screen components
│   └── HomeScreen.tsx
├── types/           # TypeScript type definitions
│   └── recording.ts
└── utils/           # Utility functions
    └── storage.ts
```

## 🧪 Development Notes

### Audio Recording Best Practices (Expo SDK 54)

Always use the current `expo-audio` API:

```typescript
import { useAudioRecorder, RecordingPresets } from 'expo-audio';

const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
await recorder.prepareToRecordAsync();
recorder.record();
```

**Do NOT use** deprecated `expo-av` Audio.Recording class.

### Custom Hook Usage

The `useAudioCapture` hook wraps all audio recording logic:

```typescript
const {
  isRecording,
  duration,
  hasPermission,
  startRecording,
  stopRecording,
  requestPermission,
} = useAudioCapture();
```

### Storage

Recordings are stored using:
- **expo-file-system** - Audio files in `Paths.document`
- **async-storage** - Recording metadata (id, uri, duration, createdAt)

## 📄 License

_To be determined_
