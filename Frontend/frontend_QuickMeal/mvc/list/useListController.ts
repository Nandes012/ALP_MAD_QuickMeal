import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { useFonts, Langar_400Regular } from '@expo-google-fonts/langar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@tanstack/react-query';

import { API_BASE_URL, getApiHost } from '@/constants/api';

export type Tag = {
  id: string | number;
  name: string;
  icon: string;
  type: string;
};

export type FoodItem = {
  id: string;
  name: string;
  price: string;
  imageUri: string;
  tags?: Tag[];
};

const FALLBACK_RECIPE_CATEGORIES = [
  { id: 'all', name: 'Semua', icon: '🍽️', searchKey: '' },
  { id: '1', name: 'Gorengan', icon: '🔥', searchKey: 'Goreng' },
  { id: '2', name: 'Sayuran', icon: '🥬', searchKey: 'Sayur' },
  { id: '3', name: 'Seafood', icon: '🐟', searchKey: 'Ikan' },
  { id: '4', name: 'Ayam', icon: '🍗', searchKey: 'Ayam' },
  { id: '5', name: 'Daging', icon: '🥩', searchKey: 'Daging' },
];

const FALLBACK_INGREDIENT_CATEGORIES = [
  { id: 'all', name: 'Semua', icon: '🛒', searchKey: '' },
  { id: '1', name: 'Hewani', icon: '🥩', searchKey: 'Hewani' },
  { id: '2', name: 'Nabati', icon: '🥦', searchKey: 'Nabati' },
  { id: '3', name: 'Olahan', icon: '🥫', searchKey: 'Olahan' },
  { id: '4', name: 'Bumbu', icon: '🌶️', searchKey: 'Bumbu' },
];

async function fetchTags(type: 'resep' | 'bahan') {
  const response = await fetch(`${API_BASE_URL}/tags?type=${type}`);
  if (!response.ok) throw new Error(`API error ${response.status}`);

  const json = await response.json();
  if (!json?.success || !Array.isArray(json.data)) {
    return [];
  }

  const tags = json.data.map((tag: Tag) => ({
    id: String(tag.id),
    name: tag.name,
    icon: tag.icon,
    type: tag.type,
  }));

  return [{ id: 'all', name: 'Semua', icon: '🍽️', searchKey: '' }, ...tags];
}

async function fetchList(activeTab: 'Masak' | 'Bahan') {
  const endpoint = activeTab === 'Masak' ? '/recipes' : '/ingredients';
  const response = await fetch(`${API_BASE_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error(`API error ${response.status}`);
  }

  const json = await response.json();
  if (!json?.success || !Array.isArray(json.data)) {
    return [];
  }

  if (activeTab === 'Masak') {
    const recipes = json.data.map((recipe: any) => ({
      id: String(recipe.id),
      name: recipe.title || recipe.name || 'Resep',
      price: Number(recipe.totalIngredientPrice || recipe.price || 0).toLocaleString('id-ID'),
      imageUri: recipe.image || recipe.imageUrl || 'https://via.placeholder.com/300',
      tags: recipe.tags || [],
    }));

    return Array.from(new Map<string, FoodItem>(recipes.map((item: FoodItem) => [item.id, item])).values());
  }

  const ingredients = json.data.map((ingredient: any) => ({
    id: String(ingredient.id),
    name: ingredient.name || 'Bahan',
    price: Number(ingredient.price_per_kg || ingredient.price || 0).toLocaleString('id-ID'),
    imageUri: ingredient.ingredient_picture || ingredient.image || 'https://via.placeholder.com/300',
    tags: ingredient.tags || [],
  }));

  return Array.from(new Map<string, FoodItem>(ingredients.map((item: FoodItem) => [item.id, item])).values());
}

export const useListController = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'Masak' | 'Bahan'>('Masak');
  const [profilePicture, setProfilePicture] = useState<string>('https://via.placeholder.com/150');
  const [activeCategory, setActiveCategory] = useState('all');

  const [fontsLoaded] = useFonts({
    'Inter-Regular': Langar_400Regular,
    'Inter-Medium': Langar_400Regular,
    'Inter-SemiBold': Langar_400Regular,
    'Inter-Bold': Langar_400Regular,
  });

  const {
    data: data = [],
    isLoading: loading,
    refetch: refetchList,
  } = useQuery({
    queryKey: ['list', activeTab],
    queryFn: () => fetchList(activeTab),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

  const {
    data: categories = [],
    isError: tagsError,
  } = useQuery({
    queryKey: ['tags', activeTab],
    queryFn: () => fetchTags(activeTab === 'Masak' ? 'resep' : 'bahan'),
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
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
      fetchProfilePicture();
      refetchList();
    }, [fetchProfilePicture, refetchList])
  );

  useEffect(() => {
    setActiveCategory('all');
  }, [activeTab]);

  const handleItemPress = (item: FoodItem) => {
    const cleanName = item.name.replace(/\s+/g, ' ').trim();

    if (activeTab === 'Masak') {
      router.push({
        pathname: '/detail_resep',
        params: { id: item.id, name: cleanName, imageUrl: item.imageUri },
      });
    } else {
      router.push({
        pathname: '/detail_bahan',
        params: { id: item.id, name: cleanName, imageUrl: item.imageUri, price: item.price },
      });
    }
  };

  const displayedCategories =
    categories.length > 0
      ? categories
      : activeTab === 'Masak'
      ? FALLBACK_RECIPE_CATEGORIES
      : FALLBACK_INGREDIENT_CATEGORIES;

  const displayedData =
    activeCategory === 'all' || categories.length === 0
      ? data
      : data.filter((item) => item.tags && item.tags.some((tag) => String(tag.id) === String(activeCategory)));

  return {
    router,
    activeTab,
    setActiveTab,
    profilePicture,
    activeCategory,
    setActiveCategory,
    fontsLoaded,
    data,
    loading,
    tagsError,
    displayedCategories,
    displayedData,
    handleItemPress,
  };
};
