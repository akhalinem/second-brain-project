# GitHub Copilot Instructions for Second Brain Project

## 📖 Core Project References

**IMPORTANT**: Always reference these foundational documents when providing assistance:

- **[README.md](../README.md)** - Project motivation, vision, and overall goals
- **[docs/MOBILE-APP.md](../docs/MOBILE-APP.md)** - Mobile app specifications, UX principles, and technical requirements

## 🧠 Key Philosophy (from README.md)

- **"Your mind is for having ideas, not holding them"** - David Allen
- Focus on capturing fleeting thoughts, connecting ideas, and reducing cognitive load
- Build a personal knowledge base that grows more valuable over time

## 🎯 Mobile-First Approach (from MOBILE-APP.md)

- **Speed is paramount**: If capturing a thought takes more than 3 seconds, it's too slow
- **Audio-first design**: Voice is the most natural and fastest way to capture thoughts
- Performance goals: App launch < 2s, Widget < 1s, Physical button < 0.5s

## 🎨 Core UX Principles

1. **Frictionless**: Remove every unnecessary step between thought and capture
2. **Invisible**: Background operation when possible
3. **Forgiving**: Never lose a thought due to technical issues
4. **Contextual**: Adapt to user's current situation
5. **Accessible**: Work in any situation - driving, walking, in meetings

## 💭 Development Guidelines

### Code & Architecture Principles

1. **Speed first**: Prioritize performance in all user interactions
2. **Audio-first workflows**: Default to voice input unless specified otherwise
3. **Offline-first**: Handle disconnected scenarios gracefully
4. **Mobile-optimized**: Optimize for battery life and performance
5. **Interruption-safe**: Design for users switching apps mid-recording
6. **Background-capable**: Plan for system-level integrations
7. **Accessibility-focused**: Work in any user situation

### Feature Priority Order

1. **Capture speed improvements** (reduces friction)
2. **Reliability enhancements** (prevents data loss)
3. **Intelligence features** (adds value to captured data)
4. **Export/sharing capabilities** (increases utility)
5. **UI/visual improvements** (enhances experience)

### Audio Processing Considerations

- Natural conversational speech patterns
- Background noise tolerance
- Hands-free operation support
- Privacy-conscious voice data handling
- Real-time processing optimization
- Offline transcription capabilities

## 🔗 System Integration Goals

Seamless integration with:

- Native platform capabilities (Siri, Google Assistant)
- System shortcuts and automation tools
- Hardware buttons and gestures
- Productivity app ecosystems
- Cloud storage and sync services

---

**Remember**: Every feature should serve the ultimate goal of making thought capture as fast and natural as speaking.

For detailed specifications, always reference the linked documents above.
