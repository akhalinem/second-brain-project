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
8. **Atomic commits**: Make small, focused commits that represent single logical changes
9. **Documentation-first**: Document all changes, decisions, and implementations thoroughly
10. **Current best practices**: Always use up-to-date documentation and current best practices for all tools and frameworks

### Documentation Requirements

**CRITICAL**: All code changes, architectural decisions, and feature implementations must be properly documented. Keep documentation **balanced** - not too detailed, not too high-level. The goal is to make project maintenance easier for both current and future development.

1. **Code Documentation**:

   - Add concise comments for complex logic (explain the "why", not the "what")
   - Document public APIs with clear input/output expectations
   - Include brief inline comments for non-obvious business logic
   - Keep comments current with code changes

2. **Architectural Changes** (MUST be documented):

   - Record major design decisions and their rationale
   - Document data flow changes and integration points
   - Update system diagrams when structure changes
   - Note breaking changes and migration impact

3. **Implementation Notes**:

   - Document key performance trade-offs and optimizations
   - Explain audio processing pipeline decisions briefly
   - Record privacy/security considerations
   - Note platform-specific integration approaches

4. **Maintenance Documentation**:
   - Update README feature lists when functionality changes
   - Document new configuration options and settings
   - Keep setup/installation instructions current
   - Record known limitations and workarounds

### Technology & Tool Requirements

**CRITICAL**: When implementing any feature or using any coding tool, framework, or library:

1. **Always reference current documentation** - Use the latest official documentation for all tools and frameworks
2. **Verify version compatibility** - Ensure all dependencies and APIs are compatible with current versions
3. **Follow current best practices** - Use up-to-date patterns and conventions, not deprecated approaches
4. **Never use deprecated features** - Always use recommended, non-deprecated APIs and methods as specified in official documentation
5. **Check for breaking changes** - Review changelogs and migration guides when updating dependencies
6. **Validate implementation** - Test with current tool versions to ensure functionality works as expected

### Version Control & Commit Practices

**CRITICAL**: All code changes must be committed atomically with clear, descriptive commit messages.

1. **Atomic Commits**:
   - Each commit should represent a single logical change
   - One feature, fix, or refactor per commit
   - Commits should be independently understandable
   - If you can describe a commit with "and", it should be split

2. **Commit Message Format**:
   - Use conventional commit format: `type: brief description`
   - Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `style`, `perf`
   - Include a body with bullet points for multi-line details
   - Example:
     ```
     feat: add audio recording hook
     
     - Implemented useAudioRecorder with expo-audio
     - Added permission request handling
     - Configured high-quality recording preset
     ```

3. **Commit Workflow**:
   - Commit after each logical unit of work is complete
   - Don't batch unrelated changes together
   - Stage and commit related files together
   - Test changes before committing when possible

4. **When to Commit**:
   - After adding a new dependency
   - After configuring a feature
   - After implementing a component or function
   - After updating documentation
   - After fixing a bug

### Git Flow Workflow

**CRITICAL**: This project uses the [Gitflow workflow](https://git-flow.sh/) for branch management and releases.

1. **Base Branches**:
   - `main`: Production-ready code only. All commits must be tagged with version numbers
   - `develop`: Primary integration branch for ongoing development. All completed features merge here

2. **Topic Branches** (branch from `develop` unless specified):
   - `feature/*`: New functionality development (e.g., `feature/audio-capture`)
   - `bugfix/*`: Bug fixes for develop branch
   - `release/*`: Prepare new production releases (bug fixes only, no new features)
   - `hotfix/*`: Urgent production fixes (branch from `main`, merge to both `main` and `develop`)
   - `support/*`: Maintain older supported versions (optional)

3. **Git Flow Commands**:
   - Install: `brew install gittower/tap/git-flow-next` (macOS)
   - Start feature: `git flow feature start <name>`
   - Finish feature: `git flow feature finish <name>`
   - Start release: `git flow release start <version>`
   - Finish release: `git flow release finish <version>`
   - Start hotfix: `git flow hotfix start <version>`
   - Finish hotfix: `git flow hotfix finish <version>`
   - Update branch: `git flow next update` (merge parent branch changes)

4. **Workflow Rules**:
   - Never commit directly to `main` or `develop`
   - Always work in topic branches
   - Keep feature branches updated with `develop` using `git flow next update`
   - Tag all releases on `main` with semantic versioning (e.g., v1.0.0)
   - Hotfixes must be merged to both `main` and `develop`

5. **Branch Naming Conventions**:
   - Features: `feature/short-description` (e.g., `feature/audio-playback`)
   - Bugfixes: `bugfix/issue-description` (e.g., `bugfix/recording-crash`)
   - Releases: `release/version` (e.g., `release/1.0.0`)
   - Hotfixes: `hotfix/version` (e.g., `hotfix/1.0.1`)

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
