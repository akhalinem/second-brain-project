# Transcription Feature Plan

## 🎯 Overview

Implement automatic speech-to-text transcription for audio recordings using [UzbekVoice.ai STT API](https://uzbekvoice.ai/developers/api/stt). This feature will enable searchable, text-based access to captured audio thoughts while maintaining the audio-first approach.

## 📋 Service Details: UzbekVoice.ai STT API

### API Endpoint
- **URL**: `https://uzbekvoice.ai/api/v1/stt`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`
- **Authentication**: API Key via `Authorization` header

### API Parameters

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `file` | File | Audio file (Max 50MB, 60 min) | Required |
| `language` | string | Language code: `'uz'`, `'ru-uz'`, `null` (auto-detect Uzbek-Russian) | `'uz'` |
| `blocking` | boolean | `true`: wait for result, `false`: return job_id for polling | `false` |
| `return_offsets` | boolean | Include word-level timestamps | `false` |
| `run_diarization` | string | Speaker identification: `'true'`, `'false'`, `'phone'` | `'false'` |
| `webhook_notification_url` | string | URL to receive completion notification | - |

### API Response Types

#### Blocking Mode (`blocking=true`)
```json
{
  "transcription": "Transcribed text here...",
  "language": "uz",
  "duration": 45.3
}
```

#### Non-Blocking Mode (`blocking=false`)
```json
{
  "job_id": "abc123-def456-ghi789",
  "status": "processing"
}
```

#### Polling Endpoint (assumed)
```
GET /api/v1/stt/jobs/{job_id}
```

## 🏗️ Architecture Decision: Direct API vs Backend Server

### Option 1: Direct API Integration (Recommended for MVP)

**Pros:**
- ✅ Simpler implementation - no backend needed
- ✅ Faster development - direct from mobile app
- ✅ Lower infrastructure costs
- ✅ Offline queueing with sync when online

**Cons:**
- ❌ API key exposed in mobile app (security risk)
- ❌ No centralized logging/monitoring
- ❌ Limited ability to change providers without app update

### Option 2: Backend Server Integration (Future Enhancement)

**Pros:**
- ✅ API key security (server-side only)
- ✅ Centralized logging and monitoring
- ✅ Can implement rate limiting and quotas
- ✅ Easy to switch transcription providers
- ✅ Can add additional processing layers

**Cons:**
- ❌ More complex setup (requires Expo Server + hosting)
- ❌ Additional infrastructure costs
- ❌ Requires internet connection for server access

### Recommended Approach

**Phase 1 (MVP)**: Direct API integration with API key stored securely
**Phase 2 (Production)**: Migrate to backend server using Expo Server + Vercel/Netlify

## 📱 Mobile App Implementation Plan

### 1. Update Recording Type

Add transcription-related fields to the `Recording` interface:

```typescript
export interface Recording {
  id: string;
  uri: string;
  duration: number;
  createdAt: number;
  title?: string;
  
  // New transcription fields
  transcription?: {
    text: string;
    language: 'uz' | 'ru-uz' | 'auto';
    confidence?: number;
    wordOffsets?: Array<{
      word: string;
      start: number;
      end: number;
    }>;
    transcribedAt: number;
  };
  transcriptionStatus?: 'pending' | 'processing' | 'completed' | 'failed' | 'queued';
  transcriptionJobId?: string;
  transcriptionError?: string;
}
```

### 2. Create Transcription Service

Create `src/services/transcription.ts`:

```typescript
interface TranscriptionConfig {
  apiKey: string;
  baseUrl: string;
  language: 'uz' | 'ru-uz' | 'auto';
}

interface TranscriptionOptions {
  language?: 'uz' | 'ru-uz' | 'auto';
  blocking?: boolean;
  returnOffsets?: boolean;
  runDiarization?: boolean;
}

// Upload audio file and request transcription
async function transcribeAudio(
  fileUri: string,
  options?: TranscriptionOptions
): Promise<TranscriptionResult>

// Poll for transcription job status (non-blocking mode)
async function getTranscriptionStatus(
  jobId: string
): Promise<TranscriptionStatus>

// Queue transcription for offline processing
async function queueTranscription(
  recordingId: string
): Promise<void>

// Process pending transcriptions when online
async function processPendingTranscriptions(): Promise<void>
```

### 3. Create Transcription Hook

Create `src/hooks/useTranscription.ts`:

```typescript
interface UseTranscriptionReturn {
  transcribe: (recordingId: string) => Promise<void>;
  isTranscribing: boolean;
  error: string | null;
  progress: number | null;
  retryTranscription: (recordingId: string) => Promise<void>;
}

function useTranscription(): UseTranscriptionReturn
```

### 4. Update Storage Module

Add transcription-related storage functions in `src/utils/storage.ts`:

```typescript
// Update recording with transcription result
async function updateRecordingTranscription(
  id: string,
  transcription: Recording['transcription'],
  status: Recording['transcriptionStatus']
): Promise<void>

// Get recordings pending transcription
async function getPendingTranscriptions(): Promise<Recording[]>

// Save transcription to queue for offline processing
async function queueTranscriptionJob(recordingId: string): Promise<void>
```

### 5. Update UI Components

#### RecordingsList Component
- Show transcription status badge (pending, processing, completed, failed)
- Display transcribed text preview
- Add retry button for failed transcriptions
- Show language detected

#### PlaybackControls Component
- Add "Transcribe" button
- Show transcription text below audio controls
- Add copy-to-clipboard functionality
- Display word-by-word highlighting during playback (if offsets available)

#### HomeScreen
- Add transcription queue status indicator
- Show auto-transcription toggle setting
- Display transcription quota/usage (if applicable)

### 6. Configuration Management

Create `src/config/transcription.ts`:

```typescript
export const TRANSCRIPTION_CONFIG = {
  // API Configuration
  API_KEY: process.env.EXPO_PUBLIC_UZBEKVOICE_API_KEY || '',
  BASE_URL: 'https://uzbekvoice.ai/api/v1',
  
  // Default Settings
  DEFAULT_LANGUAGE: 'uz' as const,
  AUTO_TRANSCRIBE: false, // Auto-transcribe after recording
  BLOCKING_MODE: false, // Use polling instead of blocking
  RETURN_OFFSETS: false, // Get word-level timestamps
  RUN_DIARIZATION: false, // Speaker identification
  
  // Polling Configuration
  POLL_INTERVAL: 2000, // 2 seconds
  MAX_POLL_ATTEMPTS: 60, // 2 minutes max
  
  // Queue Configuration
  AUTO_PROCESS_QUEUE: true, // Process queue when online
  MAX_RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 5000, // 5 seconds
};
```

## 🔐 Security Considerations

### Phase 1 (Direct API Integration)

1. **Environment Variables**: Store API key in `.env` file (not committed to git)
   ```
   EXPO_PUBLIC_UZBEKVOICE_API_KEY=your_api_key_here
   ```

2. **Expo Secrets** (for EAS Build): Use EAS Secrets for production builds
   ```bash
   eas secret:create --scope project --name UZBEKVOICE_API_KEY --value your_key
   ```

3. **Add to .gitignore**:
   ```
   .env
   .env.local
   .env.production
   ```

4. **Key Rotation**: Plan to rotate API keys periodically

### Phase 2 (Backend Server)

- Move API key to server environment variables
- Implement rate limiting per user
- Add authentication/authorization
- Monitor API usage and costs

## 📊 Data Flow

### Auto-Transcription Flow
```
1. User stops recording
2. Recording saved locally ✓
3. Add to transcription queue
4. Check internet connection
   ├─ Online: Upload to API immediately
   │  ├─ Blocking mode: Wait for result
   │  └─ Non-blocking: Start polling
   └─ Offline: Keep in queue
5. On completion: Update recording with transcription
6. Show notification (optional)
```

### Manual Transcription Flow
```
1. User taps "Transcribe" button
2. Check internet connection
   ├─ Online: Upload to API
   └─ Offline: Show error message
3. Show loading indicator
4. Poll for result (non-blocking mode)
5. Display transcription text
6. Save to local storage
```

### Queue Processing Flow
```
1. App becomes online
2. Get pending transcriptions from queue
3. Process one at a time (avoid API rate limits)
4. Update recording status as each completes
5. Show progress notification
```

## 🎨 UI/UX Design

### Transcription Status Indicators

| Status | Badge Color | Icon | Description |
|--------|-------------|------|-------------|
| `pending` | Gray | ⏱️ | Waiting to transcribe |
| `processing` | Blue | ⏳ | Currently transcribing |
| `completed` | Green | ✓ | Transcription available |
| `failed` | Red | ⚠️ | Transcription failed |
| `queued` | Orange | 📤 | Queued for when online |

### Settings Screen (Future)

- [ ] Auto-transcribe toggle
- [ ] Default language selection
- [ ] Enable word-level timestamps
- [ ] Enable speaker diarization
- [ ] Transcription quota display
- [ ] Clear transcription cache

### Recording Card with Transcription

```
┌─────────────────────────────────────┐
│ 🎤 Recording #1                      │
│ Oct 23, 2025 at 2:30 PM              │
│ Duration: 00:45                      │
│                                      │
│ [✓] Transcription (uz)               │
│ "Bugun juda yaxshi kun bo'ldi..."   │
│                                      │
│ [▶ Play] [📋 Copy] [🗑 Delete]       │
└─────────────────────────────────────┘
```

## 📦 Dependencies

### Required npm Packages

```bash
# For file upload
npm install expo-file-system

# For network detection
npm install @react-native-community/netinfo

# For secure storage (API keys)
npm install expo-secure-store

# For background tasks (optional - Phase 2)
npm install expo-background-fetch expo-task-manager
```

### Package Versions
```json
{
  "dependencies": {
    "expo-file-system": "~19.0.17",
    "@react-native-community/netinfo": "^11.4.1",
    "expo-secure-store": "~15.0.0"
  }
}
```

## 🧪 Testing Strategy

### Unit Tests
- [ ] Transcription service functions
- [ ] Queue management
- [ ] Storage operations
- [ ] Network status handling

### Integration Tests
- [ ] End-to-end transcription flow
- [ ] Offline queue processing
- [ ] Error handling and retries
- [ ] API response parsing

### Manual Testing Scenarios
- [ ] Transcribe short audio (< 10s)
- [ ] Transcribe long audio (> 1 min)
- [ ] Test Uzbek language
- [ ] Test Russian-Uzbek mix
- [ ] Test offline queueing
- [ ] Test queue processing when online
- [ ] Test failed transcription retry
- [ ] Test concurrent transcriptions

## 🚀 Implementation Phases

### Phase 1: Basic Transcription (Week 1)
- [x] Update Recording type with transcription fields
- [ ] Create transcription service module
- [ ] Implement direct API integration
- [ ] Add manual "Transcribe" button to UI
- [ ] Display transcription text in recording card
- [ ] Handle basic error cases

### Phase 2: Queue & Offline Support (Week 2)
- [ ] Implement transcription queue
- [ ] Add network status detection
- [ ] Auto-queue failed transcriptions
- [ ] Process queue when app goes online
- [ ] Add retry functionality
- [ ] Show queue status in UI

### Phase 3: Auto-Transcription (Week 3)
- [ ] Add auto-transcribe toggle setting
- [ ] Trigger transcription after recording
- [ ] Show background processing notification
- [ ] Optimize for battery usage
- [ ] Add transcription statistics

### Phase 4: Advanced Features (Week 4)
- [ ] Implement word-level timestamps
- [ ] Add word highlighting during playback
- [ ] Language detection and selection
- [ ] Speaker diarization (if useful)
- [ ] Search within transcriptions
- [ ] Export transcriptions

### Phase 5: Backend Migration (Future)
- [ ] Set up Expo Server project
- [ ] Create API routes for transcription
- [ ] Implement authentication
- [ ] Add rate limiting
- [ ] Set up monitoring/logging
- [ ] Deploy to Vercel/Netlify
- [ ] Migrate mobile app to use backend

## 📈 Success Metrics

- **Transcription Accuracy**: Monitor user corrections/deletions
- **Processing Time**: Track average transcription duration
- **Completion Rate**: Percentage of successful transcriptions
- **Queue Performance**: Time from recording to transcription completion
- **User Adoption**: Percentage of users using transcription feature
- **Cost Efficiency**: Cost per transcription

## 🔮 Future Enhancements

1. **Multi-language Support**: Detect and support more languages
2. **Real-time Transcription**: Live transcription during recording
3. **Voice Commands**: Parse transcriptions for action items
4. **Smart Summaries**: AI-generated summaries of long recordings
5. **Tag Extraction**: Automatic topic/tag detection from text
6. **Translation**: Translate transcriptions to other languages
7. **Voice Search**: Search recordings by spoken content
8. **Sharing**: Share transcriptions via messaging apps

## 📚 Related Documentation

- [UzbekVoice.ai API Documentation](https://uzbekvoice.ai/developers/api/stt)
- [Expo Server Documentation](https://docs.expo.dev/versions/latest/sdk/server/)
- [Expo FileSystem API](https://docs.expo.dev/versions/latest/sdk/filesystem/)
- [React Native NetInfo](https://github.com/react-native-netinfo/react-native-netinfo)
- [Expo SecureStore](https://docs.expo.dev/versions/latest/sdk/securestore/)

## 🤔 Open Questions

1. **API Key Security**: Should we implement backend in Phase 1 or is secure storage sufficient?
2. **Cost Management**: What's the pricing model? Do we need to implement quotas?
3. **Language Detection**: Should we auto-detect language or let user choose?
4. **Background Processing**: Should transcriptions happen in background or foreground only?
5. **Retention Policy**: Should we cache transcriptions forever or have expiration?
6. **Webhook Setup**: Do we need a webhook endpoint for non-blocking mode? (Requires backend)

## 📝 Notes

- **Expo Server** is primarily for server-side API routes within an Expo app, not specifically for calling external APIs. It's useful for Phase 2 (backend server), not Phase 1.
- For Phase 1, we'll use standard React Native `fetch` or `axios` for API calls
- Consider using `expo-background-fetch` for processing queue when app is in background
- Test thoroughly with poor network conditions
- Monitor API costs and implement caching strategies
- Consider partial transcription results for better UX (show progress)

---

**Last Updated**: October 23, 2025  
**Status**: Planning Phase  
**Next Steps**: Begin Phase 1 implementation
