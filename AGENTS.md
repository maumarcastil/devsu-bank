# DevSu Bank - Agent Guidelines

This document provides guidelines for agentic coding agents operating in this repository.

## Project Overview

- **Type**: React Native mobile app with Expo
- **Navigation**: Expo Router (file-based routing in `app/`)
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Language**: TypeScript (strict mode)
- **Testing**: None configured

## Build & Development Commands

### Running the App

```bash
npm start         # Start Expo dev server
npm run android   # Run on Android
npm run ios       # Run on iOS
npm run web       # Run in browser
```

### Linting & Formatting

```bash
npm run lint      # Run ESLint
npm run format    # Format code with Prettier
npm run format:check  # Check formatting without modifying
```

### Type Checking

```bash
npx tsc --noEmit  # TypeScript type check (no emit)
```

## Code Style Guidelines

### TypeScript

- **Strict mode enabled**: All `tsconfig.json` strict flags are on
- **Use explicit types**: Define prop types and return types explicitly
- **Avoid `any`**: Never use `any`; use `unknown` if type is truly unknown
- **Use path aliases**: Use `@/` prefix for imports from `src/` (configured in tsconfig)

```typescript
// Good
import { Button } from '@/components/button';
import type { User } from '@/types';

// Avoid
import { Button } from '../../components/button';
```

### Formatting (Prettier)

Prettier is configured with these rules:

- Semi-colons: enabled
- Single quotes: enabled
- Tab width: 2
- Trailing commas: es5
- Print width: 100
- Arrow parens: always

Run `npm run format` before committing.

### Imports

Order imports consistently:

1. React/React Native imports
2. Third-party library imports
3. Internal absolute imports (`@/`)
4. Relative imports

```typescript
import { useState } from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/button';
import { useAuthStore } from '@/stores/auth';
import './styles.css';
```

### Naming Conventions

- **Components**: PascalCase (`UserCard`, `AccountList`)
- **Hooks**: camelCase with `use` prefix (`useAuth`, `useUserData`)
- **Types/Interfaces**: PascalCase (`User`, `AccountProps`)
- **Constants**: SCREAMING_SNAKE_CASE for config values
- **Files**: camelCase for utilities, PascalCase for components

### React Native Specific

#### Core Rendering (CRITICAL)

- **Never use `&&` with falsy values**: React Native crashes on `0` or `""` rendered as text

```tsx
// Bad - crashes if count is 0
{
  count && <Text>{count}</Text>;
}

// Good
{
  count > 0 ? <Text>{count}</Text> : null;
}
```

- **Wrap strings in Text**: Direct string children of View cause crashes

```tsx
// Bad
<View>Hello</View>

// Good
<View><Text>Hello</Text></View>
```

#### Lists (HIGH Priority)

- **Use FlashList** from `@shopify/flash-list` for all lists
- **Pass primitives to list items** - objects break memoization
- **Avoid inline objects in renderItem** - creates new references each render
- **Keep list items lightweight** - no queries, minimal hooks

```tsx
// Good - pass primitives
renderItem={({ item }) => (
  <UserRow id={item.id} name={item.name} avatar={item.avatar} />
)}
```

#### Animations

- **Animate transform/opacity only** - not layout properties (width, height, margin)
- **Use GestureDetector** with Reanimated for press animations
- **Prefer useDerivedValue** over useAnimatedReaction for derived values

```tsx
// Good - GPU accelerated
useAnimatedStyle(() => ({
  transform: [{ scale: withTiming(pressed ? 0.95 : 1) }],
  opacity: withTiming(pressed ? 0.8 : 1),
}));
```

#### Navigation

- **Use Expo Router** - already configured in `app/` directory
- **Use native stack** - Expo Router uses native-stack by default

#### State Management

- **Minimize state variables** - derive values instead
- **Use Zustand** for global state (already configured)
- **Use dispatch updaters** for state that depends on current value

```tsx
// Good - derive value
const fullName = `${firstName} ${lastName}`;

// Good - dispatch updater
setCount((prev) => prev + 1);
```

### Error Handling

- Use try/catch with async/await
- Display user-friendly error messages
- Log errors for debugging (avoid exposing sensitive data)

```typescript
try {
  await fetchData();
} catch (error) {
  console.error('Failed to fetch:', error);
  setError('Unable to load data. Please try again.');
}
```

### Performance Guidelines

1. **Memoize list items** with `React.memo()`
2. **Use useCallback** for event handlers passed to children
3. **Avoid Context for frequently-changing values** - use Zustand selectors
4. **Optimize images** - use `expo-image` with appropriate sizes
5. **Avoid anonymous functions in loops** - hoist outside

### File Structure

```
app/                    # Expo Router pages (file-based routing)
  (tabs)/              # Tab navigation group
  _layout.tsx          # Root layout
src/
  components/          # Reusable UI components
  constants/           # App constants
  hooks/               # Custom hooks
  providers/           # React Context providers
  services/            # API services
  stores/              # Zustand stores
```

### Commit Guidelines

- Use clear, concise commit messages
- Follow conventional commits format: `type(scope): description`
- Types: feat, fix, refactor, style, docs, test, chore

## Non-Negotiable Rules

1. **Always commit after each task**: After completing any task (no matter how small), always create a commit with a descriptive message. Do NOT wait for the user to ask.

2. **Never ask for commit permission**: Commits are automatic. If you completed work, commit it immediately.

3. **Run lint and typecheck before commit**: Always run `npm run lint` and `npx tsc --noEmit` before committing. Fix any errors first.

4. **Run format before commit**: Always run `npm run format` before committing to ensure consistent code style.

5. **Never skip quality checks**: If lint or typecheck fails, fix the issues before committing.

6. **Commit message format**: Use clear, descriptive messages following conventional commits.

## Additional Resources

- See `.agents/skills/vercel-react-native-skills/AGENTS.md` for comprehensive React Native performance guidelines
- Expo documentation: https://docs.expo.dev
- React Navigation: https://reactnavigation.org
