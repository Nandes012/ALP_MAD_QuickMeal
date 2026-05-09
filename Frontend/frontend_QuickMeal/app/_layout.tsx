import { Stack } from 'expo-router';
import { ThemeProvider, DefaultTheme } from '@react-navigation/native';

export default function RootLayout() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="(tabs)" />
        
        {/* TAMBAHKAN HALAMAN-HALAMAN BERIKUT AGAR BISA DIAKSES */}
        <Stack.Screen name="list" />
        <Stack.Screen name="hasil_order" />
        <Stack.Screen name="detail_order" />
        <Stack.Screen name="detail_resep" />
        <Stack.Screen name="kondisi_order" />
      </Stack>
    </ThemeProvider>
  );
}