# Alora - Parenting Support App

A comprehensive React Native Expo mobile application for parenting support, built with TypeScript and modern development practices.

## Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Navigation**: [React Navigation](https://reactnavigation.org/) with native stack
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **UI Components**: [React Native Reusables](https://react-native-reusables.com/)
- **Animations**: [Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- **Testing**: [Vitest](https://vitest.dev/) with [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- **Lint**: [ESLint](https://eslint.org/)
- **Format**: [Prettier](https://prettier.io/)

## Project Structure

```
src/
├── assets/           # Static assets (images, fonts)
├── components/       # Reusable UI components
├── config/           # App configuration (theme, constants)
├── hooks/            # Custom React hooks
├── lib/              # Utility functions and helpers
├── stores/           # Zustand state stores
└── types/            # TypeScript type definitions
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS version)
- [Bun](https://bun.sh/) package manager
- [iOS Simulator](https://developer.apple.com/documentation/xcode/running_your_app_in_the_simulator_or_on_a_device) (for iOS development)
- [Android Studio](https://developer.android.com/studio) (for Android development)

### Installation

```bash
# Install dependencies
bun install

# Start development server
bun run start
```

### Running on Platforms

```bash
# iOS
bun run ios

# Android
bun run android

# Web
bun run web
```

## Testing

```bash
# Run all tests
bun run test

# Run tests in watch mode
bun run test --watch
```

## Linting & Type Checking

```bash
# Run ESLint
bun run lint

# Run TypeScript type checker
bun run typecheck

# Format code with Prettier
bun run format
```

## Environment Variables

Create `.env` file in the root directory:

```env
API_URL=https://api.example.com
# Add other environment variables as needed
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and type checks
4. Submit a pull request

## License

MIT
