import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useFonts, Langar_400Regular } from '@expo-google-fonts/langar';

import { API_BASE_URL } from '@/constants/api';

export type FoodItem = {
  id: string;
  name: string;
  price: string;
  imageUri: string;
};

async function fetchList() {
  const res = await fetch(`${API_BASE_URL}/recipes`);
  if (!res.ok) throw new Error(`API error ${res.status}`);

  const json = await res.json();
  if (!json?.success || !Array.isArray(json.data)) {
    return [];
  }

  const recipes = json.data.map((recipe: any) => ({
    id: String(recipe.id),
    name: recipe.title || recipe.name || 'Resep',
    price: Number(recipe.totalIngredientPrice || recipe.price || 0).toLocaleString('id-ID'),
    imageUri: recipe.image || recipe.imageUrl || 'https://via.placeholder.com/300',
  }));

  return Array.from(new Map<string, FoodItem>(recipes.map((item: FoodItem) => [item.id, item])).values());
}

export const useExploreController = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'Masak' | 'Bahan'>('Masak');
  const [data, setData] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fontsLoaded] = useFonts({
    'Langar-Regular': Langar_400Regular,
  });

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      try {
        const list = await fetchList();
        if (mounted) {
          setData(list);
        }
      } catch (error) {
        console.error('Failed loading list:', error);
        if (mounted) {
          setData([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [activeTab]);

  const handleItemPress = (item: FoodItem) => {
    const cleanName = item.name.replace(/\s+/g, ' ').trim();

    if (activeTab === 'Masak') {
      router.push({
        pathname: '/detail_resep',
        params: {
          id: item.id,
          name: cleanName,
          imageUrl: item.imageUri,
        },
      });
      return;
    }

    router.push({
      pathname: '/detail_bahan',
      params: {
        id: item.id,
        name: cleanName,
        imageUrl: item.imageUri,
        price: item.price,
      },
    });
  };

  return {
    router,
    activeTab,
    setActiveTab,
    data,
    loading,
    fontsLoaded,
    handleItemPress,
  };
};
