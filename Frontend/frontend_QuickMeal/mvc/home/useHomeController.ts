import { useCallback, useState } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@tanstack/react-query';
import { useFonts, Langar_400Regular } from '@expo-google-fonts/langar';

import { API_BASE_URL, getApiHost } from '@/constants/api';
import { useRecipeView } from '@/hooks/useRecipeView';

export type RecipeItem = {
  id: string;
  name: string;
  desc?: string;
  image: string;
};

export const useHomeController = () => {
  const router = useRouter();
  const [profilePicture, setProfilePicture] = useState<string>('https://via.placeholder.com/150');
  const { saveRecipeView, saving } = useRecipeView();

  const [fontsLoaded] = useFonts({
    'Inter-Regular': Langar_400Regular,
    'Inter-Medium': Langar_400Regular,
    'Inter-SemiBold': Langar_400Regular,
    'Inter-Bold': Langar_400Regular,
  });

  const getTimeGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 11) return { title: 'Selamat Pagi ☀️', sub: 'Sarapan apa kita hari ini?' };
    if (hours < 15) return { title: 'Selamat Siang 🌤️', sub: 'Yuk masakin menu siang yang praktis!' };
    if (hours < 18) return { title: 'Selamat Sore 🍃', sub: 'Waktunya bikin camilan sore kesukaanmu.' };
    return { title: 'Selamat Malam 🌙', sub: 'Makan malam hangat bersama keluarga?' };
  };

  const greeting = getTimeGreeting();

  const {
    data: recommendedRecipes = [],
    isLoading: recommendationsLoading,
  } = useQuery({
    queryKey: ['recommendedRecipes'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/recipes`);
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const result = await response.json();
      if (result?.success && Array.isArray(result.data)) {
        const mappedRecipes = result.data.map((item: any) => ({
          id: String(item.id),
          name: item.title || item.name || 'Resep',
          desc: item.subtitle || item.description || 'Rekomendasi untuk kamu hari ini',
          image: item.image || item.imageUrl || 'https://via.placeholder.com/500',
        }));
        return mappedRecipes.slice(0, 4);
      }
      return [];
    },
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  });

  const {
    data: recentRecipes = [],
    isLoading: recentLoading,
    refetch: refetchRecent,
  } = useQuery({
    queryKey: ['recentRecipes'],
    queryFn: async () => {
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) return [];
      const response = await fetch(`${API_BASE_URL}/recent-viewed-recipes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const result = await response.json();
      if (Array.isArray(result?.data)) {
        const mappedRecipes = result.data.map((item: any) => ({
          id: String(item.recipe?.id || item.recipe_id || item.id),
          name: item.recipe?.title || item.recipe?.name || item.title || item.name || 'Resep',
          desc: item.recipe?.subtitle || item.recipe?.description || item.subtitle || item.description || 'Resep yang baru dilihat',
          image: item.recipe?.image || item.recipe?.imageUrl || item.image || item.imageUrl || 'https://via.placeholder.com/500',
        }));
        return Array.from(new Map<string, RecipeItem>(mappedRecipes.map((recipe: RecipeItem) => [recipe.id, recipe])).values());
      }
      return [];
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 20,
  });

  const fetchProfilePicture = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const result = await response.json();
      if (result?.success && result?.data?.profile_picture) {
        const imageUrl = `${getApiHost()}/storage/${result.data.profile_picture}`;
        setProfilePicture(imageUrl);
      }
    } catch (error) {
      console.error('Failed to fetch profile picture:', error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      refetchRecent();
      fetchProfilePicture();
    }, [refetchRecent, fetchProfilePicture])
  );

  const handleRecipePress = async (item: RecipeItem) => {
    const cleanName = item.name.replace(/\s+/g, ' ').trim();
    const success = await saveRecipeView(item.id);
    if (!success) return;

    router.push({
      pathname: '/detail_resep',
      params: { id: item.id, name: cleanName, imageUrl: item.image },
    });
  };

  return {
    router,
    profilePicture,
    saving,
    fontsLoaded,
    greeting,
    recommendedRecipes,
    recommendationsLoading,
    recentRecipes,
    recentLoading,
    handleRecipePress,
  };
};
