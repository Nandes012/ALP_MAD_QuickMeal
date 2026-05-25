import { Stack } from 'expo-router';

import {
  ThemeProvider,
  DefaultTheme,
} from '@react-navigation/native';

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={DefaultTheme}>
        <Stack
          screenOptions={{ headerShown: false }}
          initialRouteName="login"
        >
          <Stack.Screen name="login" />
          <Stack.Screen name="signup" />
          <Stack.Screen name="(tabs)" />

          <Stack.Screen name="list" />
          <Stack.Screen name="detail_resep" />
          <Stack.Screen name="detail_bahan" />
        </Stack>
      </ThemeProvider>
    </QueryClientProvider>
  );
}