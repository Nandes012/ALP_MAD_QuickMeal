export type IngredientDetail = {
  id: string;
  name: string;
  ingredient_picture?: string | null;
  price_per_kg?: number | null;
  locations?: Location[];
};

export type Location = {
  id_location: string;
  location_name: string;
  road_name?: string | null;
  location_picture?: string | null;
  google_maps_link?: string | null;
  opening_time?: string | null;
  closing_time?: string | null;
  price_per_kg_location?: number | null;
  pivot?: {
    ingredient_id: string;
    id_location: string;
    price_per_kg_location?: number | null;
    created_at?: string;
    updated_at?: string;
  };
};

export const normalizeImageUrl = (apiBaseUrl: string, imagePath: string | null | undefined): string => {
  if (!imagePath) return 'https://via.placeholder.com/300';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
  return `${apiBaseUrl}${imagePath.startsWith('/') ? imagePath : '/' + imagePath}`;
};
