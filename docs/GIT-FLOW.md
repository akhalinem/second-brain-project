# Git Flow Workflow Guide

This project uses the [Gitflow workflow](https://git-flow.sh/) for managing branches, features, releases, and hotfixes.

## 📚 Overview

Gitflow is a strict branching model designed to manage projects with scheduled releases. It provides a robust framework for collaborating on features while maintaining a stable production codebase.

## 🌳 Branch Structure

### Base Branches

- **`main`**: Production-ready code only
  - Contains only official releases
  - Every commit is tagged with a version number
  - Represents what's currently deployed

- **`develop`**: Integration branch for ongoing development
  - Contains the latest completed features
  - Reflects the state of the next major release
  - All feature branches branch from and merge back to `develop`

### Topic Branches

- **`feature/*`**: New functionality development
  - Branch from: `develop`
  - Merge back to: `develop`
  - Example: `feature/audio-transcription`

- **`bugfix/*`**: Bug fixes for develop branch
  - Branch from: `develop`
  - Merge back to: `develop`
  - Example: `bugfix/recording-memory-leak`

- **`release/*`**: Prepare new production releases
  - Branch from: `develop`
  - Merge back to: `main` and `develop`
  - Only bug fixes and polish, no new features
  - Example: `release/1.0.0`

- **`hotfix/*`**: Urgent production fixes
  - Branch from: `main`
  - Merge back to: `main` and `develop`
  - For critical bugs in production
  - Example: `hotfix/1.0.1`

- **`support/*`**: Maintain older versions (optional)
  - For supporting legacy production versions
  - Example: `support/1.x`

## 🛠️ Installation

### macOS

```bash
brew install gittower/tap/git-flow-next
```

### Other Platforms

See the [official installation guide](https://git-flow.sh/docs/installation) for Linux, Windows, and other options.

## 🚀 Common Workflows

### Starting a New Feature

```bash
# Start a new feature branch
git flow feature start audio-playback

# Work on your feature (make commits)
git add .
git commit -m "feat: implement audio playback controls"

# Keep your feature branch updated with develop
git flow next update

# Finish the feature (merges to develop and deletes branch)
git flow feature finish audio-playback
```

### Creating a Release

```bash
# Start a release branch
git flow release start 1.0.0

# Make final adjustments, update version numbers, changelog
git commit -am "chore: bump version to 1.0.0"

# Finish the release (merges to main and develop, creates tag)
git flow release finish 1.0.0

# Push everything including tags
git push origin main develop --tags
```

### Applying a Hotfix

```bash
# Start a hotfix from main
git flow hotfix start 1.0.1

# Fix the critical bug
git commit -am "fix: resolve crash on startup"

# Finish the hotfix (merges to main and develop, creates tag)
git flow hotfix finish 1.0.1

# Push everything
git push origin main develop --tags
```

### Working on a Bug Fix

```bash
# Start a bugfix branch
git flow bugfix start fix-memory-leak

# Fix the bug
git commit -am "fix: resolve memory leak in audio processing"

# Finish the bugfix (merges to develop)
git flow bugfix finish fix-memory-leak
```

## 📋 Best Practices

### Branch Naming

- Use lowercase with hyphens: `feature/audio-capture` not `feature/Audio_Capture`
- Be descriptive but concise: `feature/add-export` not `feature/feature1`
- Include issue numbers when relevant: `bugfix/fix-crash-issue-42`

### Feature Development

1. Always branch from `develop` for new features
2. Keep feature branches focused and short-lived
3. Regularly update your feature branch: `git flow next update`
4. Test thoroughly before finishing a feature
5. Resolve conflicts locally before finishing

### Releases

1. Create a release branch when ready to ship
2. Only bug fixes and documentation in release branches
3. Update version numbers, changelogs, and documentation
4. Test the release thoroughly
5. Tag releases with semantic versioning (e.g., v1.0.0)

### Hotfixes

1. Only use for critical production bugs
2. Create from `main`, not `develop`
3. Keep changes minimal and focused
4. Bump the patch version number (e.g., 1.0.0 → 1.0.1)
5. Ensure changes merge back to both `main` and `develop`

## 🔄 Keeping Branches Updated

Git Flow Next provides automatic branch dependency tracking:

```bash
# Update your current branch with changes from parent branch
git flow next update
```

This is especially useful for long-running feature branches to keep them in sync with `develop`.

## 🏷️ Version Tagging

Follow [Semantic Versioning](https://semver.org/):

- **MAJOR** version (1.0.0 → 2.0.0): Breaking changes
- **MINOR** version (1.0.0 → 1.1.0): New features, backward compatible
- **PATCH** version (1.0.0 → 1.0.1): Bug fixes, backward compatible

## 🤝 Team Collaboration

### Before Starting Work

```bash
# Ensure you have the latest develop
git checkout develop
git pull origin develop

# Then start your feature/bugfix
git flow feature start my-feature
```

### Before Finishing Work

```bash
# Update your branch with latest develop
git flow next update

# Run tests
npm test  # or your test command

# Finish the branch
git flow feature finish my-feature
```

### Handling Conflicts

If conflicts occur during `git flow next update` or finishing a branch:

1. Resolve conflicts in your editor
2. Stage resolved files: `git add <files>`
3. Continue the merge: `git merge --continue`
4. Complete the flow operation

## 📚 Additional Resources

- [Official Git Flow Documentation](https://git-flow.sh/docs)
- [Gitflow Workflow Overview](https://git-flow.sh/workflows/gitflow)
- [Semantic Versioning](https://semver.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)

## 🆘 Troubleshooting

### Already on branch 'feature/xyz'

If you try to start a feature that already exists, switch to it instead:

```bash
git checkout feature/xyz
```

### Need to abandon a feature

```bash
# Delete the feature branch without merging
git branch -D feature/xyz
```

### Accidentally committed to develop/main

```bash
# Move the commit to a new feature branch
git branch feature/new-branch
git reset --hard HEAD~1
git checkout feature/new-branch
```

---

**Remember**: The goal of Git Flow is to maintain a clean, organized history that makes collaboration easier and releases predictable. When in doubt, create a branch!
