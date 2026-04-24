import { BatchRecipe } from '../types';

export const initialBatchRecipes: BatchRecipe[] = [
  {
    id: '7-11-sugar-rush',
    name: '7/11 Sugar Rush',
    baseVolume: 20,
    portionSize: 75,
    ingredients: [
      { name: 'Bacardi Carta Blanca 750 ml', ml: 10000, isAlcohol: true },
      { name: 'Oolong tea (grams)', ml: 150, isAlcohol: false },
      { name: 'Kraken Spiced Rum 700 ml', ml: 5000, isAlcohol: true },
      { name: 'Creme De Cacao White "BOLS" 700 ml', ml: 1667, isAlcohol: true },
      { name: 'Palm sugar (grams)', ml: 1110, isAlcohol: false },
      { name: 'Silpin Jasmine Rice Syrup 500 ml', ml: 555, isAlcohol: false },
      { name: 'Coconut Juice (1L)', ml: 1670, isAlcohol: false },
      { name: 'Orange Blossom Water', ml: 17, isAlcohol: false }
    ],
    steps: [
      'STEP 1 — Tea Infusion: Take a 10L container, place nylon mesh bag inside. Add 10L Bacardi & 150g Oolong tea. Infuse for 45 MINS ONLY. Strain immediately.',
      'STEP 2 — Palm Coco Syrup: Heat 1670ml coconut water & 1110g palm sugar gently until dissolved. Add 555ml Jasmine Rice Syrup. Cool to room temp & fine strain.',
      'STEP 3 — Batch Assembly: Add ingredients in order: 10L Tea-infused Bacardi, 5L Kraken, 1667ml Crème de Cacao, 3330ml Palm Coco Syrup (Total), 17ml Orange Blossom.',
      'STEP 4 — Final Mixing: Long stir thoroughly. Taste for sweetness and aroma. Fine strain into storage if needed.'
    ]
  },
  {
    id: 'sukhumvit-after-dark',
    name: 'Sukhumvit After Dark',
    baseVolume: 20,
    portionSize: 65,
    ingredients: [
      { name: 'Grey Goose Original 750 ml', ml: 15385, isAlcohol: true },
      { name: 'Lychee Liqueur Kwai Feh 700 ml', ml: 3462, isAlcohol: true },
      { name: 'Citric Acid (grams)', ml: 61.5, isAlcohol: false },
      { name: 'Malic Acid (grams)', ml: 30.8, isAlcohol: false },
      { name: 'Water', ml: 1446 + 41.5 + 1446, isAlcohol: false }, // Combined all water for Sukhumvit
      { name: 'Simple Syrup (1L)', ml: 769, isAlcohol: false },
      { name: 'Agave Syrup (1L)', ml: 769, isAlcohol: false },
      { name: 'Salt (grams)', ml: 4.6, isAlcohol: false },
      { name: 'Dried Butterfly Pea Flowers (grams)', ml: 200, isAlcohol: false },
      { name: 'Saffron (grams)', ml: 0.5, isAlcohol: false }
    ],
    steps: [
      'Step 1 — Infusion: Place mesh bag in bucket. Add 200g Butterfly Pea & 0.5g Saffron. Pour Grey Goose. Infuse for 45 minutes.',
      'Step 2 — Citrus: Add water, Citric & Malic acid. Stir until dissolved.',
      'Step 3 — Silk Syrup: Mix Simple syrup & Agave syrup.',
      'Step 4 — Saline: Mix salt with water.',
      'Step 5 — Finish: Remove infusion bag. Add Lychee liqueur, citrus solution, and saline. Stir.'
    ]
  },
  {
    id: 'khaosan-regret',
    name: 'Khaosan Regret',
    baseVolume: 20,
    portionSize: 90,
    ingredients: [
      { name: 'Bombay Sapphire Gin 750 ml', ml: 4000, isAlcohol: true },
      { name: 'Demonio De Los Andes Pisco 700 ml', ml: 5333, isAlcohol: true },
      { name: 'Aperol 700 ml', ml: 2667, isAlcohol: true },
      { name: 'White Wine (Sauvignon Blanc) 750 ml', ml: 3467, isAlcohol: true },
      { name: 'Monin Strawberry Syrup 700 ml', ml: 1733, isAlcohol: false },
      { name: 'Monin Passionfruit Syrup 700 ml', ml: 578, isAlcohol: false },
      { name: 'Citric Acid (grams)', ml: 75.5, isAlcohol: false },
      { name: 'Malic Acid (grams)', ml: 37.8, isAlcohol: false },
      { name: 'Water', ml: 1889 + 209 + 209, isAlcohol: false },
      { name: 'Salt (grams)', ml: 22.2, isAlcohol: false },
      { name: 'Coconut Essence', ml: 26.6, isAlcohol: false },
      { name: 'Orange Blossom Water', ml: 6.6, isAlcohol: false }
    ],
    steps: [
      '1. MAKE SALINE: Mix water with salt. Stir until dissolved.',
      '2. MAKE CITRUS: Mix water with Citric and Malic acid.',
      '3. MAKE PARTY CORDIAL: Mix White Wine, Monins, Saline, and Orange Blossom.',
      '4. MAKE SPIRIT MIX: Mix Bombay, Pisco, Aperol, and Coconut Essence.',
      '5. FINAL ASSEMBLY: Combine everything and stir thoroughly.'
    ]
  },
  {
    id: 'bts-highball',
    name: 'BTS Highball',
    baseVolume: 20,
    portionSize: 80,
    ingredients: [
      { name: 'Patron Reposado Tequila 750 ml', ml: 8700, isAlcohol: true },
      { name: 'Martini Bianco 1 L', ml: 1862, isAlcohol: true },
      { name: 'Blue Curacao 700 ml', ml: 1242, isAlcohol: true },
      { name: 'Monin Rose Syrup 700 ml', ml: 2485, isAlcohol: false },
      { name: 'Citric Acid (grams)', ml: 120, isAlcohol: false },
      { name: 'Malic Acid (grams)', ml: 60, isAlcohol: false },
      { name: 'Water', ml: 2800 + 222 + 222, isAlcohol: false },
      { name: 'Salt (grams)', ml: 25, isAlcohol: false },
      { name: 'Hops (grams)', ml: 125, isAlcohol: false },
      { name: 'Grey Goose Original 750 ml', ml: 2360, isAlcohol: true },
      { name: 'Rose Water', ml: 0.5, isAlcohol: false }
    ],
    steps: [
      'Step 1 — Hops Tincture: Infuse hops in Grey Goose for 30-45 mins. Target light bitterness.',
      'Step 2 — Citrus: Mix water and acids.',
      'Step 3 — Saline: Mix salt with water.',
      'Step 4 — Main Build: Mix Patron, Martini Bianco, Blue Curaçao, and Monin Rose.',
      'Step 5 — Integration: Add Citrus and Saline. Stir.',
      'Step 6 — Tincture: Add tincture to balance.',
      'Step 7 — Finish: Add rose water last.'
    ]
  },
  {
    id: 'sunset-at-chao-phraya',
    name: 'Sunset at Chao Phraya',
    baseVolume: 20,
    portionSize: 75,
    ingredients: [
      { name: 'Earl Grey Tea (grams)', ml: 11.5, isAlcohol: false },
      { name: 'Water', ml: 9813, isAlcohol: false },
      { name: 'Peachtree (The Original) 700 ml', ml: 3040, isAlcohol: true },
      { name: 'St.German 700 ml', ml: 1627, isAlcohol: true },
      { name: 'Bergamotto Fantastico 700 ml', ml: 5333, isAlcohol: true },
      { name: 'Citric Acid (grams)', ml: 106.7, isAlcohol: false },
      { name: 'Malic Acid (grams)', ml: 53.3, isAlcohol: false },
      { name: 'Salt (grams)', ml: 21.3, isAlcohol: false }
    ],
    steps: [
      'Step 1 — Tea: Steep Earl Grey in hot water for 3-4 mins. Cool completely.',
      'Step 2 — Citrus: Mix acids in water.',
      'Step 3 — Final Build: Combine tea, liqueurs, and citrus solution. Mix thoroughly.'
    ]
  },
  {
    id: 'jodd-fairs-gluttony',
    name: 'Jodd Fairs Gluttony',
    baseVolume: 20,
    portionSize: 75,
    ingredients: [
      { name: 'Hoxton Tropical Gin 700 ml', ml: 5333, isAlcohol: true },
      { name: 'Patron Reposado Tequila 750 ml', ml: 8000, isAlcohol: true },
      { name: 'Montelobos Mezcal Tequila 700 ml', ml: 1600, isAlcohol: true },
      { name: 'Tio Pepe Sherry 750 ml', ml: 1067, isAlcohol: true },
      { name: 'Emishiki Sensation Sake 1.5 L', ml: 267, isAlcohol: true },
      { name: 'Monin Pineapple Syrup 700 ml', ml: 2400, isAlcohol: false },
      { name: 'White soy sauce', ml: 267, isAlcohol: false },
      { name: 'Water', ml: 1226, isAlcohol: false },
      { name: 'Citric Acid (grams)', ml: 69, isAlcohol: false },
      { name: 'Malic Acid (grams)', ml: 35, isAlcohol: false }
    ],
    steps: [
      'Step 1 — Citrus: Mix water with Citric and Malic acid.',
      'Step 2 — Umami Tincture: Mix Sherry, Soy sauce, and Sake.',
      'Step 3 — Tropical Blend: Mix Pineapple Monin and Citrus.',
      'Step 4 — Final Batch: Combine all components and stir.'
    ]
  },
  {
    id: 'hotel-lobby-drams',
    name: 'Hotel Lobby Drams',
    baseVolume: 20,
    portionSize: 75,
    ingredients: [
      { name: 'Monin Butterscotch Syrup 700 ml', ml: 1386, isAlcohol: false },
      { name: 'Fernet Branca 1 L', ml: 2080, isAlcohol: true },
      { name: 'Lustau Sherry Palo Cortado Peninsula 375 ml', ml: 2746, isAlcohol: true },
      { name: 'Campari Cask Tales 1000 ml', ml: 1386, isAlcohol: true },
      { name: 'J/W Gold Reserve 750 ml', ml: 11040, isAlcohol: true },
      { name: 'Talisker whisky 10 year 700 ml', ml: 1386, isAlcohol: true }
    ],
    steps: [
      'Step 1 — Base: Add JW Gold and Talisker. Stir.',
      'Step 2 — Bitter Structure: Add Fernet and Campari.',
      'Step 3 — Wine: Add Palo Cortado Sherry.',
      'Step 4 — Sweet: Add Butterscotch Monin. Stir 3 mins.'
    ]
  },
  {
    id: 'temple-run',
    name: 'Temple Run',
    baseVolume: 10,
    portionSize: 120,
    ingredients: [
      { name: 'Mango Juice (1L)', ml: 6923, isAlcohol: false },
      { name: 'Coconut Juice (1L)', ml: 4307, isAlcohol: false },
      { name: 'Silpin Jasmine Rice Syrup 500 ml', ml: 257, isAlcohol: false },
      { name: 'Monin Coconut Syrup 700 ml', ml: 257, isAlcohol: false },
      { name: 'Water (for Citrus)', ml: 256, isAlcohol: false },
      { name: 'Citric acid (grams)', ml: 10, isAlcohol: false },
      { name: 'Malic acid (grams)', ml: 5, isAlcohol: false }
    ],
    steps: [
      '1. Citrus: Mix water and acids.',
      '2. Cordial: Mix Jasmine Rice, Coconut Monin, and citrus.',
      '3. Assembly: Combine juices and Cordial.'
    ]
  },
  {
    id: 'lost-in-chatuchak',
    name: 'Lost in Chatuchak',
    baseVolume: 10,
    portionSize: 75,
    ingredients: [
      { name: 'Guava Juice (1L)', ml: 7333, isAlcohol: false },
      { name: 'Water (for Citrus)', ml: 1665, isAlcohol: false },
      { name: 'Monin Jasmine Syrup 700 ml', ml: 555, isAlcohol: false },
      { name: 'Silpin Tamarind Syrup 500 ml', ml: 1110, isAlcohol: false },
      { name: 'Citric acid (grams)', ml: 66, isAlcohol: false },
      { name: 'Malic acid (grams)', ml: 33, isAlcohol: false }
    ],
    steps: [
      '1. Citrus: Mix water and acids.',
      '2. Assembly: Add guava juice and syrups.',
      '3. Final: Stir thoroughly.'
    ]
  }
];
