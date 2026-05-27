import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { API_BASE_URL } from '@/constants/api';

export type Ingredient = {
  id: string;
  ingredient_name: string;
  quantity: string;
  price_estimate: number;
};

export const useBahanPageController = () => {
  const router = useRouter();
  const { recipeId, name: nameParam } = useLocalSearchParams();
  const name = Array.isArray(nameParam) ? nameParam[0] : nameParam;

  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        if (!recipeId) {
          setError('Recipe ID not provided');
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}`);

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const result = await response.json();

        if (result?.success && result.data?.ingredients) {
          setIngredients(result.data.ingredients);
          setError(null);
        } else {
          setError('Failed to load ingredients');
        }
      } catch (caughtError) {
        console.error('Error fetching ingredients:', caughtError);
        setError(caughtError instanceof Error ? caughtError.message : 'Failed to fetch ingredients');
      } finally {
        setLoading(false);
      }
    };

    fetchIngredients();
  }, [recipeId]);

  return { router, name, ingredients, loading, error };
};
