/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, Calculator, Trash2, ChevronRight, ChevronDown, GlassWater, Info, Package, AlertTriangle, CheckCircle2, User as UserIcon, Bot, Zap, Sparkles, RefreshCcw, Plus, LogOut, LogIn, Cloud, CloudOff, AlarmClock, ArrowLeft, Timer as TimerIcon, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db, auth, signIn, logOut, handleFirestoreError } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  deleteDoc, 
  query, 
  where, 
  writeBatch, 
  getDocs,
  Timestamp,
  getDoc
} from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Cocktail, UsageRecord, StockLevel, DailyLog, Ingredient, BatchRecipe, BatchLog, ActiveBatch, BatchTimer } from './types';
import { cocktails as initialCocktails, spiritsByGlass45 as initialGlass45, spiritsByGlass30 as initialGlass30, spiritsByBottle as initialBottle } from './data/cocktails';
import { initialBatchRecipes } from './data/batchRecipes';

const ML_TO_OZ = 1 / 30;

const formatDate = (dateString: string | number) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const initialExcelOrder = [
  "Roku Gin 700 ml",
  "Bombay Sapphire Gin 750 ml",
  "Tanqueray Gin 750 ml",
  "NO.3 Gin 700 ml",
  "Hendrick's Gin 700 ml",
  "Tanqueray No.Ten Gin 750 ml",
  "Hoxton Tropical Gin 700 ml",
  "Canario Cachaca 1 L",
  "Matusalem Gran Reserva 23 years 700 ml",
  "Zacapa Centanario Rum 23 years 750 ml",
  "Bacardi Gran Reserva Diez 10 Years 700 ml",
  "Bacardi Carta Blanca 750 ml",
  "Bacardi Ocho 8 Years 700 ml",
  "Kraken Spiced Rum 700 ml",
  "Ciroc Vodka 750 ml",
  "Grey Goose Original 750 ml",
  "Stolichnaya Elit Vodka 700 ml",
  "Don Julio 1942 Tequila 750 ml",
  "Patron Silver Tequila 750 ml",
  "Patron Anejo Tequila 750 ml",
  "Patron Reposado Tequila 750 ml",
  "Patron El Alto Tequila 750 ml",
  "1800 Cristalino Anejo 750 ml",
  "Patron EL Cielo Tequila 700 ml",
  "Montelobos Mezcal Tequila 700 ml",
  "La Luna Mezcal 1 L",
  "Clase Azul Gold Tequila 750 ml",
  "Clase Azul Reposado Tequila 750 ml",
  "Clase Azul Anejo Tequila 750 ml",
  "Aperol 700 ml",
  "Campari 750 ml",
  "Campari Cask Tales 1000 ml",
  "Martini Rosso 1 L",
  "Martini Bianco 1 L",
  "Sacred English Spiced Vermouth 750 ml",
  "Sacred Rosehip Cup 750 ml",
  "Pimm No.1 700 ml",
  "Fernet Branca 1 L",
  "Cinzano Rosso 1 L 1757",
  "Cinzano 1757 Dry 1 L",
  "Cocchi Di Torino Extra Dry Vermouth 500 ml",
  "Tio Pepe Sherry 750 ml",
  "Dow's Port Wine Fine Ruby 750 ml",
  "Dow's Port Wine Fine Tawny 750 ml",
  "J/W Gold Reserve 750 ml",
  "J/W Blue Label 750 ml",
  "J/W Blue Label King George The V 750 ml",
  "Dewar's 12 Years 750 ml",
  "Dewar's 15 Years 1000 ml",
  "Dewar's 18 Years 750 ml",
  "Dewar's Double Double 21 Years 750 ml",
  "Lagavalin 16 years Whisky 700 ml",
  "Dewar's Double Double 27 Years 500 ml",
  "Aberfeldy 21 Years 750 ml",
  "Glenfiddich 18 Years 700 ml",
  "Glenfiddich 21 Years 700 ml",
  "Macallan 18 Years Sherry Oak Cask 700 ml",
  "Macallan Double Cask 18 Years 700 ml",
  "Macallan Rare Cask 700 ml",
  "Talisker whisky 10 year 700 ml",
  "Bulleit Rye Whisky 700 ml",
  "Bulleit Bourbon Whisky 700 ml",
  "Wild Turkey Aged 8 years Bourbon 700 ml",
  "Wild Turkey Rye 700 ml",
  "Bushmil Black Bush Irish Whiskey 700 ml",
  "Henessy VSOP 700 ml",
  "Henessy XO 700 ml",
  "Remy VSOP 700 ml",
  "Remy X.O. 700 ml",
  "Emishiki Sensation Sake 1.5 L",
  "Amaretto \"Disaronno\" 700 ml",
  "Amaro Averna 700 ml",
  "Bergamotto Fantastico 700 ml",
  "Mr Three and Bros Ginger Falernum 500 ml",
  "Baileys Cream 700 ml",
  "Benedictine DOM 700 ml",
  "Demonio De Los Andes Pisco 700 ml",
  "Cointreau 700 ml",
  "Blue Curacao 700 ml",
  "Creme De Mure 700 ml",
  "Creme De Cassis \"Giffard\" 700 ml",
  "Creme De Menthe Green \"Hiram\" 750 ml",
  "Creme De Cacao White \"BOLS\" 700 ml",
  "Grand Marnier 700 ml",
  "Drambuie 750 ml",
  "Frangelico 700 ml",
  "Galliano Vanilla Liqueur 700 ml",
  "Jagermeister Herb Liqueur 700 ml",
  "Strega Grancaffe 700 ml",
  "Lillet Blanc 750 ml",
  "Lustau Sherry Palo Cortado Peninsula 375 ml",
  "Luxardo Limoncello 750 ml",
  "Lychee Liqueur Kwai Feh 700 ml",
  "Peachtree (The Original) 700 ml",
  "Sambuca \"De Kuyper\" 750 ml",
  "Montenegro Amaro 750 ml",
  "St.German 700 ml",
  "Apricot Brandy 700 ml",
  "Midori Melon Liqueur 700 ml",
  "Creme De Violettes Massenez 700 ml",
  "Cherry Brandy \"De Kuyper\" 750 ml",
  "Cherry Heering 700 ml",
  "Dry Orange \"De Kuyper\" 700 ml",
  "Ayala Brut Majeur 750 ml",
  "Masottina Calmaggiore Prosecco 750 ml",
  "Silpin Jasmine Rice Syrup 500 ml",
  "Silpin Tamarind Syrup 500 ml",
  "Passionfruit Monin 700 ml",
  "Strawberry Monin 700 ml",
  "Pineapple Monin 700 ml",
  "Monin Rose 700 ml",
  "Hale Blue Boy Jasmine 710 ml",
  "White Wine (Sauvignon Blanc) 750 ml",
];

const EXCLUDED_INGREDIENTS = ['lemon juice', 'lime juice', 'simple syrup'];

