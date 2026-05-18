import { useCallback, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@/constants/api';
import { Alert } from 'react-native';

export const useRecipeView = () => {
  const [saving, setSaving] = useState(false);

  const saveRecipeView = useCallback(async (recipeId: string | number): Promise<boolean> => {
    try {
      setSaving(true);

      // Get auth token
      const token = await AsyncStorage.getItem('auth_token');

      if (!token) {
        Alert.alert('Error', 'Silakan login terlebih dahulu untuk melihat detail resep');
        return false;
      }

      // Save to recent viewed recipes
      const response = await fetch(`${API_BASE_URL}/recent-viewed-recipes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          recipe_id: recipeId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData?.message || 'Gagal menyimpan resep yang dilihat';
        Alert.alert('Error', errorMessage);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error saving recipe view:', error);
      Alert.alert('Error', 'Terjadi kesalahan saat menyimpan resep yang dilihat');
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  return { saveRecipeView, saving };
};
