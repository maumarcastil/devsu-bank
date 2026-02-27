# DevSu Bank - React Native Architecture

> **Nota**: Este documento contiene los **lineamientos y ejemplos** a seguir para el desarrollo del proyecto. El estado actual del proyecto es una base mínima que se irá construyendo progresivamente siguiendo estas guías.

## Project Overview

- **Type**: Mobile Banking App (Expo)
- **React Native**: 0.81.5
- **Expo**: 54
- **Navigation**: Expo Router v6

---

## Project Structure

```
devsu-bank/
├── app/                         # Expo Router screens
│   ├── (auth)/                  # Auth group (login, register)
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── _layout.tsx
│   ├── (tabs)/                  # Tab navigation (main app)
│   │   ├── home/
│   │   ├── accounts/
│   │   ├── transfers/
│   │   ├── payments/
│   │   └── settings/
│   ├── (modal)/                 # Modals
│   └── _layout.tsx             # Root layout
├── src/
│   ├── components/
│   │   ├── ui/                  # Reusable UI (Button, Input, Card, etc.)
│   │   └── features/            # Feature-specific components
│   ├── hooks/                   # Custom hooks
│   ├── services/                # API & native services
│   │   ├── api/                 # API client
│   │   ├── auth/                # Auth service
│   │   ├── storage/             # Storage service
│   │   └── native/              # Native modules
│   ├── stores/                  # State management
│   ├── utils/                   # Utilities
│   ├── types/                   # TypeScript types
│   └── constants/               # Theme, config
├── constants/                   # App constants
├── assets/                      # Images, fonts
└── package.json
```

---

## Required Dependencies

```bash
# Install additional dependencies for banking app
npx expo install @react-native-async-storage/async-storage
npx expo install expo-secure-store
npx expo install @tanstack/react-query
npx expo install @tanstack/react-query-persist-client
npx expo install @shopify/flash-list
npx expo install react-native-reanimated
npx expo install expo-local-authentication
npx expo install expo-notifications
npx expo install zustand
```

---

## Core Patterns

### 1. Expo Router Navigation

```typescript
// app/(tabs)/_layout.tsx - Tab Navigation
import { Tabs } from 'expo-router'
import { useTheme } from '@/hooks/useTheme'

export default function TabLayout() {
  const { colors } = useTheme()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarStyle: { backgroundColor: colors.background },
        headerShown: false,
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="accounts" options={{ title: 'Accounts' }} />
      <Tabs.Screen name="transfers" options={{ title: 'Transfers' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
    </Tabs>
  )
}
```

### 2. Authentication Flow

```typescript
// src/stores/auth-store.ts
import { create } from 'zustand'
import * as SecureStore from 'expo-secure-store'

interface AuthState {
  user: User | null
  isLoading: boolean
  signIn: (credentials: Credentials) => Promise<void>
  signOut: () => Promise<void>
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,

  checkAuth: async () => {
    try {
      const token = await SecureStore.getItemAsync('authToken')
      if (token) {
        const user = await api.getUser(token)
        set({ user })
      }
    } catch {
      await SecureStore.deleteItemAsync('authToken')
    } finally {
      set({ isLoading: false })
    }
  },

  signIn: async (credentials) => {
    const { token, user } = await api.login(credentials)
    await SecureStore.setItemAsync('authToken', token)
    set({ user })
  },

  signOut: async () => {
    await SecureStore.deleteItemAsync('authToken')
    set({ user: null })
  },
}))
```

### 3. API Service with React Query

```typescript
// src/services/api/client.ts
import { create } from 'zustand'

interface ApiClient {
  get: <T>(endpoint: string) => Promise<T>
  post: <T>(endpoint: string, data: unknown) => Promise<T>
}

export const useApiClient = create<ApiClient>(() => ({
  get: async (endpoint) => {
    const token = await SecureStore.getItemAsync('authToken')
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    if (!response.ok) throw new Error('API Error')
    return response.json()
  },
  post: async (endpoint, data) => { /* ... */ },
}))
```

### 4. Query Provider Setup

```typescript
// src/providers/query-provider.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import AsyncStorage from '@react-native-async-storage/async-storage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24,
      staleTime: 1000 * 60 * 5,
      retry: 2,
      networkMode: 'offlineFirst',
    },
  },
})

export function QueryProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
```

### 5. Native Services

```typescript
// src/services/native/haptics.ts
import * as Haptics from 'expo-haptics'
import { Platform } from 'react-native'

export const haptics = {
  light: () => Platform.OS !== 'web' && Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  success: () => Platform.OS !== 'web' && Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  error: () => Platform.OS !== 'web' && Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
}

// src/services/native/biometrics.ts
import * as LocalAuthentication from 'expo-local-authentication'

export async function authenticateWithBiometrics(): Promise<boolean> {
  const hasHardware = await LocalAuthentication.hasHardwareAsync()
  if (!hasHardware) return false
  const isEnrolled = await LocalAuthentication.isEnrolledAsync()
  if (!isEnrolled) return false
  const result = await LocalAuthentication.authenticateAsync({ promptMessage: 'Authenticate' })
  return result.success
}
```