const initialMapping: { [key: string]: string } = {
  "Roku": "Roku Gin 700 ml",
  "Bombay Sapphire": "Bombay Sapphire Gin 750 ml",
  "Tanqueray": "Tanqueray Gin 750 ml",
  "No.3": "NO.3 Gin 700 ml",
  "Hendricks": "Hendrick's Gin 700 ml",
  "Tanqueray 10": "Tanqueray No.Ten Gin 750 ml",
  "Hoxton Gin": "Hoxton Tropical Gin 700 ml",
  "Canario Cachaca": "Canario Cachaca 1 L",
  "Matusalem 23": "Matusalem Gran Reserva 23 years 700 ml",
  "Zacapa 23": "Zacapa Centanario Rum 23 years 750 ml",
  "Bacardi Diez": "Bacardi Gran Reserva Diez 10 Years 700 ml",
  "Bacardi White": "Bacardi Carta Blanca 750 ml",
  "Bacardi Ocho": "Bacardi Ocho 8 Years 700 ml",
  "Ciroc": "Ciroc Vodka 750 ml",
  "Grey Goose": "Grey Goose Original 750 ml",
  "Stolichnaya Elit": "Stolichnaya Elit Vodka 700 ml",
  "Don Julio 1942": "Don Julio 1942 Tequila 750 ml",
  "Patron Silver": "Patron Silver Tequila 750 ml",
  "Patron Anejo": "Patron Anejo Tequila 750 ml",
  "Patron Reposado": "Patron Reposado Tequila 750 ml",
  "Patron El Alto": "Patron El Alto Tequila 750 ml",
  "1800 Cristalino Anejo": "1800 Cristalino Anejo 750 ml",
  "Patron El Cielo": "Patron EL Cielo Tequila 700 ml",
  "Montelobos Espadin": "Montelobos Mezcal Tequila 700 ml",
  "La Luna Mezcal": "La Luna Mezcal 1 L",
  "Clase Azul Gold": "Clase Azul Gold Tequila 750 ml",
  "Clase Azul Reposado": "Clase Azul Reposado Tequila 750 ml",
  "Clase Azul Anejo": "Clase Azul Anejo Tequila 750 ml",
  "Aperol": "Aperol 700 ml",
  "Campari": "Campari 750 ml",
  "Campari Cask Tales": "Campari Cask Tales 1000 ml",
  "Martini Rosso": "Martini Rosso 1 L",
  "Martini Bianco": "Martini Bianco 1 L",
  "Sacred Spiced Vermouth": "Sacred English Spiced Vermouth 750 ml",
  "Sacred Rosehip Cup": "Sacred Rosehip Cup 750 ml",
  "Pimms No.1": "Pimm No.1 700 ml",
  "Fernet Branca": "Fernet Branca 1 L",
  "Cinzano 1757 Rosso": "Cinzano Rosso 1 L 1757",
  "Cinzano 1757 Dry": "Cinzano 1757 Dry 1 L",
  "Cocchi Extra Dry": "Cocchi Di Torino Extra Dry Vermouth 500 ml",
  "Tio Pepe Sherry": "Tio Pepe Sherry 750 ml",
  "Dow's Ruby": "Dow's Port Wine Fine Ruby 750 ml",
  "Dow's Tawny": "Dow's Port Wine Fine Tawny 750 ml",
  "Johnnie Walker Gold": "J/W Gold Reserve 750 ml",
  "Johnnie Walker Blue Label": "J/W Blue Label 750 ml",
  "Johnnie Walker King George": "J/W Blue Label King George The V 750 ml",
  "Dewars 12": "Dewar's 12 Years 750 ml",
  "Dewars 15": "Dewar's 15 Years 1000 ml",
  "Dewars 18": "Dewar's 18 Years 750 ml",
  "Dewars Double Double 21": "Dewar's Double Double 21 Years 750 ml",
  "Lagavulin 16": "Lagavalin 16 years Whisky 700 ml",
  "Dewars Double Double 27 Years": "Dewar's Double Double 27 Years 500 ml",
  "Aberfeldy 21": "Aberfeldy 21 Years 750 ml",
  "Glenfiddich 18": "Glenfiddich 18 Years 700 ml",
  "Glenfiddich 21": "Glenfiddich 21 Years 700 ml",
  "Macallan 18 Sherry Oak": "Macallan 18 Years Sherry Oak Cask 700 ml",
  "Macallan Sherry Oak 18": "Macallan 18 Years Sherry Oak Cask 700 ml",
  "Macallan Double Cask 18": "Macallan Double Cask 18 Years 700 ml",
  "Macallan Rare Cask": "Macallan Rare Cask 700 ml",
  "Talisker 10": "Talisker whisky 10 year 700 ml",
  "Bulleit Rye": "Bulleit Rye Whisky 700 ml",
  "Bulleit Bourbon": "Bulleit Bourbon Whisky 700 ml",
  "Wild Turkey Bourbon": "Wild Turkey Aged 8 years Bourbon 700 ml",
  "Wild Turkey Rye": "Wild Turkey Rye 700 ml",
  "Bushmills Black": "Bushmil Black Bush Irish Whiskey 700 ml",
  "Hennessy VSOP": "Henessy VSOP 700 ml",
  "Hennessy XO": "Henessy XO 700 ml",
  "Remy Martin VSOP": "Remy VSOP 700 ml",
  "Remy Martin XO": "Remy X.O. 700 ml",
  "Disaronno Amaretto": "Amaretto \"Disaronno\" 700 ml",
  "Amaro Averna": "Amaro Averna 700 ml",
  "Bergamotto Fantastico Bergamot Liqueur": "Bergamotto Fantastico 700 ml",
  "Ginger Falernum": "Mr Three and Bros Ginger Falernum 500 ml",
  "Baileys": "Baileys Cream 700 ml",
  "DOM Benedictine": "Benedictine DOM 700 ml",
  "Demonio Los Andes Pisco": "Demonio De Los Andes Pisco 700 ml",
  "Cointreau": "Cointreau 700 ml",
  "Blue Curacao": "Blue Curacao 700 ml",
  "Creme De Mure": "Creme De Mure 700 ml",
  "Creme de Cassis": "Creme De Cassis \"Giffard\" 700 ml",
  "Creme de Menthe Green": "Creme De Menthe Green \"Hiram\" 750 ml",
  "Creme de Cacao White": "Creme De Cacao White \"BOLS\" 700 ml",
  "Grand Marnier": "Grand Marnier 700 ml",
  "Drambuie": "Drambuie 750 ml",
  "Frangelico": "Frangelico 700 ml",
  "Galliano Vanilla Liqueur": "Galliano Vanilla Liqueur 700 ml",
  "Jagermeister": "Jagermeister Herb Liqueur 700 ml",
  "Strega Coffee Liqueur": "Strega Grancaffe 700 ml",
  "Lillet Blanc": "Lillet Blanc 750 ml",
  "Lustau Sherry": "Lustau Sherry Palo Cortado Peninsula 375 ml",
  "Lustau Sherry Palo Cortado Peninsula": "Lustau Sherry Palo Cortado Peninsula 375 ml",
  "Limoncello": "Luxardo Limoncello 750 ml",
  "Kwai Feh Lychee Liqueur": "Lychee Liqueur Kwai Feh 700 ml",
  "Peachtree Peach Liqueur": "Peachtree (The Original) 700 ml",
  "Sambuca": "Sambuca \"De Kuyper\" 750 ml",
  "Montenegro Amaro": "Montenegro Amaro 750 ml",
  "St. Germain": "St.German 700 ml",
  "Apricot Brandy": "Apricot Brandy 700 ml",
  "Midori": "Midori Melon Liqueur 700 ml",
  "Creme de Violette": "Creme De Violettes Massenez 700 ml",
  "Cherry Brandy": "Cherry Brandy \"De Kuyper\" 750 ml",
  "Cherry Heering": "Cherry Heering 700 ml",
  "Dry Orange": "Dry Orange \"De Kuyper\" 700 ml",
  "Ayala Brut": "Ayala Brut Majeur 750 ml",
  "Masottina Prosecco": "Masottina Calmaggiore Prosecco 750 ml",
  "Palo Cortado Sherry": "Lustau Sherry Palo Cortado Peninsula 375 ml",
  "Dows Tawny": "Dow's Port Wine Fine Tawny 750 ml",
  "Dows Ruby": "Dow's Port Wine Fine Ruby 750 ml",
  "Dry Vermouth": "Cocchi Di Torino Extra Dry Vermouth 500 ml",
  "Kraken Spiced Rum": "Kraken Spiced Rum 700 ml",
  "Emishiki Sensation Sake": "Emishiki Sensation Sake 1.5 L",
  "Hops (grams)": "Hops (grams)",
  "Dried butterfly pea flowers (grams)": "Dried Butterfly Pea Flowers (grams)",
  "Mango Juice": "Mango Juice (1L)",
  "Coconut Juice": "Coconut Juice (1L)",
  "Guava Juice": "Guava Juice (1L)",
  "Simple syrup": "Simple Syrup (1L)",
  "Agave syrup": "Agave Syrup (1L)",
  "Ginger ale": "Ginger Ale (330ml)",
  "Tonic water": "Tonic Water (330ml)",
  "Club soda": "Club Soda (330ml)",
  "Orange juice": "Orange Juice (1L)",
  "Pineapple juice": "Pineapple Juice (1L)",
  "Lime juice": "Lime Juice (1L)",
  "Lemon juice": "Lemon Juice (1L)",
  "Silpin Jasmine Rice Syrup 500 ml": "Silpin Jasmine Rice Syrup 500 ml",
  "Silpin Tamarind Syrup 500 ml": "Silpin Tamarind Syrup 500 ml",
  "Monin Rose 700 ml": "Monin Rose Syrup 700 ml",
  "Coconut Monin 700 ml": "Monin Coconut Syrup 700 ml",
  "Passionfruit Monin 700 ml": "Monin Passionfruit Syrup 700 ml",
  "Strawberry Monin 700 ml": "Monin Strawberry Syrup 700 ml",
  "Pineapple Monin 700 ml": "Monin Pineapple Syrup 700 ml",
  "Butterscotch Monin 700 ml": "Monin Butterscotch Syrup 700 ml",
  "White Wine (Sauvignon Blanc) 750 ml": "White Wine (Sauvignon Blanc) 750 ml",
  "Earl Grey tea (grams)": "Earl Grey Tea (grams)",
  "Oolong tea (grams)": "Oolong Tea (grams)",
  "Palm sugar (grams)": "Palm Sugar (grams)",
  "Citric acid (grams)": "Citric Acid (grams)",
  "Malic acid (grams)": "Malic Acid (grams)",
  "Salt (grams)": "Salt (grams)",
  "Hale Blue Boy Jasmine 710 ml": "Hale Blue Boy Jasmine 710 ml",
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [history, setHistory] = useState<{usage: UsageRecord[], stock: StockLevel[]}[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [recipeSearchQuery, setRecipeSearchQuery] = useState('');
  const [stockSearchQuery, setStockSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState<'alcohol' | 'non-alcohol'>('alcohol');
  const [stockInputUnits, setStockInputUnits] = useState<{[name: string]: string}>({});
  const [manualNonAlcoholic, setManualNonAlcoholic] = useState<string[]>([]);
  const [batchSearchQuery, setBatchSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Cocktail' | 'Spirit by Glass' | 'Spirit by Bottle'>('All');
  const [activeTab, setActiveTab] = useState('par-cutting');
  
  const [cocktails, setCocktails] = useState<Cocktail[]>(() => {
    const cached = localStorage.getItem('skybar_cocktails_v1');
    return cached ? JSON.parse(cached) : initialCocktails;
  });

  const [spiritsByGlass45, setSpiritsByGlass45] = useState<string[]>(() => {
    const cached = localStorage.getItem('skybar_glass45_v1');
    return cached ? JSON.parse(cached) : initialGlass45;
  });

  const [spiritsByGlass30, setSpiritsByGlass30] = useState<string[]>(() => {
    const cached = localStorage.getItem('skybar_glass30_v1');
    return cached ? JSON.parse(cached) : initialGlass30;
  });

  const [spiritsByBottle, setSpiritsByBottle] = useState<{name: string, ml: number}[]>(() => {
    const cached = localStorage.getItem('skybar_bottle_v1');
    return cached ? JSON.parse(cached) : initialBottle;
  });

  const [excelOrder, setExcelOrder] = useState<string[]>(() => {
    const cached = localStorage.getItem('skybar_excelOrder_v1');
    return cached ? JSON.parse(cached) : initialExcelOrder;
  });

  const [spiritMapping, setSpiritMapping] = useState<{ [key: string]: string }>(() => {
    const cached = localStorage.getItem('skybar_mapping_v1');
    return cached ? JSON.parse(cached) : initialMapping;
  });

  const [batchRecipes, setBatchRecipes] = useState<BatchRecipe[]>(() => {
    const cached = localStorage.getItem('skybar_batch_recipes_v1');
    return cached ? JSON.parse(cached) : initialBatchRecipes;
  });

  const [batchLogs, setBatchLogs] = useState<BatchLog[]>(() => {
    const cached = localStorage.getItem('skybar_batch_logs_v1');
    return cached ? JSON.parse(cached) : [];
  });

  const [activeBatch, setActiveBatch] = useState<ActiveBatch | null>(() => {
    const cached = localStorage.getItem('skybar_active_batch_v1');
    return cached ? JSON.parse(cached) : null;
  });

  const [timerTick, setTimerTick] = useState(0);

  // Generated items
  const formatIngredientSize = (val: number, unit: string) => {
    if (unit === 'kg' || unit === 'g') {
      if (val >= 1000) return `${val/1000} KG`;
      return `${val} g`;
    }
    if (unit === 'l' || unit === 'ml') {
      if (val >= 1000) return `${val/1000} L`;
      return `${val} ml`;
    }
    if (unit === 'unit') return `${val} Unit`;
    return `${val} Btl`;
  };

  const btlSizeLabel = (ml: number) => {
    if(ml >= 1000) return `${ml/1000} L`;
    return `${ml} ml`;
  };

  const fullCocktailList = useMemo(() => {
    const glass45 = spiritsByGlass45.map(name => ({
      id: `glass-45-${name.toLowerCase().replace(/\s+/g, '-')}`,
      name: `${name} (45ml)`,
      category: 'Spirit by Glass' as const,
      ingredients: [{ name, ml: 45, isAlcohol: true }]
    }));

    const glass30 = spiritsByGlass30.map(name => ({
      id: `glass-30-${name.toLowerCase().replace(/\s+/g, '-')}`,
      name: `${name} (30ml)`,
      category: 'Spirit by Glass' as const,
      ingredients: [{ name, ml: 30, isAlcohol: true }]
    }));

    const btl = spiritsByBottle.map(item => {
      const isAlch = !manualNonAlcoholic.includes(item.name);
      const unit = stockInputUnits[item.name] || (isAlch ? 'ml' : 'ml');
      const formattedSize = formatIngredientSize(item.ml, unit);
      return {
        id: `btl-${item.name.toLowerCase().replace(/\s+/g, '-')}`,
        name: `${item.name} (${formattedSize}${isAlch ? ' Btl' : ''})`,
        category: (isAlch ? 'Spirit by Bottle' : 'Non-Alcoholic Item') as any,
        ingredients: [{ name: item.name, ml: item.ml, isAlcohol: isAlch }]
      };
    });

    return [...cocktails, ...glass45, ...glass30, ...btl].sort((a, b) => a.name.localeCompare(b.name));
  }, [cocktails, spiritsByGlass45, spiritsByGlass30, spiritsByBottle, manualNonAlcoholic, stockInputUnits]);

  const [quantityInput, setQuantityInput] = useState('1');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const cocktailRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const quantityInputRef = useRef<HTMLInputElement>(null);

  const [isRecipeDialogOpen, setIsRecipeDialogOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Cocktail | null>(null);
  const [isSpiritDialogOpen, setIsSpiritDialogOpen] = useState(false);
  const [spiritMode, setSpiritMode] = useState<'add' | 'remove'>('add');
  const [expandedMonths, setExpandedMonths] = useState<string[]>([]);
  const [selectedBatchRecipe, setSelectedBatchRecipe] = useState<BatchRecipe | null>(null);
  const [batchVolumeInput, setBatchVolumeInput] = useState<string>('');
  const [editingSpirit, setEditingSpirit] = useState<string | null>(null);
  const [newSpiritName, setNewSpiritName] = useState('');
  const [newSpiritBtlSize, setNewSpiritBtlSize] = useState('750');
  const [newSpiritGlassSize, setNewSpiritGlassSize] = useState('45');
  const [newSpiritPosition, setNewSpiritPosition] = useState('');
  const [newSpiritUnit, setNewSpiritUnit] = useState('ml');
  const [spiritsToRemove, setSpiritsToRemove] = useState<string[]>([]);
  const [recipeName, setRecipeName] = useState('');
  const [recipeIngredients, setRecipeIngredients] = useState<Ingredient[]>([]);
  const [newIngName, setNewIngName] = useState('');
  const [newIngMl, setNewIngMl] = useState('');

  const allIngredients = useMemo(() => {
    const displayToInternal = new Map<string, { internalName: string, isAlcohol: boolean }>();
    const allInternalInfo = new Map<string, boolean>();
    
    fullCocktailList.forEach(c => c.ingredients.forEach(i => {
      // If we've seen it as alcohol once, keep it as alcohol
      const existing = allInternalInfo.get(i.name);
      allInternalInfo.set(i.name, existing || i.isAlcohol || false);
    }));

    Object.keys(spiritMapping).forEach(k => {
      if (!allInternalInfo.has(k)) {
        allInternalInfo.set(k, true);
      }
    });

    // Final override pass: manual non-alcohol settings always win
    manualNonAlcoholic.forEach(name => {
      allInternalInfo.set(name, false);
    });

    allInternalInfo.forEach((isAlch, internalName) => {
      if (EXCLUDED_INGREDIENTS.includes(internalName.toLowerCase())) return;
      const displayName = spiritMapping[internalName] || internalName;
      if (!displayToInternal.has(displayName)) {
        displayToInternal.set(displayName, { internalName, isAlcohol: isAlch });
      }
    });

    return Array.from(displayToInternal.values());
  }, [fullCocktailList, spiritMapping]);

  const getExcelDisplayName = (internalName: any) => {
    if (typeof internalName !== 'string') return '';
    return spiritMapping[internalName] || internalName;
  };

  const getExcelSortIndex = (internalName: string) => {
    const excelName = getExcelDisplayName(internalName);
    const index = excelOrder.indexOf(excelName);
    return index === -1 ? 999 : index;
  };

  const [usage, setUsage] = useState<UsageRecord[]>([]);
  
  const [stock, setStock] = useState<StockLevel[]>(() => {
    const cached = localStorage.getItem('skybar_stock_cache');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        // Safety check to prevent objects leaking into ingredientName
        const isValid = Array.isArray(parsed) && parsed.every(s => s && typeof s.ingredientName === 'string');
        
        if (isValid) {
          const cacheMap = new Map(parsed.map((s: StockLevel) => [s.ingredientName, s.initialMl]));
          // We initialize with what's in local storage, but mapped to our dynamic ingredient list
          return allIngredients.map(i => ({
            ingredientName: i.internalName,
            initialMl: cacheMap.get(i.internalName) || 0
          }));
        }
      } catch (e) {
        console.error("Cache parse error", e);
      }
    }
    return allIngredients.map(i => ({ ingredientName: i.internalName, initialMl: 0 }));
  });

  // Sync missing items to stock if allIngredients changes
  useEffect(() => {
    setStock(prev => {
      const currentNames = new Set(prev.map(s => s.ingredientName));
      const hasChanged = allIngredients.some(i => !currentNames.has(i.internalName)) || 
                        prev.some(s => !allIngredients.find(ai => ai.internalName === s.ingredientName));
      
      if (hasChanged) {
        return allIngredients.map(i => {
          const existing = prev.find(s => s.ingredientName === i.internalName);
          return existing || { ingredientName: i.internalName, initialMl: 0 };
        });
      }
      return prev;
    });
  }, [allIngredients]);

  // Persist schema-affecting states
  useEffect(() => localStorage.setItem('skybar_cocktails_v1', JSON.stringify(cocktails)), [cocktails]);
  useEffect(() => localStorage.setItem('skybar_glass45_v1', JSON.stringify(spiritsByGlass45)), [spiritsByGlass45]);
  useEffect(() => localStorage.setItem('skybar_glass30_v1', JSON.stringify(spiritsByGlass30)), [spiritsByGlass30]);
  useEffect(() => localStorage.setItem('skybar_bottle_v1', JSON.stringify(spiritsByBottle)), [spiritsByBottle]);
  useEffect(() => localStorage.setItem('skybar_excelOrder_v1', JSON.stringify(excelOrder)), [excelOrder]);
  useEffect(() => localStorage.setItem('skybar_mapping_v1', JSON.stringify(spiritMapping)), [spiritMapping]);
  useEffect(() => localStorage.setItem('skybar_batch_recipes_v1', JSON.stringify(batchRecipes)), [batchRecipes]);
  useEffect(() => localStorage.setItem('skybar_batch_logs_v1', JSON.stringify(batchLogs)), [batchLogs]);
  useEffect(() => localStorage.setItem('skybar_active_batch_v1', JSON.stringify(activeBatch)), [activeBatch]);

  // Audio for alarm
  const playAlarm = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A5 note
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 1);

    // Try to trigger vibration as well
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }

    // Show browser notification
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Batching Alert", {
        body: "Infusion timer finished!",
        icon: "/favicon.ico"
      });
    }
  };

  // Timer Tick & State Maintenance useEffect
  useEffect(() => {
    const interval = setInterval(() => {
      if (!activeBatch) return;
      
      // Update visual tick
      setTimerTick(t => t + 1);

      if (activeBatch.timers.length === 0) return;

      const now = Date.now();
      const expiredTimers = activeBatch.timers.filter(t => now >= t.endTime);
      
      if (expiredTimers.length > 0) {
        playAlarm();
        // Remove expired timers from state
        setActiveBatch(prev => {
          if (!prev) return null;
          const stillActive = prev.timers.filter(t => now < t.endTime);
          // Only update if something actually changed to avoid infinite pulses
          if (stillActive.length === prev.timers.length) return prev;
          return {
            ...prev,
            timers: stillActive
          };
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeBatch]);

  // Request notification permission on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const startBatch = (recipe: BatchRecipe, volume: number) => {
    setActiveBatch({
      recipeId: recipe.id,
      currentStep: 0,
      targetVolume: volume,
      startTime: Date.now(),
      timers: []
    });
  };

  const setStepTimer = (minutes: number, label: string) => {
    if (!activeBatch) return;
    
    // Check for existing timer with same label to avoid duplicates
    if (activeBatch.timers.some(t => t.label === label)) return;

    const newTimer: BatchTimer = {
      id: Math.random().toString(36).substr(2, 9),
      label,
      endTime: Date.now() + minutes * 60 * 1000
    };

    setActiveBatch(prev => {
      if (!prev) return null;
      return {
        ...prev,
        timers: [...prev.timers, newTimer]
      };
    });
    
    alert("Press OK to set alarm and continue with next steps, no need to wait until infusion is done.");
  };

  const getStepInfusionTime = (step: string): number | null => {
    const match = step.match(/(\d+)\s*(?:minute|minutes|min|mins)/i);
    return match ? parseInt(match[1]) : null;
  };

  // Keep tracking logs in local storage as well
  const [logs, setLogs] = useState<DailyLog[]>(() => {
    const cached = localStorage.getItem('skybar_logs_cache');
    return cached ? JSON.parse(cached) : [];
  });

  const APP_VERSION = "1.0.0";

  // Auto-save stock to local storage on change
  useEffect(() => {
    localStorage.setItem('skybar_stock_cache', JSON.stringify(stock));
  }, [stock]);

  // Auto-save logs to local storage on change
  useEffect(() => {
    localStorage.setItem('skybar_logs_cache', JSON.stringify(logs));
  }, [logs]);

  // --- FIREBASE SYNC LOGIC ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setIsAuthLoading(false);
      if (!u) {
        // Reset to local storage or initials on logout
        setCocktails(initialCocktails);
        setSpiritsByGlass45(initialGlass45);
        setSpiritsByGlass30(initialGlass30);
        setSpiritsByBottle(initialBottle);
        setExcelOrder(initialExcelOrder);
        setSpiritMapping(initialMapping);
        setManualNonAlcoholic([]);
        setStockInputUnits({});
        setLogs([]);
        setStock(allIngredients.map(i => ({ ingredientName: i.internalName, initialMl: 0 })));
        setHistory([]);
      }
    });
    return () => unsubscribe();
  }, [allIngredients]);

  // Listeners for Firestore data
  useEffect(() => {
    if (!user) return;

    const qCocktails = query(collection(db, 'cocktails'), where('userId', '==', user.uid));
    const unsubCocktails = onSnapshot(qCocktails, (snapshot) => {
      const cloudData = snapshot.docs.map(d => d.data() as Cocktail);
      if (cloudData.length > 0) {
        setCocktails(prev => {
          // Merge: Cloud overrides initial if ID matches, else add cloud items
          const merged = [...initialCocktails];
          cloudData.forEach(cc => {
            const idx = merged.findIndex(c => c.id === cc.id);
            if (idx !== -1) merged[idx] = cc;
            else merged.push(cc);
          });
          return merged;
        });
      }
    }, (err) => console.error("Cocktails sync error", err));

    const qStock = query(collection(db, 'stock'), where('userId', '==', user.uid));
    const unsubStock = onSnapshot(qStock, (snapshot) => {
      const data = snapshot.docs.map(d => d.data() as StockLevel);
      if (data.length > 0) {
        setStock(prev => {
          const newStock = [...prev];
          data.forEach(s => {
            const idx = newStock.findIndex(ns => ns.ingredientName === s.ingredientName);
            if (idx !== -1) newStock[idx] = s;
            else newStock.push(s);
          });
          return newStock;
        });
      }
    });

    const qLogs = query(collection(db, 'logs'), where('userId', '==', user.uid));
    const unsubLogs = onSnapshot(qLogs, (snapshot) => {
      const data = snapshot.docs.map(d => d.data() as DailyLog);
      if (data.length > 0) setLogs(data.sort((a,b) => b.timestamp - a.timestamp));
    });

    const unsubSettings = onSnapshot(doc(db, 'settings', user.uid), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.spiritsByGlass45) setSpiritsByGlass45(data.spiritsByGlass45);
        if (data.spiritsByGlass30) setSpiritsByGlass30(data.spiritsByGlass30);
        if (data.spiritsByBottle) setSpiritsByBottle(data.spiritsByBottle);
        if (data.excelOrder) setExcelOrder(data.excelOrder);
        if (data.spiritMapping) setSpiritMapping(data.spiritMapping);
        if (data.manualNonAlcoholic) setManualNonAlcoholic(data.manualNonAlcoholic);
        if (data.stockInputUnits) setStockInputUnits(data.stockInputUnits);
      }
    });

    const qBatchRecipes = query(collection(db, 'batchRecipes'), where('userId', '==', user.uid));
    const unsubBatchRecipes = onSnapshot(qBatchRecipes, (snapshot) => {
      const data = snapshot.docs.map(d => d.data() as BatchRecipe);
      if (data.length > 0) {
        setBatchRecipes(prev => {
          const merged = [...initialBatchRecipes];
          data.forEach(br => {
            const idx = merged.findIndex(p => p.id === br.id);
            if (idx !== -1) merged[idx] = br;
            else merged.push(br);
          });
          return merged;
        });
      }
    });

    const qBatchLogs = query(collection(db, 'batchLogs'), where('userId', '==', user.uid));
    const unsubBatchLogs = onSnapshot(qBatchLogs, (snapshot) => {
      const data = snapshot.docs.map(d => d.data() as BatchLog);
      if (data.length > 0) setBatchLogs(data.sort((a,b) => b.timestamp - a.timestamp));
    });

    return () => {
      unsubCocktails();
      unsubStock();
      unsubLogs();
      unsubSettings();
      unsubBatchRecipes();
      unsubBatchLogs();
    };
  }, [user]);

  // Migration logic
  const migrateToCloud = async () => {
    if (!user || isSyncing) return;
    setIsSyncing(true);
    try {
      const batch = writeBatch(db);
      
      // Check if already migrated by checking settings
      const settingsRef = doc(db, 'settings', user.uid);
      const settingsSnap = await getDoc(settingsRef);
      if (settingsSnap.exists()) {
        setIsSyncing(false);
        return;
      }

      // Settings
      batch.set(settingsRef, {
        userId: user.uid,
        spiritsByGlass45,
        spiritsByGlass30,
        spiritsByBottle,
        excelOrder,
        spiritMapping,
        updatedAt: Timestamp.now()
      });

      // Cocktails (only custom ones)
      cocktails.forEach(c => {
        batch.set(doc(db, 'cocktails', c.id), { ...c, userId: user.uid, updatedAt: Timestamp.now() });
      });

      // Stock
      stock.forEach(s => {
        const id = s.ingredientName.toLowerCase().replace(/\s+/g, '-');
        batch.set(doc(db, 'stock', id), { ...s, userId: user.uid, updatedAt: Timestamp.now() });
      });

      // Logs
      logs.forEach(l => {
        batch.set(doc(db, 'logs', l.date), { ...l, userId: user.uid });
      });

      // Batch Recipes
      batchRecipes.forEach(br => {
        batch.set(doc(db, 'batchRecipes', br.id), { ...br, userId: user.uid });
      });

      // Batch Logs
      batchLogs.forEach(bl => {
        batch.set(doc(db, 'batchLogs', bl.id), { ...bl, userId: user.uid });
      });

      await batch.commit();
      alert("Local data successfully synced to the cloud!");
    } catch (err) {
      console.error("Migration error", err);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    if (user && !isAuthLoading) {
      migrateToCloud();
    }
  }, [user, isAuthLoading]);

  const [selectedCocktail, setSelectedCocktail] = useState<Cocktail | null>(null);
  const [selectedLog, setSelectedLog] = useState<DailyLog | null>(null);
  const [logToDelete, setLogToDelete] = useState<string | null>(null);
  // Initialize expandedMonths with the most recent month
  useEffect(() => {
    if (logs.length > 0 && expandedMonths.length === 0) {
      const mostRecent = new Date(logs[0].timestamp);
      const monthYear = mostRecent.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      setExpandedMonths([monthYear]);
    }
  }, [logs]);

  // Clean up logs older than 365 days (Full year retention)
  useEffect(() => {
    const oneYearAgo = Date.now() - (365 * 24 * 60 * 60 * 1000);
    setLogs(prev => {
      const filtered = prev.filter(log => log.timestamp > oneYearAgo);
      if (filtered.length !== prev.length) {
        return filtered;
      }
      return prev;
    });
  }, []);

  // Handle auto-focus and selection for quantity input
  useEffect(() => {
    if (selectedCocktail) {
      // Small timeout to ensure dialog is rendered and focus management doesn't fight back
      const timer = setTimeout(() => {
        quantityInputRef.current?.focus();
        quantityInputRef.current?.select();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [selectedCocktail]);

  const handleSignIn = async () => {
    if (isSigningIn) return;
    setIsSigningIn(true);
    try {
      await signIn();
    } catch (err) {
      console.error("Sign in failed:", err);
    } finally {
      setIsSigningIn(false);
    }
  };

  const SIGNATURE_COCKTAILS = ['Dome266', 'Dome Colada', 'Sukhumvit After Dark', 'Khaosan Regret', 'Jodd Fair Gluttony', 'Sunset at Chao Phraya', 'BTS Highball', 'Hotel Lobby Drams'];

  const monthlySummary = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyLogs = logs.filter(log => {
      const logDate = new Date(log.date);
      return logDate.getMonth() === currentMonth && logDate.getFullYear() === currentYear;
    });

    const itemTallies: { [id: string]: number } = {};
    let signatures = 0;
    let classics = 0;
    let spirits = 0;

    monthlyLogs.forEach(log => {
      log.usage.forEach(record => {
        itemTallies[record.cocktailId] = (itemTallies[record.cocktailId] || 0) + record.quantity;
        
        const item = fullCocktailList.find(c => c.id === record.cocktailId);
        if (item) {
          if (item.category === 'Cocktail') {
            if (SIGNATURE_COCKTAILS.includes(item.name)) signatures += record.quantity;
            else classics += record.quantity;
          } else {
            spirits += record.quantity;
          }
        }
      });
    });

    let topSellerId = '';
    let maxQty = 0;
    Object.entries(itemTallies).forEach(([id, qty]) => {
      if (qty > maxQty) {
        maxQty = qty;
        topSellerId = id;
      }
    });

    const topSeller = fullCocktailList.find(c => c.id === topSellerId);

    return { signatures, classics, spirits, topSeller, topSellerQty: maxQty };
  }, [logs, fullCocktailList]);

  const getCategoryStats = (usageRecords: UsageRecord[]) => {
    let signatures = 0, classics = 0, spirits = 0;
    usageRecords.forEach(r => {
      const item = fullCocktailList.find(c => c.id === r.cocktailId);
      if (item) {
        if (item.category === 'Cocktail') {
          if (SIGNATURE_COCKTAILS.includes(item.name)) signatures += r.quantity;
          else classics += r.quantity;
        } else spirits += r.quantity;
      }
    });
    return { signatures, classics, spirits };
  };

  const bottleSizeMap = useMemo(() => {
    const map: { [name: string]: number } = {};
    fullCocktailList.forEach(item => {
      if (item.category === 'Spirit by Bottle') {
        map[item.ingredients[0].name] = item.ingredients[0].ml;
      }
    });
    return map;
  }, [fullCocktailList]);

  const getBottleSize = (name: string) => {
    if (bottleSizeMap[name]) return bottleSizeMap[name];
    const ln = getExcelDisplayName(name).toLowerCase();
    
    // Explicit size detection from name
    const mlMatch = ln.match(/(\d+)\s*(ml)/i);
    if (mlMatch) return parseInt(mlMatch[1]);
    
    const lMatch = ln.match(/(\d+(?:\.\d+)?)\s*(l|kg)/i);
    if (lMatch) return parseFloat(lMatch[1]) * 1000;

    const gMatch = ln.match(/(\d+)\s*(grams|g)/i);
    if (gMatch) return parseInt(gMatch[1]);

    if (ln.includes(' 1 l')) return 1000;
    if (ln.includes(' 1.5 l')) return 1500;
    if (ln.includes('750 ml')) return 750;
    if (ln.includes('700 ml')) return 700;
    if (ln.includes('500 ml')) return 500;
    if (ln.includes('375 ml')) return 375;
    
    // Fallbacks for common non-alcohol categories
    if (ln.includes('juice')) return 1000;
    if (ln.includes('syrup')) return 700;
    if (ln.includes('monin')) return 700;
    if (ln.includes('silpin')) return 500;
    if (ln.includes('water')) return 1000;
    if (ln.includes('grams')) return 1000; // Assume 1kg per unit if grams in name but no size
    
    return 750;
  };

  const last4DaysVelocity = useMemo(() => {
    const fourDaysAgo = Date.now() - (4 * 24 * 60 * 60 * 1000);
    const recentLogs = logs.filter(log => log.timestamp > fourDaysAgo);
    const velocity: { [name: string]: number } = {};
    recentLogs.forEach(log => {
      log.usage.forEach(record => {
        const item = fullCocktailList.find(c => c.id === record.cocktailId);
        item?.ingredients.forEach(ing => {
          if (ing.isAlcohol) {
            velocity[ing.name] = (velocity[ing.name] || 0) + (ing.ml * record.quantity) / 4;
          }
        });
      });
    });
    return velocity;
  }, [logs, fullCocktailList]);

  const beverageOrderAnalysis = useMemo(() => {
    const fourDaysAgo = Date.now() - (4 * 24 * 60 * 60 * 1000);
    const recentLogs = logs.filter(log => log.timestamp > fourDaysAgo);
    const recentBatchLogs = batchLogs.filter(log => log.timestamp > fourDaysAgo);
    
    const drinkTallies: { [id: string]: number } = {};
    const batchTallies: { [id: string]: number } = {};
    const ingredientDepletion: { [name: string]: number } = {};

    // 1. Depletion from individual sales
    recentLogs.forEach(log => {
      log.usage.forEach(record => {
        drinkTallies[record.cocktailId] = (drinkTallies[record.cocktailId] || 0) + record.quantity;
        const item = fullCocktailList.find(c => c.id === record.cocktailId);
        item?.ingredients.forEach(ing => {
          if (EXCLUDED_INGREDIENTS.includes(ing.name.toLowerCase())) return;
          // Track all ingredients (not just alcohol as user asked for syrups/tea too)
          ingredientDepletion[ing.name] = (ingredientDepletion[ing.name] || 0) + (ing.ml * record.quantity);
        });
      });
    });

    // 2. Depletion from batch production
    recentBatchLogs.forEach(blog => {
      batchTallies[blog.recipeId] = (batchTallies[blog.recipeId] || 0) + blog.targetVolume;
      const recipe = batchRecipes.find(r => r.id === blog.recipeId);
      if (recipe) {
        const factor = blog.targetVolume / recipe.baseVolume;
        recipe.ingredients.forEach(ing => {
          if (EXCLUDED_INGREDIENTS.includes(ing.name.toLowerCase())) return;
          ingredientDepletion[ing.name] = (ingredientDepletion[ing.name] || 0) + (ing.ml * factor);
        });
      }
    });

    const topDrinks = Object.entries(drinkTallies)
      .map(([id, qty]) => ({
        item: fullCocktailList.find(c => c.id === id),
        quantity: qty
      }))
      .filter(d => d.item)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 8);

    const topBatches = Object.entries(batchTallies)
      .map(([id, vol]) => ({
        item: batchRecipes.find(r => r.id === id),
        volume: vol
      }))
      .filter(b => b.item)
      .sort((a, b) => b.volume - a.volume);

    const sortedDepletion = Object.entries(ingredientDepletion)
      .map(([name, totalMl]) => {
        const avgDailyMl = totalMl / 4;
        const bSize = getBottleSize(name);
        const bottlesNeeded = totalMl / bSize;
        return { name, totalMl, avgDailyMl, bottlesNeeded, bSize };
      })
      .sort((a, b) => b.totalMl - a.totalMl);

    return { topDrinks, topBatches, sortedDepletion };
  }, [logs, batchLogs, fullCocktailList, batchRecipes]);

  const pushToHistory = () => {
    setHistory(prev => [{ usage: [...usage], stock: [...stock] }, ...prev].slice(0, 10));
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const last = history[0];
    setUsage(last.usage);
    setStock(last.stock);
    setHistory(prev => prev.slice(1));
  };

  const updateStock = async (name: string, ml: number) => {
    pushToHistory();
    if (user) {
      setIsSyncing(true);
      try {
        const id = name.toLowerCase().replace(/\s+/g, '-');
        await setDoc(doc(db, 'stock', id), { ingredientName: name, initialMl: ml, userId: user.uid, updatedAt: Timestamp.now() });
      } catch (err) { 
        handleFirestoreError(err, 'write', `stock/${name}`); 
      } finally {
        setIsSyncing(false);
      }
    }
    setStock(prev => prev.map(s => s.ingredientName === name ? { ...s, initialMl: ml } : s));
  };

  const filteredItems = useMemo(() => {
    return fullCocktailList.filter(c => {
      const ms = c.name.toLowerCase().includes(searchQuery.toLowerCase());
      const mc = selectedCategory === 'All' || c.category === selectedCategory;
      return ms && mc;
    });
  }, [searchQuery, selectedCategory, fullCocktailList]);

  const handleAddUsage = () => {
    if (selectedCocktail && parseInt(quantityInput) > 0) {
      pushToHistory();
      setUsage(prev => [...prev, { cocktailId: selectedCocktail.id, quantity: parseInt(quantityInput), timestamp: Date.now() }]);
      setSelectedCocktail(null);
      setQuantityInput('1');
    }
  };

  const commitToLog = async () => {
    if (usage.length === 0) return;
    const existing = logs.find(l => l.date === selectedDate);
    const finalLog = existing ? { ...existing, usage: [...existing.usage, ...usage], timestamp: Date.now() } : { date: selectedDate, usage: [...usage], timestamp: Date.now() };
    
    if (user) {
      setIsSyncing(true);
      try {
        await setDoc(doc(db, 'logs', finalLog.date), { ...finalLog, userId: user.uid });
      } catch (err) { 
        handleFirestoreError(err, 'write', `logs/${finalLog.date}`); 
      } finally {
        setIsSyncing(false);
      }
    }

    setLogs(prev => {
      const otherLogs = prev.filter(l => l.date !== selectedDate);
      return [finalLog, ...otherLogs].sort((a, b) => b.timestamp - a.timestamp);
    });

    setUsage([]);
  };

  const ingredientAlcoholMap = useMemo(() => {
    const map = new Map<string, boolean>();
    allIngredients.forEach(i => map.set(i.internalName, i.isAlcohol));
    return map;
  }, [allIngredients]);

  const totalUsageByIngredient = useMemo(() => {
    const totals: { [name: string]: number } = {};
    usage.forEach(r => {
      const item = fullCocktailList.find(c => c.id === r.cocktailId);
      item?.ingredients.forEach(ing => { 
        if (EXCLUDED_INGREDIENTS.includes(ing.name.toLowerCase())) return;
        totals[ing.name] = (totals[ing.name] || 0) + ing.ml * r.quantity; 
      });
    });
    return totals;
  }, [usage, fullCocktailList]);

  const stockStatus = useMemo(() => {
    return stock.map(s => {
      const used = totalUsageByIngredient[s.ingredientName] || 0;
      const remaining = s.initialMl - used;
      const btlS = getBottleSize(s.ingredientName);
      const isLow = remaining < (btlS * 1.5);
      return { ...s, used, remaining, percentage: s.initialMl > 0 ? (remaining/s.initialMl)*100 : 0, isLow };
    });
  }, [stock, totalUsageByIngredient]);

  const sortedStockStatus = useMemo(() => {
    return [...stockStatus]
      .filter(s => {
        const isTargetType = stockFilter === 'alcohol' ? 
          ingredientAlcoholMap.get(s.ingredientName) === true : 
          ingredientAlcoholMap.get(s.ingredientName) === false;
        const matchesSearch = getExcelDisplayName(s.ingredientName).toLowerCase().includes(stockSearchQuery.toLowerCase());
        return isTargetType && matchesSearch;
      })
      .sort((a, b) => {
        if (stockFilter === 'non-alcohol') {
          return getExcelDisplayName(a.ingredientName).localeCompare(getExcelDisplayName(b.ingredientName));
        }
        return getExcelSortIndex(a.ingredientName) - getExcelSortIndex(b.ingredientName);
      });
  }, [stockStatus, excelOrder, stockSearchQuery, stockFilter, ingredientAlcoholMap]);

  const sortedStock = useMemo(() => {
    return [...stock]
      .filter(s => {
        const isTargetType = stockFilter === 'alcohol' ? 
          ingredientAlcoholMap.get(s.ingredientName) === true : 
          ingredientAlcoholMap.get(s.ingredientName) === false;
        const matchesSearch = getExcelDisplayName(s.ingredientName).toLowerCase().includes(stockSearchQuery.toLowerCase());
        return isTargetType && matchesSearch;
      })
      .sort((a, b) => {
        if (stockFilter === 'non-alcohol') {
          return getExcelDisplayName(a.ingredientName).localeCompare(getExcelDisplayName(b.ingredientName));
        }
        return getExcelSortIndex(a.ingredientName) - getExcelSortIndex(b.ingredientName);
      });
  }, [stock, excelOrder, stockSearchQuery, stockFilter, ingredientAlcoholMap]);

  const filteredCocktails = useMemo(() => {
    return cocktails.filter(c => c.name.toLowerCase().includes(recipeSearchQuery.toLowerCase()));
  }, [cocktails, recipeSearchQuery]);

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const scrollToLetter = (letter: string) => {
    const firstItem = filteredItems.find(item => item.name.toUpperCase().startsWith(letter));
    if (firstItem && cocktailRefs.current[firstItem.id]) {
      cocktailRefs.current[firstItem.id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSaveRecipe = async () => {
    let finalIngredients = [...recipeIngredients];
    
    // Auto-add if user forgot to click "+" but filled in the name/ml inputs
    if (newIngName && newIngMl) {
      finalIngredients.push({ name: newIngName, ml: parseInt(newIngMl), isAlcohol: true });
      setNewIngName('');
      setNewIngMl('');
    }

    if(!recipeName || finalIngredients.length === 0) {
      if (!recipeName) alert("Please enter a cocktail name.");
      else if (finalIngredients.length === 0) alert("Please add at least one ingredient.");
      return;
    }

    const newRecipe: Cocktail = {
      id: editingRecipe?.id || recipeName.toLowerCase().replace(/\s+/g, '-'),
      name: recipeName,
      category: 'Cocktail',
      ingredients: finalIngredients
    };
    
    // Optimistic UI: Update state immediately
    if(editingRecipe) setCocktails(prev => prev.map(c => c.id === editingRecipe.id ? newRecipe : c));
    else setCocktails(prev => [...prev, newRecipe]);
    
    setIsRecipeDialogOpen(false);
    setRecipeIngredients([]);
    setRecipeName('');

    if (user) {
      setIsSyncing(true);
      try {
        await setDoc(doc(db, 'cocktails', newRecipe.id), { ...newRecipe, userId: user.uid, updatedAt: Timestamp.now() });
      } catch (err) { 
        handleFirestoreError(err, 'write', `cocktails/${newRecipe.id}`); 
      } finally {
        setIsSyncing(false);
      }
    }
  };

  const handleCreateBatch = async (recipe: BatchRecipe, targetVol: number) => {
    const newLog: BatchLog = {
      id: Date.now().toString(),
      recipeId: recipe.id,
      recipeName: recipe.name,
      targetVolume: targetVol,
      timestamp: Date.now(),
      date: new Date().toISOString().split('T')[0]
    };

    if (user) {
      setIsSyncing(true);
      try {
        await setDoc(doc(db, 'batchLogs', newLog.id), { ...newLog, userId: user.uid });
      } catch (err) {
        handleFirestoreError(err, 'write', `batchLogs/${newLog.id}`);
      } finally {
        setIsSyncing(false);
      }
    }

    setBatchLogs(prev => [newLog, ...prev]);
    setSelectedBatchRecipe(null);
    alert(`Batch of ${targetVol}L ${recipe.name} logged successfully.`);
  };

  const handleDeleteBatchLog = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this batch log?")) {
      if (user) {
        setIsSyncing(true);
        try {
          await deleteDoc(doc(db, 'batchLogs', id));
        } catch (err) {
          handleFirestoreError(err, 'delete', `batchLogs/${id}`);
        } finally {
          setIsSyncing(false);
        }
      }
      setBatchLogs(prev => prev.filter(l => l.id !== id));
    }
  };

  const syncSettings = async (updates: any) => {
    if (!user) return;
    setIsSyncing(true);
    try {
      await setDoc(doc(db, 'settings', user.uid), { ...updates, userId: user.uid, updatedAt: Timestamp.now() }, { merge: true });
    } catch (err) { 
      handleFirestoreError(err, 'update', `settings/${user.uid}`); 
    } finally {
      setIsSyncing(false);
    }
  };


  const handleSaveSpirit = async () => {
    if(!newSpiritName) return;
    const bSizeValue = parseFloat(newSpiritBtlSize) || 0;
    const gSize = parseInt(newSpiritGlassSize);
    const pos = parseInt(newSpiritPosition) - 1;

    const currentUnit = stockFilter === 'non-alcohol' ? newSpiritUnit : 'ml';
    const multiplier = (currentUnit === 'l' || currentUnit === 'kg') ? 1000 : 1;
    const bSize = bSizeValue * multiplier;

    if (editingSpirit) {
      const oldName = editingSpirit;
      const newName = newSpiritName;

      // 1. Update Lists
      const nextGlass45 = spiritsByGlass45.filter(n => n !== oldName);
      if (gSize === 45) nextGlass45.push(newName);
      
      const nextGlass30 = spiritsByGlass30.filter(n => n !== oldName);
      if (gSize === 30) nextGlass30.push(newName);

      const nextBottle = spiritsByBottle.filter(b => b.name !== oldName);
      nextBottle.push({ name: newName, ml: bSize });

      // 2. Mapping & Order
      const oldLabel = spiritMapping[oldName] || oldName;
      const newLabel = `${newName} ${formatIngredientSize(bSize, currentUnit)}`;
      const nextMapping = { ...spiritMapping };
      delete nextMapping[oldName];
      nextMapping[newName] = newLabel;

      let nextOrder = excelOrder.map(n => n === oldLabel ? newLabel : n);
      if (!nextOrder.includes(newLabel)) {
         nextOrder.splice(isNaN(pos) ? nextOrder.length : pos, 0, newLabel);
      } else if (!isNaN(pos)) {
         nextOrder = nextOrder.filter(n => n !== newLabel);
         nextOrder.splice(pos, 0, newLabel);
      }

      // 3. Recipes & Batch
      const nextCocktails = cocktails.map(c => ({
        ...c,
        name: c.name === oldName ? newName : c.name, // Rename if matches
        ingredients: c.ingredients.map(i => i.name === oldName ? { ...i, name: newName } : i)
      }));

      const nextBatchRecipes = batchRecipes.map(r => ({
        ...r,
        ingredients: r.ingredients.map(i => i.name === oldName ? { ...i, name: newName } : i)
      }));

      // 4. Stock
      const nextStock = stock.map(s => s.ingredientName === oldName ? { ...s, ingredientName: newName } : s);
      
      // 5. Units & Non-Alch
      const nextUnits = { ...stockInputUnits };
      if (nextUnits[oldName]) {
        nextUnits[newName] = nextUnits[oldName];
        delete nextUnits[oldName];
      }
      const nextManualNonAlch = manualNonAlcoholic.map(n => n === oldName ? newName : n);

      if (user) {
        setIsSyncing(true);
        try {
          const batch = writeBatch(db);
          // Update settings
          batch.set(doc(db, 'settings', user.uid), {
            spiritsByGlass45: nextGlass45,
            spiritsByGlass30: nextGlass30,
            spiritsByBottle: nextBottle,
            spiritMapping: nextMapping,
            excelOrder: nextOrder,
            stockInputUnits: nextUnits,
            manualNonAlcoholic: nextManualNonAlch
          }, { merge: true });
          
          // Cascading updates...
          nextCocktails.forEach(c => {
             const original = cocktails.find(o => o.id === c.id);
             if (JSON.stringify(c) !== JSON.stringify(original)) {
                batch.set(doc(db, 'cocktails', c.id), { ...c, userId: user.uid });
             }
          });
          nextBatchRecipes.forEach(r => {
             const original = batchRecipes.find(o => o.id === r.id);
             if (JSON.stringify(r) !== JSON.stringify(original)) {
                batch.set(doc(db, 'batchRecipes', r.id), { ...r, userId: user.uid });
             }
          });
          await batch.commit();
        } catch (err) { handleFirestoreError(err, 'write', 'edit-spirit-cascade'); }
        finally { setIsSyncing(false); }
      }

      setSpiritsByGlass45(nextGlass45);
      setSpiritsByGlass30(nextGlass30);
      setSpiritsByBottle(nextBottle);
      setSpiritMapping(nextMapping);
      setExcelOrder(nextOrder);
      setCocktails(nextCocktails);
      setBatchRecipes(nextBatchRecipes);
      setStock(nextStock);
      setManualNonAlcoholic(nextManualNonAlch);
      setStockInputUnits(nextUnits);
      setEditingSpirit(null);
      setIsSpiritDialogOpen(false);
      return;
    }

    // ORIGINAL ADD LOGIC
    const nextGlass45 = gSize === 45 ? [...new Set([...spiritsByGlass45, newSpiritName])] : spiritsByGlass45;
    const nextGlass30 = gSize === 30 ? [...new Set([...spiritsByGlass30, newSpiritName])] : spiritsByGlass30;
    const nextBottle = [...spiritsByBottle.filter(b => b.name !== newSpiritName), { name: newSpiritName, ml: bSize }];
    const bLabel = `${newSpiritName} ${formatIngredientSize(bSize, currentUnit)}`;
    const nextMapping = { ...spiritMapping, [newSpiritName]: bLabel };
    
    // Add to manualNonAlcoholic if needed
    const nextManualNonAlch = stockFilter === 'non-alcohol' 
      ? [...new Set([...manualNonAlcoholic, newSpiritName])] 
      : manualNonAlcoholic.filter(n => n !== newSpiritName);

    const nextUnits = { ...stockInputUnits };
    nextUnits[newSpiritName] = currentUnit;

    const filteredOrder = excelOrder.filter(n => n !== bLabel);
    const nextOrder = [...filteredOrder];
    nextOrder.splice(isNaN(pos) ? nextOrder.length : pos, 0, bLabel);

    if (user) {
      await syncSettings({
        spiritsByGlass45: nextGlass45,
        spiritsByGlass30: nextGlass30,
        spiritsByBottle: nextBottle,
        spiritMapping: nextMapping,
        excelOrder: nextOrder,
        manualNonAlcoholic: nextManualNonAlch,
        stockInputUnits: nextUnits
      });
    }

    if(gSize === 45) setSpiritsByGlass45(nextGlass45);
    if(gSize === 30) setSpiritsByGlass30(nextGlass30);
    setSpiritsByBottle(nextBottle);
    setSpiritMapping(nextMapping);
    setExcelOrder(nextOrder);
    setManualNonAlcoholic(nextManualNonAlch);
    setStockInputUnits(nextUnits);

    setIsSpiritDialogOpen(false);
  };


  const handleRemoveSpirits = async () => {
    if(spiritsToRemove.length === 0) return;
    const nextGlass45 = spiritsByGlass45.filter(s => !spiritsToRemove.includes(s));
    const nextGlass30 = spiritsByGlass30.filter(s => !spiritsToRemove.includes(s));
    const nextBottle = spiritsByBottle.filter(s => !spiritsToRemove.includes(s.name));
    const nextManualNonAlch = manualNonAlcoholic.filter(n => !spiritsToRemove.includes(n));
    const nextMapping = { ...spiritMapping };
    const nextUnits = { ...stockInputUnits };
    spiritsToRemove.forEach(s => {
      delete nextMapping[s];
      delete nextUnits[s];
    });
    const nextOrder = excelOrder.filter(o => !spiritsToRemove.some(s => o.startsWith(s)));
    
    if (user) {
      setIsSyncing(true);
      try {
        const batch = writeBatch(db);
        // Remove cocktails associated with these spirits
        const cocktailsToRemove = cocktails.filter(c => spiritsToRemove.includes(c.name));
        cocktailsToRemove.forEach(c => batch.delete(doc(db, 'cocktails', c.id)));
        
        // Update settings
        batch.set(doc(db, 'settings', user.uid), {
          spiritsByGlass45: nextGlass45,
          spiritsByGlass30: nextGlass30,
          spiritsByBottle: nextBottle,
          spiritMapping: nextMapping,
          excelOrder: nextOrder,
          manualNonAlcoholic: nextManualNonAlch,
          stockInputUnits: nextUnits
        }, { merge: true });
        
        await batch.commit();
      } catch (err) {
        handleFirestoreError(err, 'write', 'batch-remove-items');
      } finally {
        setIsSyncing(false);
      }
    }

    setSpiritsByGlass45(nextGlass45);
    setSpiritsByGlass30(nextGlass30);
    setSpiritsByBottle(nextBottle);
    setSpiritMapping(nextMapping);
    setExcelOrder(nextOrder);
    setManualNonAlcoholic(nextManualNonAlch);
    setStockInputUnits(nextUnits);
    setStock(prev => prev.filter(s => !spiritsToRemove.includes(s.ingredientName)));
    setCocktails(prev => prev.filter(c => !spiritsToRemove.includes(c.name)));
    setSpiritsToRemove([]);
    setIsSpiritDialogOpen(false);
  };

  const handleRemoveRecipe = async (id: string) => {
    if(window.confirm(`Are you sure you want to delete this recipe?`)) {
      if (user) {
        setIsSyncing(true);
        try {
          await deleteDoc(doc(db, 'cocktails', id));
        } catch (err) { 
          handleFirestoreError(err, 'delete', `cocktails/${id}`); 
        } finally {
          setIsSyncing(false);
        }
      }
      setCocktails(prev => prev.filter(c => c.id !== id));
    }
  };

  return (
    <div className="flex h-screen bg-black text-white font-sans overflow-hidden">
      <aside className="w-16 border-r border-zinc-800 hidden md:flex flex-col items-center py-8 gap-8">
         <Package className="text-blue-500 w-8 h-8" />
      </aside>

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="p-3 md:p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-950">
          <div className="flex-1">
            <h1 className="text-sm md:text-2xl font-light tracking-widest text-white uppercase italic leading-none">PAR <span className="text-blue-500 font-bold not-italic">STOCK</span> CONTROL</h1>
            <p className="hidden xs:block text-[8px] md:text-[10px] text-zinc-500 uppercase tracking-tighter mt-1">Inventory Management Solution</p>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
               <div className="flex items-center gap-1.5 px-2 py-0.5 md:px-3 md:py-1 bg-zinc-900 border border-zinc-800 rounded-full">
                  <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${user ? (isSyncing ? 'bg-blue-500 animate-pulse' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]') : 'bg-amber-500'}`} />
                  <span className="text-[8px] md:text-[10px] font-mono whitespace-nowrap">
                    {user ? (isSyncing ? 'SYNCING...' : 'CLOUD SYNCED') : 'LOCAL MODE'}
                  </span>
               </div>
               
               {user ? (
                 <div className="flex items-center gap-2 md:gap-3 pl-2 md:pl-4 border-l border-zinc-800">
                   <div className="text-right hidden md:block">
                     <p className="text-[10px] font-bold text-white uppercase tracking-tight">{user.displayName || 'User'}</p>
                     <p className="text-[9px] text-zinc-500 truncate max-w-[120px]">{user.email}</p>
                   </div>
                   <Button variant="ghost" size="icon" onClick={logOut} className="text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-full h-8 w-8 md:h-10 md:w-10">
                     <LogOut className="w-3.5 h-3.5 md:w-4 md:h-4" />
                   </Button>
                 </div>
               ) : (
                 <Button onClick={handleSignIn} disabled={isSigningIn} className="bg-white text-black hover:bg-zinc-200 rounded-full text-[10px] md:text-xs font-bold px-3 md:px-6 h-8 md:h-9 gap-1.5 md:gap-2">
                   <LogIn className="w-3.5 h-3.5 md:w-4 md:h-4" /> {isSigningIn ? 'SIGNING IN...' : 'SIGN IN'}
                 </Button>
               )}
          </div>
        </header>

        <main className="p-3 md:p-6 overflow-y-auto max-w-7xl mx-auto w-full h-full pb-24 md:pb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 md:space-y-6">
            <TabsList className="bg-zinc-900 p-1 rounded-xl h-auto flex flex-wrap gap-1 justify-start">
              <TabsTrigger value="par-cutting" className="text-[10px] md:text-xs py-1 px-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white uppercase">Par Cutting</TabsTrigger>
              <TabsTrigger value="stock" className="text-[10px] md:text-xs py-1 px-3 data-[state=active]:bg-emerald-600 data-[state=active]:text-white">STOCK</TabsTrigger>
              <TabsTrigger value="recipe-data" className="text-[10px] md:text-xs py-1 px-3 data-[state=active]:bg-amber-600 data-[state=active]:text-white uppercase">Recipes</TabsTrigger>
              <TabsTrigger value="summary" className="text-[10px] md:text-xs py-1 px-3 data-[state=active]:bg-indigo-600 data-[state=active]:text-white">HISTORY</TabsTrigger>
              <TabsTrigger value="batching" className="text-[10px] md:text-xs py-1 px-3 data-[state=active]:bg-orange-600 data-[state=active]:text-white uppercase">Batching</TabsTrigger>
              <TabsTrigger value="beverage-order" className="text-[10px] md:text-xs py-1 px-3 data-[state=active]:bg-rose-600 data-[state=active]:text-white uppercase">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="par-cutting" className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 m-0">
               <div className="md:col-span-2 space-y-4 md:space-y-6">
                  <Card className="bg-zinc-900 border-zinc-800 p-4 md:p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 md:mb-6">
                      <h2 className="text-md md:text-lg font-bold uppercase tracking-tight">Sales Entry</h2>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <Input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="w-full sm:w-40 bg-zinc-800 border-zinc-700 text-white h-9 text-xs" />
                      </div>
                    </div>
                    
                    <div className="flex gap-2 items-center mb-4 md:mb-6 overflow-x-auto pb-2 scrollbar-none">
                       {['All', 'Cocktail', 'Spirit by Glass', 'Spirit by Bottle'].map(c => (
                         <Button key={c} variant={selectedCategory === c ? 'default' : 'outline'} onClick={() => setSelectedCategory(c as any)} className="rounded-full px-4 h-8 text-[10px] md:text-xs whitespace-nowrap">{c}</Button>
                       ))}
                    </div>

                    <div className="flex gap-2 md:gap-4">
                      {/* Alphabetical Sidebar - Smaller for mobile */}
                      <div className="w-6 md:w-8 flex flex-col items-center gap-1 md:gap-1.5 py-2 md:py-4 border-r border-zinc-800 sticky top-0 h-fit">
                         {alphabet.map(letter => (
                           <button key={letter} onClick={() => scrollToLetter(letter)} className="text-[9px] md:text-[10px] font-bold text-zinc-500 hover:text-blue-500 transition-colors uppercase">
                             {letter}
                           </button>
                         ))}
                      </div>

                      <ScrollArea className="h-[400px] md:h-[500px] flex-1">
                        <div className="grid grid-cols-2 lg:grid-cols-2 gap-2 md:gap-3 pr-2 md:pr-4">
                          {filteredItems.map(item => (
                            <button 
                              key={item.id} 
                              ref={el => cocktailRefs.current[item.id] = el}
                              onClick={() => setSelectedCocktail(item)} 
                              className="p-2 md:p-4 bg-zinc-800 border border-zinc-700 rounded-xl hover:border-blue-500 transition-all text-left flex flex-col sm:flex-row justify-between items-start sm:items-center group min-h-[60px] md:min-h-0"
                            >
                              <div className="overflow-hidden w-full">
                                <p className="text-[8px] md:text-[10px] text-zinc-500 uppercase truncate">{item.category}</p>
                                <p className="text-xs md:text-sm font-medium text-white group-hover:text-blue-400 truncate w-full">{item.name}</p>
                              </div>
                              <ChevronRight className="hidden sm:block w-4 h-4 text-zinc-600 group-hover:text-blue-500" />
                            </button>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </Card>
               </div>

               <div className="space-y-4 md:space-y-6 md:h-fit md:sticky md:top-0">
                 <Card className="bg-zinc-900 border-zinc-800 p-4 md:p-6 flex flex-col gap-4 md:gap-6">
                    <div>
                      <div className="flex justify-between items-center mb-4 md:mb-6">
                        <h2 className="text-[10px] uppercase tracking-widest text-zinc-500">Session Workspace</h2>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" onClick={handleUndo} disabled={history.length === 0} className="hover:text-blue-500 disabled:opacity-20 h-8 w-8"><Zap className="w-3.5 h-3.5" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => setUsage([])} className="hover:text-red-500 h-8 w-8"><Trash2 className="w-3.5 h-3.5" /></Button>
                        </div>
                      </div>
                      {Object.keys(totalUsageByIngredient).length === 0 ? (
                        <div className="text-center py-8 md:py-20 text-zinc-700">
                          <Calculator className="mx-auto mb-4 w-10 h-10 md:w-12 md:h-12 opacity-20" />
                          <p className="text-[10px] uppercase">Awaiting entries...</p>
                        </div>
                      ) : (
                        <ScrollArea className="h-40 md:h-64 pr-2">
                          {[...stockStatus]
                            .filter(s => s.used > 0)
                            .sort((a, b) => getExcelSortIndex(a.ingredientName) - getExcelSortIndex(b.ingredientName))
                            .map(s => (
                            <div key={s.ingredientName} className="flex justify-between py-2 border-b border-zinc-800 last:border-0 items-center">
                               <span className="text-[10px] md:text-xs text-zinc-300 truncate max-w-[150px]">{getExcelDisplayName(s.ingredientName)}</span>
                               <span className="font-mono text-blue-400 font-bold text-xs">{(s.used * ML_TO_OZ).toFixed(1)} oz</span>
                            </div>
                          ))}
                        </ScrollArea>
                      )}
                    </div>

                    {usage.length > 0 && (
                      <Button 
                        onClick={commitToLog} 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 md:h-14 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 text-sm"
                      >
                        <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" />
                        SAVE TO HISTORY
                      </Button>
                    )}
                 </Card>
               </div>
            </TabsContent>

            <TabsContent value="recipe-data" className="m-0 space-y-4 md:space-y-6">
              <Card className="bg-zinc-900 border border-zinc-800 p-4 md:p-6 rounded-2xl md:rounded-[32px] flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-center sm:text-left">
                  <h2 className="text-xl md:text-2xl font-bold uppercase tracking-tight text-white">Recipe Book</h2>
                  <p className="text-[10px] md:text-sm text-zinc-500">Inventory and recipe management</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <Input 
                      placeholder="Search recipes..." 
                      value={recipeSearchQuery}
                      onChange={(e) => setRecipeSearchQuery(e.target.value)}
                      className="pl-10 h-12 md:h-14 bg-zinc-950 border-zinc-800 rounded-xl md:rounded-2xl text-xs md:text-sm"
                    />
                  </div>
                  <Button 
                    onClick={() => {
                      setEditingRecipe(null);
                      setRecipeName('');
                      setRecipeIngredients([]);
                      setIsRecipeDialogOpen(true);
                    }}
                    className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 rounded-xl md:rounded-2xl h-12 md:h-14 px-6 md:px-8 font-bold gap-2 text-xs md:text-md"
                  >
                    <Plus className="w-4 h-4 md:w-5 md:h-5" /> NEW RECIPE
                  </Button>
                </div>
              </Card>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                 {filteredCocktails.map(recipe => (
                   <Card key={recipe.id} className="bg-zinc-950 border-zinc-800 p-4 md:p-6 rounded-2xl md:rounded-[32px] hover:border-amber-500/50 transition-all group overflow-hidden relative">
                      <div className="absolute top-2 right-2 flex gap-1 md:opacity-0 group-hover:opacity-100 transition-opacity">
                         <Button 
                           variant="ghost" 
                           size="icon" 
                           className="h-8 w-8 md:h-10 md:w-10 bg-zinc-900 border border-zinc-800 rounded-lg md:rounded-xl"
                           onClick={() => {
                             setEditingRecipe(recipe);
                             setRecipeName(recipe.name);
                             setRecipeIngredients([...recipe.ingredients]);
                             setIsRecipeDialogOpen(true);
                           }}
                          >
                           <Info className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-500" />
                         </Button>
                         <Button 
                           variant="ghost" 
                           size="icon" 
                           className="h-8 w-8 md:h-10 md:w-10 bg-zinc-900 border border-zinc-800 rounded-lg md:rounded-xl hover:text-red-500"
                           onClick={() => handleRemoveRecipe(recipe.id)}
                          >
                           <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                         </Button>
                      </div>

                      <h3 className="text-sm md:text-lg font-bold text-white mb-3 md:mb-4 uppercase tracking-tight pr-16">{recipe.name}</h3>
                      <div className="space-y-2">
                         {recipe.ingredients.map((ing, idx) => (
                           <div key={idx} className="flex justify-between items-center text-[10px] md:text-sm border-b border-zinc-900 pb-1 last:border-0">
                              <span className="text-zinc-400">{ing.name}</span>
                              <span className="font-mono text-amber-500 font-bold">{ing.ml}ml</span>
                           </div>
                         ))}
                      </div>
                   </Card>
                 ))}
              </div>
            </TabsContent>

            <TabsContent value="stock" className="space-y-6 m-0">
               <div className="flex flex-col md:flex-row justify-between items-center bg-zinc-900 p-4 rounded-2xl border border-zinc-800 gap-4">
                  <div className="text-center md:text-left">
                    <h2 className="text-xl font-bold uppercase tracking-tight">Ingredient Inventory</h2>
                    <p className="text-xs text-zinc-500">Update current stock levels based on bottles on hand</p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                     <div className="relative w-full sm:w-64">
                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                       <Input 
                         placeholder="Search ingredients..." 
                         value={stockSearchQuery}
                         onChange={(e) => setStockSearchQuery(e.target.value)}
                         className="pl-10 bg-zinc-950 border-zinc-800 rounded-xl h-11 md:h-12"
                       />
                     </div>
                      <Button onClick={() => { 
                        setEditingSpirit(null); 
                        setNewSpiritName('');
                        setNewSpiritBtlSize(stockFilter === 'alcohol' ? '750' : '1');
                        setNewSpiritUnit(stockFilter === 'alcohol' ? 'ml' : 'ml');
                        setNewSpiritGlassSize('45');
                        setNewSpiritPosition('');
                        setIsSpiritDialogOpen(true); 
                        setSpiritMode('add'); 
                      }} className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 rounded-xl px-6 h-11 md:h-12 gap-2 font-bold text-xs uppercase text-white">
                       <Plus className="w-4 h-4" /> {stockFilter === 'alcohol' ? 'ADD OR DELIST SPIRIT' : 'ADD OR DELETE ITEM'}
                     </Button>
                  </div>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 m-0">
                 <Card className="lg:col-span-3 bg-zinc-900 border-zinc-800 p-6">
                   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                     <h2 className="text-xl font-bold uppercase tracking-tight">Initial Stock Setup</h2>
                     <div className="flex gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
                       <Button 
                         variant={stockFilter === 'alcohol' ? 'secondary' : 'ghost'} 
                         size="sm"
                         onClick={() => setStockFilter('alcohol')}
                         className={`rounded-lg h-8 text-[9px] uppercase font-bold px-4 ${stockFilter === 'alcohol' ? 'bg-white/10 text-white' : 'text-zinc-500'}`}
                       >
                         Alcohol
                       </Button>
                       <Button 
                         variant={stockFilter === 'non-alcohol' ? 'secondary' : 'ghost'} 
                         size="sm"
                         onClick={() => setStockFilter('non-alcohol')}
                         className={`rounded-lg h-8 text-[9px] uppercase font-bold px-4 ${stockFilter === 'non-alcohol' ? 'bg-white/10 text-white' : 'text-zinc-500'}`}
                       >
                         Non-Alcoholic
                       </Button>
                     </div>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {sortedStock.map(s => {
                        const size = getBottleSize(s.ingredientName);
                        return (
                          <div key={s.ingredientName} className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-between group">
                             <div className="flex items-center gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => {
                                     setEditingSpirit(s.ingredientName);
                                     setNewSpiritName(s.ingredientName);
                                     
                                     const unit = stockInputUnits[s.ingredientName] || 'ml';
                                     setNewSpiritUnit(unit);
                                     const divisor = (unit === 'l' || unit === 'kg') ? 1000 : 1;
                                     setNewSpiritBtlSize((size / divisor).toString());

                                     const isG45 = spiritsByGlass45.includes(s.ingredientName);
                                     const isG30 = spiritsByGlass30.includes(s.ingredientName);
                                     setNewSpiritGlassSize(isG45 ? "45" : (isG30 ? "30" : "0"));
                                     const dispName = getExcelDisplayName(s.ingredientName);
                                     const currentPos = excelOrder.indexOf(dispName);
                                     setNewSpiritPosition(currentPos === -1 ? "" : (currentPos + 1).toString());
                                     setSpiritMode('add');
                                     setIsSpiritDialogOpen(true);
                                  }}
                                  className="h-6 w-6 rounded-md md:opacity-0 group-hover:opacity-100 hover:bg-zinc-800 hover:text-white transition-all p-0"
                                >
                                   <Settings className="w-3 h-3 text-zinc-500" />
                                </Button>
                                <span className="text-xs font-medium">{getExcelDisplayName(s.ingredientName)}</span>
                             </div>
                             <div className="flex items-center gap-2">
                                {(() => {
                                  const nameStr = typeof s.ingredientName === 'string' ? s.ingredientName : '';
                                  const currentUnit = stockInputUnits[nameStr] || (stockFilter === 'alcohol' ? 'btl' : (nameStr.toLowerCase().includes('grams') || nameStr.toLowerCase().includes('(g)') ? 'g' : 'ml'));
                                  let displayVal = 0;
                                  let multiplier = size;
                                  
                                  if (currentUnit === 'l' || currentUnit === 'kg') multiplier = 1000;
                                  else if (currentUnit === 'g' || currentUnit === 'unit') multiplier = 1;
                                  else multiplier = size; // 'btl'

                                  displayVal = s.initialMl / multiplier;

                                  return (
                                    <>
                                      <Input 
                                        type="number" 
                                        step="0.01" 
                                        value={displayVal || ''} 
                                        onChange={e => updateStock(s.ingredientName, (parseFloat(e.target.value)||0)*multiplier)} 
                                        className="w-20 text-right font-mono text-xs bg-zinc-900 border-zinc-800 h-8" 
                                      />
                                      {stockFilter === 'alcohol' ? (
                                        <span className="text-[10px] text-zinc-600 uppercase w-8">Btl</span>
                                      ) : (
                                        <select 
                                          className="bg-transparent text-[10px] text-zinc-500 uppercase font-bold outline-none cursor-pointer hover:text-white transition-colors"
                                          value={currentUnit}
                                          onChange={(e) => {
                                            const newUnit = e.target.value as any;
                                            setStockInputUnits(prev => ({ ...prev, [s.ingredientName]: newUnit }));
                                          }}
                                        >
                                          <option value="l" className="bg-zinc-950">L</option>
                                          <option value="kg" className="bg-zinc-950">KG</option>
                                          <option value="g" className="bg-zinc-950">G</option>
                                          <option value="unit" className="bg-zinc-950">Unit</option>
                                          <option value="btl" className="bg-zinc-950">Btl</option>
                                        </select>
                                      )}
                                    </>
                                  );
                                })()}
                             </div>
                          </div>
                        )
                      })}
                      {sortedStock.length === 0 && (
                        <div className="col-span-full py-12 text-center text-zinc-600">
                          <Search className="mx-auto mb-4 w-12 h-12 opacity-10" />
                          <p className="uppercase text-xs tracking-widest">No ingredients found</p>
                        </div>
                      )}
                   </div>
                 </Card>
                 
                 <Card className="bg-zinc-900 border-zinc-800 p-6 h-fit sticky top-0">
                   <h2 className="text-xs uppercase tracking-widest text-zinc-500 mb-6">STOCK HEALTH</h2>
                   <ScrollArea className="h-[600px] pr-4">
                     <div className="space-y-4">
                       {sortedStockStatus.map(s => {
                         const bSize = getBottleSize(s.ingredientName);
                         return (
                           <div key={s.ingredientName} className="space-y-1">
                              <div className="flex justify-between text-[10px] uppercase font-mono">
                                <span className="text-zinc-400 truncate pr-2">{getExcelDisplayName(s.ingredientName)}</span>
                                <span className={s.isLow ? 'text-red-500 font-bold shrink-0' : 'text-emerald-500 shrink-0'}>{(s.remaining/bSize).toFixed(1)} left</span>
                              </div>
                              <div className="h-1 bg-black rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${Math.max(0, Math.min(100, s.percentage))}%` }} className={`h-full ${s.isLow ? 'bg-red-500' : 'bg-emerald-500'}`} />
                              </div>
                           </div>
                       )})}
                       {sortedStockStatus.length === 0 && (
                         <p className="text-[10px] text-zinc-700 text-center py-4 uppercase">No results</p>
                       )}
                     </div>
                   </ScrollArea>
                 </Card>
               </div>
            </TabsContent>

            <TabsContent value="summary" className="m-0 space-y-6 pb-20">
               <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold uppercase tracking-tight">Monthly Performance</h2>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{formatDate(new Date().toISOString())}</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="bg-blue-600/10 border-blue-500/20 p-4">
                    <p className="text-[10px] text-blue-400 uppercase mb-1">Total Signatures</p>
                    <p className="text-2xl font-bold">{monthlySummary.signatures}</p>
                  </Card>
                  <Card className="bg-emerald-600/10 border-emerald-500/20 p-4">
                    <p className="text-[10px] text-emerald-400 uppercase mb-1">Total Classics</p>
                    <p className="text-2xl font-bold">{monthlySummary.classics}</p>
                  </Card>
                  <Card className="bg-indigo-600/10 border-indigo-500/20 p-4">
                    <p className="text-[10px] text-indigo-400 uppercase mb-1">Total Spirits</p>
                    <p className="text-2xl font-bold">{monthlySummary.spirits}</p>
                  </Card>
                  <Card className="bg-zinc-800 border-zinc-700 p-4">
                    <p className="text-[10px] text-zinc-400 uppercase mb-1">Top Seller</p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold truncate pr-2">{monthlySummary.topSeller?.name || 'N/A'}</p>
                      <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-none h-5">{monthlySummary.topSellerQty}</Badge>
                    </div>
                  </Card>
               </div>

               <h2 className="text-xl font-bold uppercase tracking-tight pt-4">Historical Records</h2>
               {logs.length === 0 ? (
                 <Card className="bg-zinc-900 border-zinc-800 p-12 text-center text-zinc-600">
                    <RefreshCcw className="mx-auto mb-4 w-12 h-12 opacity-10" />
                    <p className="uppercase text-xs tracking-widest">No history found (logs are kept for 365 days)</p>
                 </Card>
               ) : (
                 <div className="space-y-8">
                   {(Object.entries(
                     logs.reduce((acc: Record<string, DailyLog[]>, log) => {
                       const date = new Date(log.timestamp);
                       const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                       if (!acc[monthYear]) acc[monthYear] = [];
                       acc[monthYear].push(log);
                       return acc;
                     }, {})
                   ) as [string, DailyLog[]][]).sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
                   .map(([monthYear, monthLogs]) => {
                     const isExpanded = expandedMonths.includes(monthYear);
                     return (
                       <div key={monthYear} className="space-y-4">
                         <button 
                           onClick={() => setExpandedMonths(prev => 
                             prev.includes(monthYear) 
                               ? prev.filter(m => m !== monthYear) 
                               : [...prev, monthYear]
                           )}
                           className="flex items-center gap-4 w-full group hover:opacity-80 transition-opacity"
                         >
                           <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest leading-none shrink-0">{monthYear}</h3>
                           <div className="h-[1px] flex-1 bg-zinc-800/50"></div>
                           <ChevronDown className={`w-4 h-4 text-zinc-600 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                         </button>
                         
                         <AnimatePresence>
                           {isExpanded && (
                             <motion.div 
                               initial={{ height: 0, opacity: 0 }}
                               animate={{ height: 'auto', opacity: 1 }}
                               exit={{ height: 0, opacity: 0 }}
                               className="space-y-3 overflow-hidden"
                             >
                               {monthLogs.sort((a,b) => b.timestamp - a.timestamp).map(log => {
                                 const stats = getCategoryStats(log.usage);
                                 const totalDrinks = (log.usage || []).reduce((sum: number, r: UsageRecord) => sum + r.quantity, 0);
                                 return (
                                   <Card 
                                      key={log.date} 
                                      onClick={() => setSelectedLog(log)}
                                      className="bg-zinc-900 border-zinc-800 overflow-hidden hover:border-zinc-700 transition-all cursor-pointer active:scale-[0.99] group"
                                   >
                                     <div className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
                                        <div className="flex flex-col">
                                           <p className="text-blue-500 font-mono text-lg font-bold">
                                             {new Date(log.timestamp).toLocaleDateString('en-US', { day: 'numeric', weekday: 'short' })}
                                           </p>
                                           <p className="text-[10px] text-zinc-500 uppercase tracking-tighter">
                                             {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                           </p>
                                        </div>
                                        <div className="flex gap-6 sm:gap-8 flex-1 justify-center">
                                           <div className="text-center">
                                              <p className="text-[10px] text-zinc-500 uppercase mb-1">Sig</p>
                                              <p className="text-lg font-bold text-white">{stats.signatures}</p>
                                           </div>
                                           <div className="text-center">
                                              <p className="text-[10px] text-zinc-500 uppercase mb-1">Clas</p>
                                              <p className="text-lg font-bold text-white">{stats.classics}</p>
                                           </div>
                                           <div className="text-center">
                                              <p className="text-[10px] text-zinc-500 uppercase mb-1">Spir</p>
                                              <p className="text-lg font-bold text-white">{stats.spirits}</p>
                                           </div>
                                        </div>
                                        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                                           <div className="text-right">
                                             <p className="text-[10px] text-zinc-500 uppercase">Total Drinks</p>
                                             <p className="text-xs font-mono text-zinc-300">{totalDrinks}</p>
                                           </div>
                                           <Button 
                                             variant="ghost" 
                                             size="icon" 
                                             onClick={(e) => {
                                               e.stopPropagation();
                                               setLogToDelete(log.date);
                                             }}
                                             className="text-zinc-700 hover:text-red-500 hover:bg-red-500/10 h-8 w-8"
                                           >
                                             <Trash2 className="w-4 h-4" />
                                           </Button>
                                        </div>
                                     </div>
                                   </Card>
                                 );
                               })}
                             </motion.div>
                           )}
                         </AnimatePresence>
                       </div>
                     );
                   })}
                 </div>
               )}
            </TabsContent>

            <TabsContent value="beverage-order" className="m-0 space-y-6 pb-20">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-zinc-900 border border-zinc-800 p-6 rounded-[32px] gap-4 shadow-xl">
                <div>
                  <h2 className="text-2xl font-bold uppercase tracking-tight text-rose-500">Beverage Order Analytics</h2>
                  <p className="text-sm text-zinc-500">Combined depletion analysis (Sales + Batching Events) for last 4 days</p>
                </div>
                <div className="flex items-center gap-2 px-6 py-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl">
                  <Zap className="w-5 h-5 text-rose-500 animate-pulse" />
                  <span className="text-xs font-bold text-rose-500 uppercase tracking-widest">Velocity Integrated</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                 {/* Activity Stats Column */}
                 <div className="space-y-8 lg:col-span-1">
                    <div>
                       <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 mb-4 px-2">Top Sales Activity</h3>
                       <div className="space-y-2">
                          {beverageOrderAnalysis.topDrinks.length === 0 ? (
                            <Card className="bg-zinc-900/50 border-zinc-800 p-8 text-center text-zinc-700 rounded-3xl border-dashed">
                              <p className="text-[10px] uppercase font-mono italic tracking-tighter">Awaiting Sales Logs</p>
                            </Card>
                          ) : beverageOrderAnalysis.topDrinks.map((d, i) => (
                            <div key={i} className="bg-zinc-900 border border-zinc-800 p-3 rounded-2xl flex items-center justify-between hover:bg-zinc-800/50 transition-colors">
                                <div className="flex items-center gap-3">
                                   <span className="text-[10px] font-mono text-rose-500 font-bold opacity-50">{i+1}</span>
                                   <p className="text-xs font-bold text-white uppercase truncate max-w-[100px]">{d.item?.name}</p>
                                </div>
                                <Badge className="bg-zinc-800 border-none font-mono text-[10px] text-zinc-400">{d.quantity}</Badge>
                            </div>
                          ))}
                       </div>
                    </div>

                    <div>
                       <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-blue-500/70 mb-4 px-2">Batch Production Activity</h3>
                       <div className="space-y-2">
                          {beverageOrderAnalysis.topBatches.length === 0 ? (
                            <Card className="bg-zinc-900/50 border-zinc-800 p-8 text-center text-zinc-700 rounded-3xl border-dashed">
                              <p className="text-[10px] uppercase font-mono italic tracking-tighter">No Batches Logged</p>
                            </Card>
                          ) : beverageOrderAnalysis.topBatches.map((b, i) => (
                            <div key={i} className="bg-zinc-900 border border-zinc-800 p-3 rounded-2xl flex items-center justify-between hover:bg-zinc-800/50 transition-colors">
                                <div className="flex items-center gap-3">
                                   <span className="text-[10px] font-mono text-blue-500 font-bold opacity-50">{i+1}</span>
                                   <p className="text-xs font-bold text-white uppercase truncate max-w-[100px]">{b.item?.name}</p>
                                </div>
                                <Badge className="bg-blue-500/10 text-blue-400 border-none font-mono text-[10px]">{b.volume}L</Badge>
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>

                 {/* Detailed Ordering List */}
                 <div className="lg:col-span-3 space-y-6">
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 ml-2">Material Order List</h3>
                    <Card className="bg-zinc-900 border-zinc-800 rounded-[32px] overflow-hidden">
                       <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                             <thead>
                                <tr className="bg-zinc-800 shadow-sm text-[10px] uppercase text-zinc-500 text-left">
                                   <th className="p-6 font-bold">Material Ingredient</th>
                                   <th className="p-6 font-bold text-right">4-Day Total Vol</th>
                                   <th className="p-6 font-bold text-right">Avg Daily</th>
                                   <th className="p-6 font-bold text-right">Forecast Action</th>
                                </tr>
                             </thead>
                             <tbody>
                                {beverageOrderAnalysis.sortedDepletion.length === 0 ? (
                                  <tr>
                                    <td colSpan={4} className="p-12 text-center text-zinc-700 uppercase text-[10px]">Insufficient history to generate order</td>
                                  </tr>
                                ) : beverageOrderAnalysis.sortedDepletion.map((s, idx) => {
                                  const isGrams = s.name.toLowerCase().includes('grams') || s.name.toLowerCase().includes('(g)');
                                  const unitLabel = isGrams ? 'Units (G)' : 'Units';
                                  return (
                                    <tr key={idx} className="border-t border-zinc-800/50 hover:bg-white/5 transition-colors group">
                                       <td className="p-6">
                                          <p className="font-bold text-white uppercase tracking-tight group-hover:text-rose-400 transition-colors uppercase">{getExcelDisplayName(s.name)}</p>
                                          <p className="text-[10px] text-zinc-600 font-mono tracking-tighter">BASE UNIT: {s.bSize}{isGrams ? 'g' : 'ml'}</p>
                                       </td>
                                       <td className="p-6 text-right font-mono text-zinc-300">
                                          {s.totalMl >= 1000 && !isGrams ? `${(s.totalMl/1000).toFixed(2)}L` : `${s.totalMl.toFixed(0)}${isGrams ? 'g' : 'ml'}`}
                                       </td>
                                       <td className="p-6 text-right font-mono text-zinc-500">
                                          {s.avgDailyMl >= 1000 && !isGrams ? `${(s.avgDailyMl/1000).toFixed(2)}L` : `${s.avgDailyMl.toFixed(1)}${isGrams ? 'g' : 'ml'}`}
                                       </td>
                                       <td className="p-6 text-right">
                                          <div className="flex flex-col items-end">
                                            <span className={`text-lg font-bold font-mono ${s.bottlesNeeded >= 1 ? 'text-emerald-500' : 'text-zinc-500'}`}>
                                              {s.bottlesNeeded.toFixed(1)}
                                            </span>
                                            <span className="text-[9px] uppercase font-bold text-zinc-600">{unitLabel}</span>
                                          </div>
                                       </td>
                                    </tr>
                                  );
                                })}
                             </tbody>
                          </table>
                       </div>
                    </Card>

                    <div className="p-6 bg-rose-500/5 border border-rose-500/10 rounded-[32px] flex items-center gap-6">
                       <div className="w-12 h-12 rounded-2xl bg-rose-500 flex items-center justify-center shrink-0 shadow-lg shadow-rose-500/20">
                          <Bot className="w-6 h-6 text-white" />
                       </div>
                       <div>
                          <p className="text-sm font-bold uppercase tracking-tight text-white italic">Intelligent Sourcing</p>
                          <p className="text-xs text-zinc-500">Calculations based on actual depletion rates from {logs.filter(l => l.timestamp > Date.now() - 4*24*60*60*1000).length} verified sessions in the last 4 days.</p>
                       </div>
                    </div>
                 </div>
              </div>
            </TabsContent>

            <TabsContent value="batching" className="m-0 space-y-6 pb-20">
              <div className="flex flex-col md:flex-row justify-between items-center bg-zinc-900 border border-zinc-800 p-6 rounded-[32px] gap-4">
                <div>
                  <h2 className="text-2xl font-bold uppercase tracking-tight text-orange-500">Signature Batching</h2>
                  <p className="text-sm text-zinc-500">Scale signature recipes for bulk preparation</p>
                </div>
                <div className="relative w-full md:w-64">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                   <Input 
                     placeholder="Search batch recipes..." 
                     value={batchSearchQuery}
                     onChange={e => setBatchSearchQuery(e.target.value)}
                     className="pl-10 bg-zinc-950 border-zinc-800 rounded-2xl h-12"
                   />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {batchRecipes
                        .filter(r => r.name.toLowerCase().includes(batchSearchQuery.toLowerCase()))
                        .map(recipe => (
                          <Card 
                            key={recipe.id} 
                            onClick={() => {
                              setSelectedBatchRecipe(recipe);
                              setBatchVolumeInput(recipe.baseVolume.toString());
                            }}
                            className="bg-zinc-900 border-zinc-800 p-6 rounded-[32px] hover:border-orange-500/50 transition-all cursor-pointer group relative overflow-hidden"
                          >
                             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                               <RefreshCcw className="w-12 h-12 text-orange-500" />
                             </div>
                             <h3 className="text-xl font-bold text-white uppercase tracking-tight mb-2">{recipe.name}</h3>
                             <div className="flex items-center gap-2 mb-4">
                               <Badge variant="outline" className="bg-orange-500/10 text-orange-400 border-none uppercase text-[10px]">
                                 Mother Data: {recipe.baseVolume}L
                               </Badge>
                             </div>
                             <div className="space-y-1">
                                {recipe.ingredients.slice(0, 3).map((ing, idx) => (
                                  <p key={idx} className="text-[10px] text-zinc-500 uppercase truncate">• {ing.name}</p>
                                ))}
                                {recipe.ingredients.length > 3 && <p className="text-[10px] text-zinc-600 italic">+{recipe.ingredients.length - 3} more ingredients</p>}
                             </div>
                          </Card>
                      ))}
                   </div>
                </div>

                <div className="space-y-6">
                   <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 ml-2">Batch Production Log</h3>
                   <ScrollArea className="h-[600px] pr-4">
                      <div className="space-y-3">
                         {batchLogs.length === 0 ? (
                           <Card className="bg-zinc-900 border-zinc-800 p-12 text-center text-zinc-700 rounded-[32px]">
                             <p className="text-[10px] uppercase">No batches logged yet</p>
                           </Card>
                         ) : batchLogs.map(log => (
                           <Card key={log.id} className="bg-zinc-900 border-zinc-800 p-4 rounded-2xl group">
                              <div className="flex justify-between items-start mb-2">
                                 <div>
                                    <p className="text-xs font-bold text-white uppercase">{log.recipeName}</p>
                                    <p className="text-[10px] text-zinc-500">{formatDate(log.timestamp)}</p>
                                 </div>
                                 <Badge className="bg-orange-600 text-white border-none">{log.targetVolume}L</Badge>
                              </div>
                              <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                 <Button 
                                   variant="ghost" 
                                   size="icon" 
                                   onClick={() => handleDeleteBatchLog(log.id)}
                                   className="h-6 w-6 text-zinc-600 hover:text-red-500"
                                 >
                                   <Trash2 className="w-3.5 h-3.5" />
                                 </Button>
                              </div>
                           </Card>
                         ))}
                      </div>
                   </ScrollArea>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      <Dialog open={!!selectedBatchRecipe} onOpenChange={open => !open && setSelectedBatchRecipe(null)}>
        <DialogContent className="bg-zinc-950 border-zinc-900 text-white max-w-2xl rounded-[32px] p-0 overflow-hidden shadow-2xl">
           {selectedBatchRecipe && activeBatch?.recipeId === selectedBatchRecipe.id ? (
             // Step by Step Mode
             <div className="flex flex-col h-[85vh] md:h-auto md:max-h-[85vh]">
                <div className="bg-orange-600 p-6 flex flex-col gap-2">
                   <div className="flex justify-between items-center">
                      <Button variant="ghost" size="icon" onClick={() => setSelectedBatchRecipe(null)} className="text-white hover:bg-orange-500 rounded-full h-8 w-8">
                        <ArrowLeft className="w-5 h-5" />
                      </Button>
                      <Badge variant="outline" className="border-orange-300 text-white font-mono bg-orange-700/30">
                        {activeBatch.targetVolume}L Production
                      </Badge>
                   </div>
                   <h2 className="text-xl md:text-2xl font-bold uppercase tracking-tight">{selectedBatchRecipe.name}</h2>
                   <div className="flex gap-1 h-1.5 bg-orange-800 rounded-full mt-2 overflow-hidden">
                      {selectedBatchRecipe.steps.map((_, i) => (
                        <div key={i} className={`flex-1 h-full ${i <= activeBatch.currentStep ? 'bg-white' : 'bg-orange-900/50'}`} />
                      ))}
                   </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 md:p-10">
                   <AnimatePresence mode="wait">
                      <motion.div 
                        key={activeBatch.currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                      >
                         <div className="space-y-2">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Current Step {activeBatch.currentStep + 1} of {selectedBatchRecipe.steps.length}</p>
                            <h3 className="text-lg md:text-xl font-medium leading-relaxed text-zinc-100">
                               {selectedBatchRecipe.steps[activeBatch.currentStep]}
                            </h3>
                         </div>

                         {getStepInfusionTime(selectedBatchRecipe.steps[activeBatch.currentStep]) && (
                           <div className="p-6 bg-blue-600/10 border border-blue-500/20 rounded-2xl flex flex-col items-center gap-4">
                              <AlarmClock className="w-10 h-10 text-blue-400" />
                              <div className="text-center">
                                 <p className="text-sm font-bold text-blue-400 uppercase">Timer Required</p>
                                 <p className="text-xs text-zinc-500 mt-1">This step involves infusion. You can set a timer and continue to next steps.</p>
                              </div>
                              <Button 
                                onClick={() => setStepTimer(getStepInfusionTime(selectedBatchRecipe.steps[activeBatch.currentStep])!, selectedBatchRecipe.steps[activeBatch.currentStep])}
                                className="w-full bg-blue-600 hover:bg-blue-700 font-bold rounded-xl"
                              >
                                START {getStepInfusionTime(selectedBatchRecipe.steps[activeBatch.currentStep])} MIN TIMER
                              </Button>
                           </div>
                         )}

                         <div className="pt-8 space-y-4">
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Refer to Scaled Ingredients</h4>
                            <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto pr-2 scrollbar-thin">
                               {(() => {
                                 const stepText = selectedBatchRecipe.steps[activeBatch.currentStep].toLowerCase();
                                 const relevantIngredients = selectedBatchRecipe.ingredients.filter(ing => 
                                   stepText.includes(ing.name.toLowerCase()) || 
                                   // Also check partial matches for common short-hands (e.g. "Bacardi" instead of "Bacardi Carta Blanca")
                                   ing.name.toLowerCase().split(' ').some(word => word.length > 3 && stepText.includes(word))
                                 );

                                 if (relevantIngredients.length === 0) return <p className="text-[10px] text-zinc-600 italic">No specific ingredients mentioned for this step.</p>;

                                 return relevantIngredients.map((ing, i) => {
                                    const ratio = activeBatch.targetVolume / selectedBatchRecipe.baseVolume;
                                    return (
                                      <div key={i} className="flex justify-between items-center py-2 px-3 bg-zinc-900 rounded-lg border border-zinc-800/50">
                                         <span className="text-[10px] uppercase text-zinc-300 truncate pr-4">{ing.name}</span>
                                         <span className="text-xs font-mono font-bold text-orange-400">{(ing.ml * ratio).toLocaleString()}ml</span>
                                      </div>
                                    );
                                 });
                               })()}
                            </div>
                         </div>
                      </motion.div>
                   </AnimatePresence>
                </div>

                <div className="p-6 md:p-8 bg-zinc-950 border-t border-zinc-900 flex flex-col gap-3">
                   {activeBatch.currentStep < selectedBatchRecipe.steps.length - 1 ? (
                     <Button 
                       onClick={() => setActiveBatch(prev => prev ? { ...prev, currentStep: prev.currentStep + 1 } : null)}
                       className="w-full h-16 bg-white text-black hover:bg-zinc-200 font-bold rounded-2xl text-lg uppercase tracking-tight shadow-xl"
                     >
                       Step Finished <ChevronRight className="ml-2 w-5 h-5" />
                     </Button>
                   ) : (
                     <Button 
                       onClick={() => {
                         handleCreateBatch(selectedBatchRecipe, activeBatch.targetVolume);
                         setActiveBatch(null);
                         setSelectedBatchRecipe(null);
                       }}
                       className="w-full h-16 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-2xl text-lg uppercase tracking-tight shadow-xl shadow-orange-900/30"
                     >
                       Finish Batch & Log Production
                     </Button>
                   )}
                   
                   <div className="grid grid-cols-2 gap-4">
                      {activeBatch.currentStep > 0 && (
                        <Button 
                          variant="outline" 
                          onClick={() => setActiveBatch(prev => prev ? { ...prev, currentStep: prev.currentStep - 1 } : null)}
                          className="h-10 border-zinc-800 text-zinc-400 hover:text-white rounded-xl text-[10px] font-bold uppercase"
                        >
                          <ArrowLeft className="w-3 h-3 mr-2" /> Previous Step
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        onClick={() => setActiveBatch(null)} 
                        className={`h-10 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 text-[10px] uppercase font-bold col-span-${activeBatch.currentStep > 0 ? '1' : '2'}`}
                      >
                        Cancel Batch
                      </Button>
                   </div>
                </div>
             </div>
           ) : (
             <>
               <DialogHeader className="sr-only">
                  <DialogTitle>{selectedBatchRecipe?.name} Calculator</DialogTitle>
               </DialogHeader>
               <div className="bg-orange-600 p-8 flex justify-between items-end">
              <div>
                 <p className="text-[10px] uppercase font-bold tracking-widest text-orange-200 mb-1">Scaling Calculator</p>
                 <h2 className="text-3xl font-bold uppercase tracking-tighter">{selectedBatchRecipe?.name}</h2>
              </div>
              <div className="text-right">
                 <p className="text-[10px] uppercase font-bold text-orange-200">Mother Data</p>
                 <p className="text-xl font-mono font-bold">{selectedBatchRecipe?.baseVolume}L</p>
              </div>
           </div>

           <ScrollArea className="max-h-[70vh] p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                 <div className="space-y-6">
                    <div>
                       <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2 block">Target Batch Volume (Liters)</label>
                       <div className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                          <input 
                            type="number" 
                            step="0.5"
                            value={batchVolumeInput} 
                            onChange={e => setBatchVolumeInput(e.target.value)}
                            className="text-4xl font-mono font-bold bg-transparent border-none focus:ring-0 w-full outline-none"
                          />
                          <span className="text-xl font-bold text-zinc-700">L</span>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Scaled Ingredients</h3>
                       <div className="space-y-2">
                          {selectedBatchRecipe && selectedBatchRecipe.ingredients.map((ing, i) => {
                             const ratio = parseFloat(batchVolumeInput || "0") / selectedBatchRecipe.baseVolume;
                             const scaledMl = ing.ml * ratio;
                             const scaledOz = scaledMl * ML_TO_OZ;

                             // Find bottle size if linked
                             let bottleSize = 750;
                             const excelItem = initialExcelOrder.find(item => item.includes(ing.name));
                             if (excelItem) {
                                const match = excelItem.match(/(\d+)\s*ml/i);
                                if (match) bottleSize = parseInt(match[1]);
                             }
                             const bottles = scaledMl / bottleSize;

                             return (
                               <div key={i} className="flex justify-between items-center bg-zinc-900/50 p-3 rounded-xl border border-zinc-800/30">
                                  <div>
                                     <p className="text-xs font-bold text-white uppercase">{ing.name}</p>
                                     <p className="text-[10px] text-emerald-500 font-mono">
                                       {bottles.toFixed(2)} BTLS ({bottleSize}ML UNIT)
                                     </p>
                                  </div>
                                  <div className="text-right">
                                     <p className="text-sm font-bold font-mono text-zinc-200">{scaledMl.toFixed(0)} ml</p>
                                     <p className="text-[10px] font-mono text-zinc-600">{scaledOz.toFixed(1)} oz</p>
                                  </div>
                               </div>
                             );
                          })}
                       </div>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-orange-500">Method & Steps</h3>
                    <div className="space-y-4">
                       {selectedBatchRecipe?.steps.map((step, i) => (
                         <div key={i} className="flex gap-4 group">
                            <div className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-500 shrink-0 group-hover:border-orange-500/50 transition-colors">{i+1}</div>
                            <p className="text-xs text-zinc-400 leading-relaxed pt-1">{step}</p>
                         </div>
                       ))}
                    </div>
                    
                    <div className="p-4 bg-zinc-900 rounded-2xl border border-purple-500/20 flex gap-4 items-center">
                       <Zap className="text-purple-500 w-5 h-5 shrink-0" />
                       <p className="text-[10px] text-zinc-500 italic">Ingredient quantities are auto-scaled from 20L/10L mother data templates.</p>
                    </div>
                 </div>
              </div>

            </ScrollArea>

           <DialogFooter className="bg-zinc-950 p-8 pt-4 border-t border-zinc-900 flex flex-col gap-2">
              <Button 
                onClick={() => {
                  if (selectedBatchRecipe && batchVolumeInput) {
                    startBatch(selectedBatchRecipe, parseFloat(batchVolumeInput));
                  }
                }}
                className="w-full h-16 bg-white text-black hover:bg-zinc-200 font-bold rounded-2xl text-lg uppercase tracking-tight shadow-xl"
              >
                START MAKING THIS BATCH <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                variant="ghost"
                onClick={() => {
                  if (selectedBatchRecipe && batchVolumeInput) {
                    handleCreateBatch(selectedBatchRecipe, parseFloat(batchVolumeInput));
                    setSelectedBatchRecipe(null);
                  }
                }}
                className="w-full h-10 text-zinc-500 hover:text-orange-500 font-bold rounded-xl text-xs uppercase"
              >
                Confirm Complete (Skip Steps)
              </Button>
           </DialogFooter>
         </>
       )}
   </DialogContent>
</Dialog>

      <Dialog open={!!selectedCocktail} onOpenChange={open => !open && setSelectedCocktail(null)}>
        <DialogContent 
          className="bg-zinc-900 border-zinc-800 text-white max-w-sm rounded-[32px] p-8"
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
        >
           <div className="flex justify-between items-center mb-6">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedCocktail(null)}
                className="text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded-xl px-4 uppercase text-[10px] font-bold tracking-widest"
              >
                Cancel
              </Button>
              <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center border border-blue-500/20"><GlassWater className="text-blue-500 w-5 h-5" /></div>
           </div>

           <div className="text-center mb-8">
             <h2 className="text-xl font-bold uppercase tracking-tight">{selectedCocktail?.name}</h2>
             <p className="text-[10px] text-zinc-500 mt-2 font-mono uppercase truncate px-4">{selectedCocktail?.ingredients.map(i=>`${i.ml}ml ${i.name}`).join(' / ')}</p>
           </div>

           <div className="bg-black border border-zinc-800 rounded-3xl p-8 text-center mb-8 shadow-inner">
             <p className="text-[10px] uppercase text-zinc-500 tracking-widest mb-6 font-bold">Adjust Quantity</p>
             <div className="flex items-center justify-center gap-8">
                <Button variant="outline" size="icon" onClick={() => setQuantityInput(Math.max(1, parseInt(quantityInput)-1).toString())} className="rounded-full w-12 h-12 bg-zinc-900 border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 active:scale-95 transition-all text-xl font-bold">—</Button>
                <input 
                  ref={quantityInputRef} 
                  type="number" 
                  value={quantityInput} 
                  onChange={e => setQuantityInput(e.target.value.replace(/\D/g,''))} 
                  onFocus={e => e.target.select()}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddUsage();
                    }
                  }}
                  className="w-24 text-5xl font-mono font-bold text-center bg-transparent border-none focus:ring-0 outline-none hover:text-blue-500 transition-colors" 
                />
                <Button variant="outline" size="icon" onClick={() => setQuantityInput((parseInt(quantityInput)+1).toString())} className="rounded-full w-12 h-12 bg-zinc-900 border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 active:scale-95 transition-all text-xl font-bold">+</Button>
             </div>
           </div>
           
           <DialogFooter>
             <Button 
               onClick={handleAddUsage} 
               className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-16 rounded-[24px] text-lg uppercase tracking-tight shadow-lg shadow-blue-900/20 group"
             >
               RECORD SALE <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
             </Button>
           </DialogFooter>
        </DialogContent>
      </Dialog>
       <Dialog open={!!selectedLog} onOpenChange={open => !open && setSelectedLog(null)}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-md rounded-[32px] p-8">
          <DialogHeader>
            <DialogTitle className="text-center text-blue-500 font-mono text-xl">
              {selectedLog ? formatDate(selectedLog.date) : ''}
            </DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="h-96 pr-4 mt-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 mb-4 border-b border-zinc-800 pb-2">Items Sold</h3>
                <div className="space-y-2">
                  {(() => {
                    if (!selectedLog) return null;
                    const breakdown: { [id: string]: number } = {};
                    selectedLog.usage.forEach(r => {
                      breakdown[r.cocktailId] = (breakdown[r.cocktailId] || 0) + r.quantity;
                    });
                    
                    return Object.entries(breakdown).map(([id, qty]) => {
                      const item = fullCocktailList.find(c => c.id === id);
                      return (
                        <div key={id} className="flex justify-between items-center py-2 border-b border-zinc-800 last:border-0 hover:bg-white/5 transition-colors px-2 rounded-lg">
                          <div>
                            <p className="text-sm font-medium">{item?.name || id}</p>
                            <p className="text-[10px] text-zinc-500 uppercase tracking-tighter">{item?.category}</p>
                          </div>
                          <div className="bg-blue-600/10 text-blue-400 px-3 py-1 rounded-lg font-mono text-sm font-bold">
                            {qty}
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>

              <div>
                <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 mb-4 border-b border-zinc-800 pb-2">Liquid Consumption</h3>
                <div className="space-y-2">
                  {(() => {
                    if (!selectedLog) return null;
                    const ingTotals: { [name: string]: number } = {};
                    selectedLog.usage.forEach(r => {
                      const item = fullCocktailList.find(c => c.id === r.cocktailId);
                      item?.ingredients.forEach(ing => {
                        if (ing.isAlcohol) {
                          ingTotals[ing.name] = (ingTotals[ing.name] || 0) + (ing.ml * r.quantity);
                        }
                      });
                    });

                    return Object.entries(ingTotals)
                      .sort((a, b) => getExcelSortIndex(a[0]) - getExcelSortIndex(b[0]))
                      .map(([name, ml]) => (
                        <div key={name} className="flex justify-between items-center py-2 border-b border-zinc-800 last:border-0 hover:bg-white/5 transition-colors px-2 rounded-lg">
                          <span className="text-xs text-zinc-300">{getExcelDisplayName(name)}</span>
                          <div className="text-right">
                             <p className="text-sm font-mono text-indigo-400 font-bold">{(ml * ML_TO_OZ).toFixed(1)} oz</p>
                             <p className="text-[10px] text-zinc-600 font-mono">{ml} ml</p>
                          </div>
                        </div>
                      ));
                  })()}
                </div>
              </div>
            </div>
          </ScrollArea>
          
          <DialogFooter className="mt-6">
            <Button onClick={() => setSelectedLog(null)} className="w-full bg-zinc-800 hover:bg-zinc-700 text-white rounded-2xl h-12">DISMISS</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!logToDelete} onOpenChange={open => !open && setLogToDelete(null)}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-sm rounded-[32px] p-8">
          <DialogHeader className="items-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
              <Trash2 className="w-8 h-8 text-red-500" />
            </div>
            <DialogTitle className="text-xl font-bold uppercase tracking-tight text-center">Delete Log?</DialogTitle>
            <p className="text-sm text-zinc-500 text-center mt-2">
              Are you sure you want to delete the log for {logToDelete ? formatDate(logToDelete) : ''}? This action cannot be undone.
            </p>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 mt-8">
            <Button variant="outline" onClick={() => setLogToDelete(null)} className="h-14 rounded-2xl border-zinc-700 hover:bg-zinc-800">CANCEL</Button>
            <Button 
              onClick={async () => {
                if (logToDelete) {
                  if (user) {
                    setIsSyncing(true);
                    try {
                      await deleteDoc(doc(db, 'logs', logToDelete));
                    } catch (err) { 
                      handleFirestoreError(err, 'delete', `logs/${logToDelete}`); 
                    } finally {
                      setIsSyncing(false);
                    }
                  }
                  setLogs(prev => prev.filter(l => l.date !== logToDelete));
                  setLogToDelete(null);
                }
              }} 
              className="h-14 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold"
            >
              DELETE
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={isRecipeDialogOpen} onOpenChange={setIsRecipeDialogOpen}>
        <DialogContent className="bg-zinc-950 border-zinc-800 text-white max-w-2xl rounded-[32px] overflow-hidden p-0">
          <DialogHeader className="p-8 pb-4">
            <DialogTitle className="text-2xl font-bold uppercase tracking-tight">{editingRecipe ? 'Edit Recipe' : 'New Cocktail Recipe'}</DialogTitle>
          </DialogHeader>
          <div className="p-8 pt-0 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest">Cocktail Name</label>
              <Input 
                value={recipeName} 
                onChange={e => setRecipeName(e.target.value)} 
                className="bg-zinc-900 border-zinc-800 text-lg h-14 rounded-2xl" 
                placeholder="e.g. Signature Martini"
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest">Ingredients</label>
              <div className="space-y-3">
                {recipeIngredients.map((ing, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                    <span className="font-bold">{ing.name}</span>
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-amber-500">{ing.ml}ml</span>
                      <Button variant="ghost" size="icon" onClick={() => setRecipeIngredients(prev => prev.filter((_, i) => i !== idx))} className="h-8 w-8 text-zinc-500 hover:text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <select 
                    value={newIngName} 
                    onChange={e => setNewIngName(e.target.value)}
                    className="w-full bg-zinc-900 border-zinc-800 text-white rounded-xl h-12 px-4 focus:ring-amber-500"
                  >
                    <option value="">Select Spirit...</option>
                    {[...allIngredients].sort((a,b) => a.internalName.localeCompare(b.internalName)).map(i => (
                      <option key={i.internalName} value={i.internalName}>{getExcelDisplayName(i.internalName)}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <Input 
                    type="number" 
                    value={newIngMl} 
                    onChange={e => setNewIngMl(e.target.value)} 
                    placeholder="ml" 
                    className="bg-zinc-900 border-zinc-800 rounded-xl" 
                  />
                  <Button 
                    onClick={() => {
                      if(newIngName && newIngMl) {
                        setRecipeIngredients(prev => [...prev, { name: newIngName, ml: parseInt(newIngMl), isAlcohol: true }]);
                        setNewIngName('');
                        setNewIngMl('');
                      }
                    }}
                    className="bg-zinc-800 hover:bg-amber-600 rounded-xl px-4"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <Button onClick={handleSaveRecipe} className="w-full h-14 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-2xl">
              SAVE RECIPE
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isSpiritDialogOpen} onOpenChange={setIsSpiritDialogOpen}>
        <DialogContent className="bg-zinc-950 border-zinc-800 text-white max-w-xl rounded-[32px] overflow-hidden p-0">
          <div className="flex border-b border-zinc-900">
            <button 
              onClick={() => setSpiritMode('add')}
              className={`flex-1 py-6 font-bold uppercase tracking-widest text-xs md:text-sm transition-all ${spiritMode === 'add' ? 'bg-emerald-600 text-white' : 'hover:bg-zinc-900 text-zinc-500'}`}
            >
              {stockFilter === 'alcohol' ? 'Add Spirit' : 'Add Item'}
            </button>
            <button 
              onClick={() => setSpiritMode('remove')}
              className={`flex-1 py-6 font-bold uppercase tracking-widest text-xs md:text-sm transition-all ${spiritMode === 'remove' ? 'bg-red-600 text-white' : 'hover:bg-zinc-900 text-zinc-500'}`}
            >
              {stockFilter === 'alcohol' ? 'Delist Spirit' : 'Delete Item'}
            </button>
          </div>

          <div className="p-8 space-y-6">
            {spiritMode === 'add' ? (
              <div className="space-y-6">
                 <div className="space-y-2">
                   <label className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest">
                     {stockFilter === 'alcohol' ? (editingSpirit ? 'Edit Name' : 'Bottle Name') : (editingSpirit ? 'Edit Item' : 'Item Name')}
                   </label>
                   <Input value={newSpiritName} onChange={e => setNewSpiritName(e.target.value)} className="bg-zinc-900 border-zinc-800 h-12 rounded-xl" placeholder={stockFilter === 'alcohol' ? "e.g. Absolut Vodka" : "e.g. Fresh Orange Juice"} />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <label className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest">
                       {stockFilter === 'alcohol' ? 'Bottle Size (ml)' : 'Base Unit Size'}
                     </label>
                     <div className="relative">
                       <Input type="number" value={newSpiritBtlSize} onChange={e => setNewSpiritBtlSize(e.target.value)} className="bg-zinc-900 border-zinc-800 h-12 rounded-xl" />
                       <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-zinc-600 font-bold uppercase">
                         {stockFilter === 'alcohol' ? 'ML' : (newSpiritName ? (stockInputUnits[newSpiritName] || 'ml') : 'ml')}
                       </span>
                     </div>
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest">
                       {stockFilter === 'alcohol' ? 'Serving Portion (ml)' : 'Preferred Unit'}
                     </label>
                     {stockFilter === 'alcohol' ? (
                       <select value={newSpiritGlassSize} onChange={e => setNewSpiritGlassSize(e.target.value)} className="w-full bg-zinc-900 border-zinc-800 text-white rounded-xl h-12 px-4 outline-none">
                         <option value="45">45ml</option>
                         <option value="30">30ml</option>
                         <option value="0">Bottle Only</option>
                       </select>
                     ) : (
                       <select 
                         className="w-full bg-zinc-900 border-zinc-800 text-white rounded-xl h-12 px-4 outline-none"
                         value={stockInputUnits[newSpiritName] || 'ml'}
                         onChange={(e) => {
                           const unit = e.target.value;
                           setStockInputUnits(prev => ({ ...prev, [newSpiritName]: unit }));
                         }}
                       >
                         <option value="l">L</option>
                         <option value="kg">KG</option>
                         <option value="g">G</option>
                         <option value="unit">Unit</option>
                         <option value="ml">ML</option>
                         <option value="btl">Btl</option>
                       </select>
                     )}
                   </div>
                 </div>
                 {stockFilter === 'alcohol' && (
                   <div className="space-y-2">
                     <label className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest">Position in Table (1-{excelOrder.length + 1})</label>
                     <Input type="number" value={newSpiritPosition} onChange={e => setNewSpiritPosition(e.target.value)} className="bg-zinc-900 border-zinc-800 h-12 rounded-xl" placeholder="e.g. 5" />
                   </div>
                 )}
                 <Button onClick={handleSaveSpirit} className={`w-full h-14 ${editingSpirit ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700'} text-white font-bold rounded-2xl`}>
                   {editingSpirit ? (stockFilter === 'alcohol' ? 'UPDATE SPIRIT CONFIG' : 'UPDATE ITEM CONFIG') : (stockFilter === 'alcohol' ? 'ADD TO STOCK' : 'ADD ITEM')}
                 </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <label className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest">Select items to remove</label>
                <ScrollArea className="h-64 pr-4 border border-zinc-900 rounded-xl p-4">
                  <div className="space-y-2">
                    {[...allIngredients]
                      .filter(i => i.isAlcohol === (stockFilter === 'alcohol'))
                      .sort((a,b) => getExcelDisplayName(a.internalName).localeCompare(getExcelDisplayName(b.internalName)))
                      .map(i => (
                      <div key={i.internalName} className="flex items-center gap-3 p-3 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors">
                        <input 
                          type="checkbox" 
                          checked={spiritsToRemove.includes(i.internalName)}
                          onChange={e => {
                            if(e.target.checked) setSpiritsToRemove(prev => [...prev, i.internalName]);
                            else setSpiritsToRemove(prev => prev.filter(n => n !== i.internalName));
                          }}
                          className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-red-600 focus:ring-red-500"
                        />
                        <span className="text-sm">{getExcelDisplayName(i.internalName)}</span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <Button onClick={handleRemoveSpirits} disabled={spiritsToRemove.length === 0} className="w-full h-14 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl disabled:opacity-50">
                  CONFIRM REMOVAL ({spiritsToRemove.length})
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      {activeBatch && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[95vw] max-w-sm">
           <motion.div 
             initial={{ y: 50, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             className="bg-zinc-900 border border-orange-500/30 rounded-3xl p-4 shadow-2xl flex items-center gap-4 cursor-pointer hover:border-orange-500 transition-colors group"
             onClick={() => {
               const recipe = batchRecipes.find(r => r.id === activeBatch.recipeId);
               if (recipe) {
                  setSelectedBatchRecipe(recipe);
                  setBatchVolumeInput(activeBatch.targetVolume.toString());
               }
             }}
           >
              <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center shrink-0 relative overflow-hidden">
                 <RefreshCcw className="w-6 h-6 text-white animate-spin-slow" />
                 <div className="absolute inset-0 bg-black/20 flex items-center justify-center text-[10px] font-bold">
                    {Math.round(((activeBatch.currentStep + 1) / (batchRecipes.find(r => r.id === activeBatch.recipeId)?.steps.length || 1)) * 100)}%
                 </div>
              </div>
              <div className="flex-1 min-w-0">
                 <p className="text-[10px] uppercase font-bold text-orange-500 tracking-widest">Active Batch</p>
                 <h4 className="text-sm font-bold text-white truncate uppercase">{batchRecipes.find(r => r.id === activeBatch.recipeId)?.name}</h4>
                 
                 {activeBatch.timers.length > 0 && (
                   <div className="mt-1 flex items-center gap-2">
                      <TimerIcon className="w-3 h-3 text-blue-400 animate-pulse" />
                      <span className="text-[10px] font-mono text-blue-300">
                        {(() => {
                           const soonest = Math.min(...activeBatch.timers.map(t => t.endTime));
                           const remaining = Math.max(0, soonest - Date.now());
                           const mm = Math.floor(remaining / 60000);
                           const ss = Math.floor((remaining % 60000) / 1000);
                           return `${mm}:${ss.toString().padStart(2, '0')} Alert Soon`;
                        })()}
                      </span>
                   </div>
                 )}
              </div>
              <div className="shrink-0 p-2 bg-zinc-800 rounded-xl group-hover:bg-orange-500 transition-colors">
                 <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-white" />
              </div>
           </motion.div>
        </div>
      )}
    </div>
  );
}
