import { useEffect, useState } from 'react';
import { Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

import { API_BASE_URL } from '@/constants/api';

export type Location = {
  id: string;
  id_location: string;
  location_name: string;
  road_name?: string;
  opening_time?: string;
  closing_time?: string;
  google_maps_link?: string;
  location_picture?: string;
  price_per_kg_location?: number | null;
};

export const useBahanTersediaController = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const ingredients = params.ingredients ? String(params.ingredients) : '';
  const recipeName = params.recipeName ? String(params.recipeName) : '';
  const recipeIngredients = params.recipeIngredients ? String(params.recipeIngredients) : '';
  const missingIngredients = params.missingIngredients ? String(params.missingIngredients) : '';

  const [ownedIngredientList, setOwnedIngredientList] = useState<string[]>(
    ingredients ? ingredients.split(',').map((item) => item.trim()).filter(Boolean) : []
  );

  const [recipeIngredientList, setRecipeIngredientList] = useState<string[]>(
    recipeIngredients ? recipeIngredients.split(',').map((item) => item.trim()).filter(Boolean) : []
  );

  const [missingIngredientList, setMissingIngredientList] = useState<string[]>(
    missingIngredients ? missingIngredients.split(',').map((item) => item.trim()).filter(Boolean) : []
  );

  const [storesByIngredient, setStoresByIngredient] = useState<{ [key: string]: Location[] }>({});

  const {
    data: ingredientsList = [],
  } = useQuery({
    queryKey: ['allIngredients'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/ingredients`);
      if (!response.ok) throw new Error('Failed to fetch ingredients');
      const data = await response.json();
      return data.data || [];
    },
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
  });

  const {
    data: storesData = {},
    isLoading: loadingStores,
  } = useQuery({
    queryKey: ['missingIngredientStores', missingIngredientList],
    queryFn: async () => {
      if (missingIngredientList.length === 0) return {};

      const ingredientMap: { [key: string]: string } = {};
      ingredientsList.forEach((ing: any) => {
        ingredientMap[ing.name?.toLowerCase().trim()] = ing.id;
      });

      const stores: { [key: string]: Location[] } = {};

      for (const missingIng of missingIngredientList) {
        const lowerIng = missingIng.toLowerCase().trim();
        const ingredientId = ingredientMap[lowerIng];

        if (ingredientId) {
          try {
            const storesResponse = await fetch(`${API_BASE_URL}/ingredients/${ingredientId}/ingredient-locations`);
            if (storesResponse.ok) {
              const storesDataResponse = await storesResponse.json();
              stores[missingIng] = storesDataResponse.data || [];
            }
          } catch (caughtError) {
            console.warn(`Failed to fetch stores for ${missingIng}:`, caughtError);
            stores[missingIng] = [];
          }
        }
      }

      return stores;
    },
    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 45,
    enabled: missingIngredientList.length > 0 && ingredientsList.length > 0,
  });

  useEffect(() => {
    if (storesData && Object.keys(storesData).length > 0) {
      setStoresByIngredient(storesData);
    }
  }, [storesData]);

  useEffect(() => {
    const loadFromStorageIfNeeded = async () => {
      if (ownedIngredientList.length > 0 || recipeIngredientList.length > 0) return;

      try {
        const raw = await AsyncStorage.getItem('last_missing_ingredients');
        if (!raw) return;
        const parsed = JSON.parse(raw);
        if (parsed) {
          setOwnedIngredientList(Array.isArray(parsed.ownedIngredients) ? parsed.ownedIngredients : []);
          setRecipeIngredientList(Array.isArray(parsed.recipeIngredients) ? parsed.recipeIngredients : []);
          setMissingIngredientList(Array.isArray(parsed.missingIngredients) ? parsed.missingIngredients : []);
        }
      } catch (caughtError) {
        console.warn('Failed to load saved ingredient data', caughtError);
      }
    };

    loadFromStorageIfNeeded();
  }, [ownedIngredientList, recipeIngredientList]);

  const handleOpenMaps = (mapsLink?: string) => {
    if (mapsLink) {
      Linking.openURL(mapsLink).catch(() => {
        alert('Could not open maps link');
      });
    }
  };

  const formatTime = (time?: string) => {
    if (!time) return '-';
    return time;
  };

  return {
    router,
    recipeName,
    ownedIngredientList,
    recipeIngredientList,
    missingIngredientList,
    storesByIngredient,
    loadingStores,
    handleOpenMaps,
    formatTime,
  };
};
