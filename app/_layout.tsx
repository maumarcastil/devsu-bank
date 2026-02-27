import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          headerTitle: 'DevSu Bank',
          headerTitleAlign: 'center',
        }}
      />
    </Stack>
  );
}