### 6. UI Components Pattern

```typescript
// src/components/ui/button.tsx
import { Pressable, Text, StyleSheet, Platform } from 'react-native'
import * as Haptics from 'expo-haptics'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

interface ButtonProps {
  title: string
  onPress: () => void
  variant?: 'primary' | 'secondary' | 'outline'
  disabled?: boolean
}

export function Button({ title, onPress, variant = 'primary', disabled }: ButtonProps) {
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }))

  const handlePressIn = () => {
    scale.value = withSpring(0.95)
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  }

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={() => (scale.value = withSpring(1))}
      disabled={disabled}
      style={[styles.button, styles[variant], disabled && styles.disabled, animatedStyle]}
    >
      <Text style={[styles.text, styles[`${variant}Text`]]}>{title}</Text>
    </AnimatedPressable>
  )
}

const styles = StyleSheet.create({
  button: { paddingVertical: 14, paddingHorizontal: 24, borderRadius: 12, alignItems: 'center' },
  primary: { backgroundColor: '#007AFF' },
  secondary: { backgroundColor: '#5856D6' },
  outline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#007AFF' },
  disabled: { opacity: 0.5 },
  text: { fontSize: 16, fontWeight: '600' },
  primaryText: { color: '#FFF' },
  secondaryText: { color: '#FFF' },
  outlineText: { color: '#007AFF' },
})
```

### 7. List Performance (FlashList)

```typescript
// src/components/features/accounts/account-list.tsx
import { FlashList } from '@shopify/flash-list'
import { memo, useCallback } from 'react'

const AccountItem = memo(function AccountItem({ item, onPress }) {
  return (
    <Pressable onPress={onPress}>
      <Text>{item.name}</Text>
      <Text>{item.balance}</Text>
    </Pressable>
  )
})

export function AccountList({ accounts, onAccountPress }) {
  const renderItem = useCallback(({ item }) => (
    <AccountItem item={item} onPress={() => onAccountPress(item.id)} />
  ), [onAccountPress])

  return (
    <FlashList
      data={accounts}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      estimatedItemSize={80}
    />
  )
}
```

---

## Routing Rules

| Pattern | File | Description |
|---------|------|-------------|
| `/` | `app/(tabs)/home/index.tsx` | Home screen |
| `/accounts` | `app/(tabs)/accounts/index.tsx` | Accounts list |
| `/accounts/[id]` | `app/(tabs)/accounts/[id].tsx` | Account detail |
| `/transfers` | `app/(tabs)/transfers/index.tsx` | Transfers |
| `/login` | `app/(auth)/login.tsx` | Login screen |
| `/(modal)/pin` | `app/(modal)/pin.tsx` | PIN modal |

### Navigation

```typescript
import { router } from 'expo-router'

// Push screen
router.push('/accounts/123')

// Replace (no back)
router.replace('/login')

// Go back
router.back()

// With params
router.push({ pathname: '/transfers', params: { from: 'checking' } })
```

---

## Build Commands

```bash
# Development
npm run start

# Build iOS
eas build --platform ios --profile development

# Build Android
eas build --platform android --profile preview

# Production
eas build --platform all --profile production

# Submit
eas submit --platform ios
```

---

## Best Practices

### Do's

- Use **Expo** for faster development and OTA updates
- Use **FlashList** instead of FlatList for performance
- Memoize list items with `memo()`
- Use **Reanimated** for 60fps animations
- Store tokens in **SecureStore** (not AsyncStorage)
- Use **React Query** with `offlineFirst` network mode
- Test on real devices (not just simulators)

### Don'ts

- Don't inline styles - use `StyleSheet.create`
- Don't fetch in render - use React Query
- Don't store sensitive data in AsyncStorage
- Don't ignore platform differences
- Don't skip error boundaries

---

## State Management Strategy

| Data Type | Solution |
|-----------|----------|
| Auth state | Zustand + SecureStore |
| Server state | React Query |
| UI state | Zustand |
| Form state | React Hook Form (if needed) |

---

## Theme

```typescript
// constants/theme.ts
export const colors = {
  primary: '#007AFF',
  background: '#FFFFFF',
  surface: '#F2F2F7',
  text: '#000000',
  textMuted: '#8E8E93',
  success: '#34C759',
  error: '#FF3B30',
  warning: '#FF9500',
}

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
}
```

---

## Reglas No Negociables

1. **Nunca realizar un commit sin autorización explícita del usuario**
   - Nunca ejecutar `git commit` o comandos equivalentes sin que el usuario lo solicite
   - Si el usuario pide hacer un commit, siempre preguntar qué archivos incluir y el mensaje
   - Esta regla es absoluta y no tiene excepciones

2. **Nunca hacer push sin autorización**
   - Nunca ejecutar `git push` sin permiso explícito

3. **Nunca modificar archivos de configuración de git**
   - No modificar `.gitconfig` ni hooks de git

4. **Nunca ejecutar comandos destructivos sin confirmación**
   - `git reset --hard`, `git push --force`, etc. requieren autorización expresa
