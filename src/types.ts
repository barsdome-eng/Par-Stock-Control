export interface Ingredient {
  name: string;
  ml: number;
  isAlcohol?: boolean;
}

export interface Cocktail {
  id: string;
  name: string;
  ingredients: Ingredient[];
  category: 'Cocktail' | 'Spirit by Glass' | 'Spirit by Bottle';
}

export interface UsageRecord {
  cocktailId: string;
  quantity: number;
  timestamp: number;
}

export interface StockLevel {
  ingredientName: string;
  initialMl: number;
}

export interface DailyLog {
  date: string;
  usage: UsageRecord[];
  timestamp: number;
}

export interface BatchRecipe {
  id: string;
  name: string;
  baseVolume: number; // e.g., 20 for 20L
  ingredients: Ingredient[];
  steps: string[];
}

export interface BatchLog {
  id: string;
  recipeId: string;
  recipeName: string;
  targetVolume: number;
  timestamp: number;
  date: string;
}

export interface InventoryState {
  usage: UsageRecord[];
  stock: StockLevel[];
  logs: DailyLog[];
}

export interface BatchTimer {
  id: string;
  label: string;
  endTime: number; // timestamp
}

export interface ActiveBatch {
  recipeId: string;
  currentStep: number;
  targetVolume: number;
  startTime: number;
  timers: BatchTimer[];
}
