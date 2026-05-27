export type IngredientItem = {
  id: string;
  ingredient_id?: string;
  ingredient_name?: string;
  quantity?: string;
  price_estimate?: number;
};

export type ToolItem = {
  id: string;
  tool_name?: string;
  description?: string | null;
};

export type StepItem = {
  id: string;
  stepNumber?: number;
  description?: string;
};

export type RecipeDetail = {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  video?: string;
  cookingTime?: number;
  difficulty?: string;
  totalIngredientPrice?: number;
  ingredients: IngredientItem[];
  tools: ToolItem[];
  steps: StepItem[];
};

export type AvailabilityParams = {
  recipeId: string;
  recipeName: string;
  ingredients: string;
  recipeIngredients: string;
  missingIngredients: string;
};

export const getRecipeIngredientNames = (recipe: RecipeDetail | null): string[] => {
  if (!recipe || !Array.isArray(recipe.ingredients)) {
    return [];
  }

  return recipe.ingredients
    .map((ingredient: any) => (ingredient.ingredient_name || ingredient.name || '').toString().toLowerCase().trim())
    .filter(Boolean);
};
