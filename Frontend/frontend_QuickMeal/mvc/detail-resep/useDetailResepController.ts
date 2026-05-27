import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useVideoPlayer } from 'expo-video';

import { API_BASE_URL } from '@/constants/api';
import { useRecipeView } from '@/hooks/useRecipeView';
import { AvailabilityParams, RecipeDetail, getRecipeIngredientNames } from './detailResep.model';

export const useDetailResepController = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const recipeId = String(params.id ?? '');
  const fallbackName = params.name ? String(params.name) : 'Detail Resep';
  const fallbackImage = params.imageUrl ? decodeURIComponent(String(params.imageUrl)) : 'https://via.placeholder.com/900x600';
  const { saveRecipeView } = useRecipeView();

  const routeIngredients = params.ingredients ? String(params.ingredients) : '';

  const [availabilityParams, setAvailabilityParams] = useState<AvailabilityParams | null>(null);
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showIngredients, setShowIngredients] = useState(true);
  const [showTools, setShowTools] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [isVideoFullscreen, setIsVideoFullscreen] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string>('');

  const player = useVideoPlayer(videoUrl, (videoPlayer) => {
    videoPlayer.loop = false;
  });

  const {
    data: queryRecipe,
    isLoading: loading,
    isError: queryHasError,
  } = useQuery({
    queryKey: ['recipeDetail', recipeId],
    queryFn: async () => {
      if (!recipeId) throw new Error('Recipe ID not provided');
      const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}`);
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const result = await response.json();
      if (result?.success && result.data) return result.data;
      throw new Error('Invalid response from server');
    },
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    enabled: !!recipeId,
  });

  useEffect(() => {
    if (queryRecipe) {
      setRecipe(queryRecipe);
      setError(null);
    } else if (queryHasError) {
      setError('Failed to fetch recipe');
      setRecipe(null);
    }
  }, [queryRecipe, queryHasError]);

  useEffect(() => {
    if (recipe) {
      saveRecipeView(recipeId);

      try {
        const recipeIngredients = getRecipeIngredientNames(recipe);

        AsyncStorage.getItem('owned_ingredients').then((storedOwned) => {
          const ownedRaw = routeIngredients || storedOwned || '';
          const ownedList = ownedRaw
            ? ownedRaw.split(',').map((item) => item.trim()).filter(Boolean).map((item) => item.toLowerCase())
            : [];

          const missing = recipeIngredients.filter((name: string) => !ownedList.includes(name));

          const savePayload = {
            recipeId,
            recipeName: recipe.title || fallbackName,
            ownedIngredients: ownedList,
            recipeIngredients,
            missingIngredients: missing,
            computedAt: new Date().toISOString(),
          };

          AsyncStorage.setItem(`missing_for_recipe_${recipeId}`, JSON.stringify(savePayload));
          AsyncStorage.setItem('last_missing_ingredients', JSON.stringify(savePayload));

          setAvailabilityParams({
            recipeId,
            recipeName: recipe.title || fallbackName,
            ingredients: ownedList.join(','),
            recipeIngredients: recipeIngredients.join(','),
            missingIngredients: missing.join(','),
          });
        });
      } catch (caughtError) {
        console.warn('Failed to compute/save missing ingredients', caughtError);
      }
    }
  }, [recipe, recipeId, fallbackName, routeIngredients, saveRecipeView]);

  const handlePlayVideo = async () => {
    if (!recipe?.video) {
      alert('tidak ada video untuk resep ini terlebih dahulu');
      return;
    }

    const fullUrl = `${API_BASE_URL.replace('/api', '')}/${encodeURI(recipe.video)}`;
    setVideoUrl(fullUrl);
    setIsPlayingVideo(true);
    await ScreenOrientation.unlockAsync();
  };

  const handleStopVideo = async () => {
    setIsPlayingVideo(false);
    setIsVideoFullscreen(false);
    player.pause();
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
  };

  const handleRotateLandscape = async () => {
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
  };

  const handleOpenAvailability = () => {
    if (!availabilityParams) return;

    router.push({
      pathname: '/bahan_tersedia',
      params: availabilityParams,
    });
  };

  const name = recipe?.title || fallbackName;
  const imageUrl = recipe?.image || fallbackImage;
  const price = typeof recipe?.totalIngredientPrice === 'number' ? recipe.totalIngredientPrice.toLocaleString('id-ID') : '0';
  const time = recipe?.cookingTime ? `${recipe.cookingTime} Menit` : 'Tidak tersedia';
  const difficulty = recipe?.difficulty || 'Tidak diketahui';
  const ingredientsData = recipe?.ingredients || [];
  const toolsData = recipe?.tools || [];
  const stepsData = recipe?.steps || [];

  return {
    router,
    loading,
    error,
    recipe,
    name,
    imageUrl,
    price,
    time,
    difficulty,
    ingredientsData,
    toolsData,
    stepsData,
    showIngredients,
    setShowIngredients,
    showTools,
    setShowTools,
    showSteps,
    setShowSteps,
    isPlayingVideo,
    isVideoFullscreen,
    setIsVideoFullscreen,
    player,
    handlePlayVideo,
    handleStopVideo,
    handleRotateLandscape,
    handleOpenAvailability,
    availabilityParams,
    routeIngredients,
  };
};
