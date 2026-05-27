import { useEffect, useState } from 'react';
import { Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

import { API_BASE_URL } from '@/constants/api';
import { IngredientDetail, Location, normalizeImageUrl } from './detailBahan.model';

export const useDetailBahanController = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const ingredientId = params.id ? String(params.id) : '';

  const [ingredient, setIngredient] = useState<IngredientDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    data: queryIngredient,
    isLoading: loading,
    isError: queryHasError,
  } = useQuery({
    queryKey: ['ingredientDetail', ingredientId],
    queryFn: async () => {
      if (!ingredientId) throw new Error('Ingredient ID not provided');
      const response = await fetch(`${API_BASE_URL}/ingredients/${ingredientId}`);
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const result = await response.json();
      if (result?.success && result.data) return result.data;
      throw new Error('Ingredient not found');
    },
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    enabled: !!ingredientId,
  });

  const {
    data: locations = [],
  } = useQuery({
    queryKey: ['ingredientLocations', ingredientId],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/ingredients/${ingredientId}/ingredient-locations`);
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const result = await response.json();
      if (result?.success && Array.isArray(result.data)) return result.data;
      return [];
    },
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    enabled: !!ingredientId,
  });

  useEffect(() => {
    if (queryIngredient) {
      setIngredient(queryIngredient);
      setError(null);
    } else if (queryHasError) {
      setError('Failed to fetch ingredient');
      setIngredient(null);
    }
  }, [queryIngredient, queryHasError]);

  const bahanName = (ingredient?.name || params.name ? String(ingredient?.name || params.name) : 'Bahan').replace(/\s+/g, ' ').trim();
  const bahanImage = normalizeImageUrl(API_BASE_URL, ingredient?.ingredient_picture || (params.imageUrl ? String(params.imageUrl) : null));
  let bahanPriceValue = '0';

  if (typeof ingredient?.price_per_kg === 'number') {
    bahanPriceValue = Number(ingredient.price_per_kg).toLocaleString('id-ID');
  } else if (params.price) {
    bahanPriceValue = String(params.price);
  }

  const basePriceNum = Number.parseInt(bahanPriceValue.replaceAll('.', ''), 10);
  const minPriceCalculated = Number.isNaN(basePriceNum) ? '0' : Number(Math.max(basePriceNum - 4000, 0)).toLocaleString('id-ID');
  const processedLocations = locations.map((location: Location) => ({
    ...location,
    fullImageUrl: normalizeImageUrl(API_BASE_URL, location.location_picture)
  }));

  const handleOpenMaps = async (locationLink: string | null | undefined) => {
    if (!locationLink) {
      alert('Link lokasi tidak tersedia');
      return;
    }

    try {
      const canOpen = await Linking.canOpenURL(locationLink);
      if (canOpen) {
        await Linking.openURL(locationLink);
      } else {
        alert('Tidak bisa membuka link lokasi');
      }
    } catch (caughtError) {
      console.error('Error opening maps:', caughtError);
      alert('Terjadi kesalahan saat membuka Google Maps');
    }
  };

  return {
    router,
    loading,
    error,
    ingredient,
    bahanName,
    bahanImage,
    bahanPriceValue,
    minPriceCalculated,
    processedLocations,
    handleOpenMaps,
  };
};
