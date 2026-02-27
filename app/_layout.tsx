import { Stack } from 'expo-router';
import { useTheme } from '../src/stores/theme-store';
import { Pressable, Text, StyleSheet } from 'react-native';

function HeaderRight() {
  const { mode, toggleTheme } = useTheme();
  
  return (
    <Pressable 
      onPress={toggleTheme} 
      style={styles.toggleButton}
      hitSlop={8}
    >
      <Text style={styles.toggleText}>
        {mode === 'light' ? '🌙' : '☀️'}
      </Text>
    </Pressable>
  );
}

function RootLayoutNav() {
  const { colors } = useTheme();
  
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitle: 'DevSu Bank',
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
          color: colors.text,
        },
        headerTintColor: colors.text,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerRight: () => <HeaderRight />,
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return <RootLayoutNav />;
}

const styles = StyleSheet.create({
  toggleButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  toggleText: {
    fontSize: 20,
  },
});
