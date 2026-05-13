import { Platform } from 'react-native';
import Constants from 'expo-constants';

export const getApiHost = () => {
  if (Platform.OS === 'web') return 'http://localhost:8000';

  const expoConfig = (Constants as any).expoConfig || {};
  const hostUri = expoConfig?.hostUri || '';
  const hostFromUri = hostUri ? hostUri.split(':')[0] : null;
  const fallbackHost = process.env.EXPO_PUBLIC_API_HOST || '';
  const host = hostFromUri || fallbackHost;

  return `http://${host}:8000`;
};

export const API_BASE_URL = `${getApiHost()}/api`;
