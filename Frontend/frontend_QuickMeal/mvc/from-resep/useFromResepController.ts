import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { API_BASE_URL } from '@/constants/api';

type IngredientItem = {
  id: string;
  name?: string;
  ingredient_name?: string;
};

export const useFromResepController = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [bahan, setBahan] = useState(['', '', '']);
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [ingredients, setIngredients] = useState<IngredientItem[]>([]);
  const [loadingIngredients, setLoadingIngredients] = useState(false);
  const [dropdownVisibleIndex, setDropdownVisibleIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [fetchError, setFetchError] = useState('');

  const hoursArray = Array.from({ length: 24 }, (_, i) => i);
  const minutesArray = Array.from({ length: 60 }, (_, i) => i);
  const secondsArray = Array.from({ length: 60 }, (_, i) => i);
  const ITEM_HEIGHT = 40;

  const fetchAndCacheIngredients = async () => {
    try {
      const cached = await AsyncStorage.getItem('cached_ingredients');
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const cacheAge = Date.now() - timestamp;
        const CACHE_DURATION = 1000 * 60 * 30;

        if (cacheAge < CACHE_DURATION) {
          setIngredients(Array.isArray(data) ? data : []);
          setFetchError('');
          return;
        }
      }

      const response = await fetch(`${API_BASE_URL}/ingredients`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const result = await response.json();
      const ingredientList = result.data || result || [];
      const validList = Array.isArray(ingredientList) ? ingredientList : [];

      await AsyncStorage.setItem('cached_ingredients', JSON.stringify({
        data: validList,
        timestamp: Date.now()
      }));

      setIngredients(validList);
      setFetchError('');
    } catch (caughtError) {
      console.error('Error fetching ingredients:', caughtError);
      setFetchError('fetching failed');
      setIngredients([]);
    }
  };

  useEffect(() => {
    fetchAndCacheIngredients();
  }, []);

  useEffect(() => {
    if (step === 3) {
      setLoadingIngredients(true);
      fetchAndCacheIngredients().finally(() => setLoadingIngredients(false));
    }
  }, [step]);

  const handleBahanChange = (text: string, index: number) => {
    const newBahan = [...bahan];
    newBahan[index] = text;
    setBahan(newBahan);
  };

  const tambahBahan = () => {
    setBahan([...bahan, '']);
  };

  const hapusBahan = (index: number) => {
    if (bahan.length > 1) {
      setBahan(bahan.filter((_, i) => i !== index));
    }
  };

  const isNextDisabled = () => {
    if (step === 1) {
      return hours === 0 && minutes === 0 && seconds === 0;
    }
    if (step === 2) {
      return !budgetMin.trim() || !budgetMax.trim();
    }
    if (step === 3) {
      return bahan.some((item) => !item.trim());
    }
    return false;
  };

  const nextStep = async () => {
    if (step === 2) {
      if (!budgetMin.trim() || !budgetMax.trim()) {
        alert('Harap isi kedua field budget sebelum melanjutkan');
        return;
      }
    } else if (step === 3) {
      const hasEmptyBahan = bahan.some((item) => !item.trim());
      if (hasEmptyBahan) {
        alert('Harap isi semua field bahan sebelum melanjutkan');
        return;
      }
    }

    if (step < 3) {
      setStep(step + 1);
      return;
    }

    const totalMinutes = (hours * 60) + minutes + Math.round(seconds / 60);
    const formData = {
      time: totalMinutes.toString(),
      budgetMin,
      budgetMax,
      ingredients: bahan.filter((item) => item.trim()).join(','),
    };

    try {
      await AsyncStorage.setItem('owned_ingredients', formData.ingredients);
    } catch (caughtError) {
      console.warn('Failed to save owned ingredients', caughtError);
    }

    router.push({
      pathname: '/hasil_rec_resep',
      params: formData,
    });
  };

  return {
    router,
    step,
    setStep,
    bahan,
    budgetMin,
    setBudgetMin,
    budgetMax,
    setBudgetMax,
    hours,
    setHours,
    minutes,
    setMinutes,
    seconds,
    setSeconds,
    ingredients,
    loadingIngredients,
    dropdownVisibleIndex,
    setDropdownVisibleIndex,
    searchQuery,
    setSearchQuery,
    fetchError,
    hoursArray,
    minutesArray,
    secondsArray,
    ITEM_HEIGHT,
    handleBahanChange,
    tambahBahan,
    hapusBahan,
    isNextDisabled,
    nextStep,
  };
};
