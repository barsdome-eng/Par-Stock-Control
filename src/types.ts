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
  // Packaging/Unit info
  baseUnitQty?: number;  // e.g., 700
  baseUnitType?: string; // e.g., 'ml', 'g', 'pcs'
  preferredUnit?: string; // e.g., 'btl', 'box', 'kg', 'l'
  // Garnish info
  isGarnish?: boolean;
  category?: string;
  dailyDepletion?: number; // amount used per day regardless of sales
  shelfLifeDays?: number;  // days until expiration
  lastRestockDate?: number; // timestamp
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
  portionSize: number; // amount poured per drink in ml
  steps: string[];
  ingredientMapping?: { [ingredientName: string]: string }; // Maps recipe ingredient name to stock ingredient name
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
