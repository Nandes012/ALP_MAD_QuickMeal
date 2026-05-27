import { useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

import { useRecipeView } from '@/hooks/useRecipeView';
import { API_BASE_URL } from '@/constants/api';

export type ResepItem = {
  id: string;
  title: string;
  price: string;
  time: string;
  image: string;
  ingredients?: Array<{
    id?: string;
    ingredient_id?: string;
    ingredient_name?: string;
    quantity?: string;
    price_estimate?: number;
  }>;
};

export const useHasilRecResepController = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { saveRecipeView } = useRecipeView();
  const [recipes, setRecipes] = useState<ResepItem[]>([]);

  const time = params.time as string;
  const budgetMin = params.budgetMin as string;
  const budgetMax = params.budgetMax as string;
  const ingredients = params.ingredients as string;

  const cacheKey = useMemo(() => ['recipeRecommendations', time, budgetMin, budgetMax, ingredients], [time, budgetMin, budgetMax, ingredients]);

  const summaryTime = useMemo(() => {
    if (!time) return '-';
    const total = Number(time);
    const hours = Math.floor(total / 60);
    const minutes = total % 60;

    if (hours > 0 && minutes > 0) return `${hours} jam ${minutes} menit`;
    if (hours > 0) return `${hours} jam`;
    return `${minutes} menit`;
  }, [time]);

  const ingredientList = useMemo(() => {
    if (!ingredients) return [];
    return ingredients.split(',').map((item) => item.trim()).filter(Boolean);
  }, [ingredients]);

  const {
    data: queryRecipes = [],
    isLoading: loading,
    error: queryError,
  } = useQuery({
    queryKey: cacheKey,
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (time) queryParams.append('time', time);
      if (budgetMin) queryParams.append('budgetMin', budgetMin);
      if (budgetMax) queryParams.append('budgetMax', budgetMax);
      if (ingredients) queryParams.append('ingredients', ingredients);

      const response = await fetch(`${API_BASE_URL}/recipes?${queryParams.toString()}`);
      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const result = await response.json();
      if (!result?.success || !Array.isArray(result.data)) {
        throw new Error('Data rekomendasi tidak tersedia');
      }

      return result.data;
    },
    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 45,
    enabled: !!(time || budgetMin || budgetMax || ingredients),
  });

  useEffect(() => {
    if (Array.isArray(queryRecipes) && queryRecipes.length > 0) {
      const mappedRecipes = queryRecipes.map((item: any) => ({
        id: String(item.id),
        title: item.title || item.name || 'Resep',
        price: Number(item.totalIngredientPrice || item.price || 0).toLocaleString('id-ID'),
        time: item.cookingTime ? `${item.cookingTime} Menit` : '20 Menit',
        image: item.image || item.imageUrl || 'https://via.placeholder.com/300',
        ingredients: Array.isArray(item.ingredients) ? item.ingredients : [],
      }));

      setRecipes(mappedRecipes);
    }
  }, [queryRecipes]);

  const topRecipes = useMemo(() => recipes.slice(0, 3), [recipes]);
  const otherRecipes = useMemo(() => recipes.slice(3, 6), [recipes]);

  const handleRecipePress = (item: ResepItem) => {
    router.push({
      pathname: '/detail_resep',
      params: {
        id: item.id,
        name: item.title,
        imageUrl: item.image,
        price: item.price,
        time: item.time,
        ingredients: ingredients || '',
      },
    });

    saveRecipeView(item.id);
  };

  return {
    router,
    time,
    budgetMin,
    budgetMax,
    ingredients,
    summaryTime,
    ingredientList,
    loading,
    queryError,
    topRecipes,
    otherRecipes,
    handleRecipePress,
    saveRecipeView,
  };
};
