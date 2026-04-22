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

export interface InventoryState {
  usage: UsageRecord[];
  stock: StockLevel[];
  logs: DailyLog[];
}
