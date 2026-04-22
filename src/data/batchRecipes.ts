import { BatchRecipe } from '../types';

export const initialBatchRecipes: BatchRecipe[] = [
  {
    id: '7-11-sugar-rush',
    name: '7/11 Sugar Rush',
    baseVolume: 20,
    ingredients: [
      { name: 'Bacardi Carta Blanca 750 ml', ml: 10000, isAlcohol: true },
      { name: 'Oolong tea (grams)', ml: 150, isAlcohol: false },
      { name: 'Kraken Spiced Rum 700 ml', ml: 5000, isAlcohol: true },
      { name: 'Crème de cacao 700 ml', ml: 1667, isAlcohol: true },
      { name: 'Palm sugar (grams)', ml: 1110, isAlcohol: false },
      { name: 'Silpin Jasmine Rice Syrup 500 ml', ml: 555, isAlcohol: false },
      { name: 'Coconut water', ml: 1670, isAlcohol: false },
      { name: 'Orange Blossom Water', ml: 17, isAlcohol: false }
    ],
    steps: [
      'STEP 1 — Tea Infusion: Take a 10L container, place nylon mesh bag inside. Add 10L Bacardi & 150g Oolong tea. Infuse for 45 MINS ONLY. Strain immediately.',
      'STEP 2 — Palm Coco Syrup: Heat 1670ml coconut water & 1110g palm sugar gently until dissolved. Add 555ml Jasmine Rice Syrup. Cool to room temp & fine strain.',
      'STEP 3 — Batch Assembly: Add ingredients in order: 10L Tea-infused Bacardi, 5L Kraken, 1670ml Crème de Cacao, 3330ml Palm Coco Syrup (Total), 17ml Orange Blossom.',
      'STEP 4 — Final Mixing: Long stir thoroughly. Taste for sweetness and aroma. Fine strain into storage if needed.',
      'SERVICE: Pour 75ml per glass over ice. Yields ~266 drinks.'
    ]
  },
  {
    id: 'sukhumvit-after-dark',
    name: 'Sukhumvit After Dark',
    baseVolume: 20,
    ingredients: [
      { name: 'Grey Goose Vodka 750 ml', ml: 13814, isAlcohol: true },
      { name: 'Dried butterfly pea flowers (grams)', ml: 200, isAlcohol: false },
      { name: 'Saffron (grams)', ml: 0.5, isAlcohol: false },
      { name: 'Kwai Feh Lychee liqueur 700 ml', ml: 3070, isAlcohol: true },
      { name: 'Simple syrup', ml: 767.5, isAlcohol: false },
      { name: 'Agave syrup', ml: 767.5, isAlcohol: false },
      { name: 'Water (for Citrus)', ml: 1535, isAlcohol: false },
      { name: 'Citric acid (grams)', ml: 61.4, isAlcohol: false },
      { name: 'Malic acid (grams)', ml: 30.7, isAlcohol: false },
      { name: 'Saline solution (10%)', ml: 46, isAlcohol: false }
    ],
    steps: [
      'Step 1 — Infusion: Place mesh bag in bucket. Add 200g Butterfly Pea & 0.5g Saffron. Pour 13814ml Grey Goose. Infuse for 45 minutes.',
      'Step 2 — Citrus: Add 1535ml water, 61.4g Citric & 30.7g Malic acid. Stir until dissolved.',
      'Step 3 — Silk Syrup: Mix 767.5ml Simple syrup & 767.5ml Agave syrup.',
      'Step 4 — Saline: Mix 10g salt with 90ml water. Measure and use 46ml for the batch.',
      'Step 5 — Finish: Remove infusion bag. Add Lychee liqueur, citrus solution, and saline. Stir.',
      'Step 6 — Adjustment: Add Silk Syrup and stir well.',
      'SERVICE: 65ml per cocktail. Yields ~307 drinks.'
    ]
  },
  {
    id: 'khaosan-regret',
    name: 'Khaosan Regret',
    baseVolume: 20,
    ingredients: [
      { name: 'Bombay Sapphire 750 ml', ml: 4000, isAlcohol: true },
      { name: 'Aperol 700 ml', ml: 2667, isAlcohol: true },
      { name: 'Pisco 700 ml', ml: 5333, isAlcohol: true },
      { name: 'White Wine (Sauvignon Blanc) 750 ml', ml: 3462, isAlcohol: true },
      { name: 'Passionfruit Monin 700 ml', ml: 577, isAlcohol: false },
      { name: 'Strawberry Monin 700 ml', ml: 1731, isAlcohol: false },
      { name: 'Water (for Citrus)', ml: 1885, isAlcohol: false },
      { name: 'Citric Acid (grams)', ml: 75, isAlcohol: false },
      { name: 'Malic Acid (grams)', ml: 38, isAlcohol: false },
      { name: 'Water (for Saline)', ml: 208, isAlcohol: false },
      { name: 'Salt (grams)', ml: 23.1, isAlcohol: false },
      { name: 'Orange Blossom Water', ml: 6, isAlcohol: false },
      { name: 'Coconut Essence', ml: 26, isAlcohol: false }
    ],
    steps: [
      '1. MAKE SALINE: Mix 208ml water with 23.1g salt. Stir until dissolved.',
      '2. MAKE CITRUS: Mix 1885ml water with 75g Citric and 38g Malic acid. Keep aside.',
      '3. MAKE PARTY CORDIAL: Mix 3462ml White Wine, 577ml Passionfruit Monin, 1731ml Strawberry Monin, all Saline, and 6ml Orange Blossom last.',
      '4. MAKE SPIRIT MIX: Mix 4L Bombay, 5.3L Pisco, 2.6L Aperol, and 26ml Coconut Essence last.',
      '5. FINAL ASSEMBLY: Combine Spirit Mix (12L), Party Cordial (6L), and Citrus (2L). Stir thoroughly.',
      'SERVICE: 90ml per drink over ice.'
    ]
  },
  {
    id: 'bts-highball',
    name: 'BTS Highball',
    baseVolume: 20,
    ingredients: [
      { name: 'Patron Reposado 750 ml', ml: 8680, isAlcohol: true },
      { name: 'Martini Bianco 750 ml', ml: 1860, isAlcohol: true },
      { name: 'Blue Curaçao 700 ml', ml: 1240, isAlcohol: true },
      { name: 'Monin Rose 700 ml', ml: 2480, isAlcohol: false },
      { name: 'Vodka (for Tincture) 750 ml', ml: 2480, isAlcohol: true },
      { name: 'Hops (grams)', ml: 124, isAlcohol: false },
      { name: 'Water (for Citrus)', ml: 2976, isAlcohol: false },
      { name: 'Citric acid (grams)', ml: 119, isAlcohol: false },
      { name: 'Malic acid (grams)', ml: 60, isAlcohol: false },
      { name: 'Salt (grams)', ml: 24.8, isAlcohol: false },
      { name: 'Water (for Saline)', ml: 248, isAlcohol: false },
      { name: 'Rose Water', ml: 25, isAlcohol: false }
    ],
    steps: [
      'Step 1 — Hops Tincture: Infuse 124g hops in 2480ml Vodka for 30-45 mins. Target light bitterness. Remove hops immediately after.',
      'Step 2 — Citrus: Mix water and acids until dissolved.',
      'Step 3 — Saline: Mix 24.8g salt with 248ml water until dissolved.',
      'Step 4 — Main Build: Mix Patron, Martini Bianco, Blue Curaçao, and Monin Rose. Stir gently.',
      'Step 5 — Integration: Add Citrus solution and Saline. Stir thoroughly.',
      'Step 6 — Tincture (CONTROLLED): Add 80% tincture first, taste, then add remaining to balance bitterness.',
      'Step 7 — Finish: Add 25ml rose water last. Stir gently.',
      'SERVICE: ~80ml per drink. Yields ~248 drinks.'
    ]
  },
  {
    id: 'sunset-at-chao-phraya',
    name: 'Sunset at Chao Phraya',
    baseVolume: 20,
    ingredients: [
      { name: 'Water (for Tea)', ml: 9333, isAlcohol: false },
      { name: 'Earl Grey tea (grams)', ml: 149, isAlcohol: false },
      { name: 'Peachtree Peach liqueur 700 ml', ml: 4000, isAlcohol: true },
      { name: 'St-Germain 700 ml', ml: 2133, isAlcohol: true },
      { name: 'Bergamotto 700 ml', ml: 5333, isAlcohol: true },
      { name: 'Water (for Citrus)', ml: 2667, isAlcohol: false },
      { name: 'Citric acid (grams)', ml: 106.7, isAlcohol: false },
      { name: 'Malic acid (grams)', ml: 53.3, isAlcohol: false },
      { name: 'Salt (grams)', ml: 26.7, isAlcohol: false },
      { name: 'Water (for Saline)', ml: 267, isAlcohol: false }
    ],
    steps: [
      'Step 1 — Prep Citrus: Mix 2667ml water with 106.7g Citric and 53.3g Malic acid. Set aside.',
      'Step 2 — Prep Saline: Mix 267ml water with 26.7g salt.',
      'Step 3 — Tea: Heat 9333ml water to 90-95°C. Steep 149g Earl Grey for 3-4 mins ONLY in mesh. Cool completely & strain.',
      'Step 4 — Sunset Cordial: Mix tea, Peachtree, St-Germain, and saline. Stir.',
      'Step 5 — Final Build: Combine Cordial, Bergamotto, and Citrus solution. Mix thoroughly.',
      'SERVICE: 75ml per drink. Yields ~266 drinks.'
    ]
  },
  {
    id: 'jodd-fairs-gluttony',
    name: 'Jodd Fairs Gluttony',
    baseVolume: 20,
    ingredients: [
      { name: 'Hoxton Gin 700 ml', ml: 5260, isAlcohol: true },
      { name: 'Patrón Reposado 750 ml', ml: 7900, isAlcohol: true },
      { name: 'La Luna Mezcal 750 ml', ml: 1580, isAlcohol: true },
      { name: 'Fino Sherry (Tio Pepe) 750 ml', ml: 1020, isAlcohol: true },
      { name: 'White soy sauce', ml: 340, isAlcohol: false },
      { name: 'Emishiki Sensation Sake 1.5 L', ml: 340, isAlcohol: true },
      { name: 'Pineapple Monin 700 ml', ml: 2280, isAlcohol: false },
      { name: 'Water (for Citrus)', ml: 1280, isAlcohol: false },
      { name: 'Citric acid (grams)', ml: 51, isAlcohol: false },
      { name: 'Malic acid (grams)', ml: 26, isAlcohol: false },
      { name: 'Kombu chips (units)', ml: 5, isAlcohol: false },
      { name: 'Orange Food Color (dash)', ml: 1, isAlcohol: false }
    ],
    steps: [
      'Step 1 — Citrus: Mix 1280ml water with 51g Citric and 26g Malic acid.',
      'Step 2 — Umami Tincture: Mix Sherry, Soy sauce, and Sake. Add 5 kombu chips. Infuse 30-60 mins. Strain.',
      'Step 3 — Tropical Blend: Mix Pineapple Monin, Citrus solution, and Umami tincture.',
      'Step 4 — Tropical Spirit: Mix 5.26L Hoxton Gin with Tropical Blend.',
      'Step 5 — Final Batch: Combine Tropical Spirit, Patron Reposado, and Mezcal. Stir 2 mins. Add orange color until pineapple yellow.'
    ]
  },
  {
    id: 'hotel-lobby-drams',
    name: 'Hotel Lobby Drams',
    baseVolume: 20,
    ingredients: [
      { name: 'Johnnie Walker Gold 750 ml', ml: 11030, isAlcohol: true },
      { name: 'Talisker 750 ml', ml: 1380, isAlcohol: true },
      { name: 'Fernet Branca 700 ml', ml: 2070, isAlcohol: true },
      { name: 'Campari Cask Tales 1 L', ml: 1380, isAlcohol: true },
      { name: 'Palo Cortado Sherry 375 ml', ml: 2760, isAlcohol: true },
      { name: 'Butterscotch Monin 700 ml', ml: 1380, isAlcohol: false }
    ],
    steps: [
      'Step 1 — Setup: Sanitized 20L container, stable surface.',
      'Step 2 — Base: Add 11L JW Gold and 1.38L Talisker. Stir 30s.',
      'Step 3 — Bitter Structure: Add Fernet and Campari. Stir 60s for backbone.',
      'Step 4 — Wine: Add Palo Cortado Sherry. Stir 1 min.',
      'Step 5 — Sweet: Add Butterscotch Monin. Stir 3 mins thoroughly.'
    ]
  },
  {
    id: 'temple-run',
    name: 'Temple Run',
    baseVolume: 10,
    ingredients: [
      { name: 'Mango Juice', ml: 6923, isAlcohol: false },
      { name: 'Coconut Juice', ml: 4307, isAlcohol: false },
      { name: 'Silpin Jasmine Rice Syrup 500 ml', ml: 256, isAlcohol: false },
      { name: 'Coconut Monin 700 ml', ml: 256, isAlcohol: false },
      { name: 'Water (for Citrus)', ml: 256, isAlcohol: false },
      { name: 'Citric acid (grams)', ml: 10.24, isAlcohol: false },
      { name: 'Malic acid (grams)', ml: 5.12, isAlcohol: false },
      { name: 'Pandan Essence (drops)', ml: 17, isAlcohol: false },
      { name: 'Sodium Bicarbonate (pinch)', ml: 2, isAlcohol: false }
    ],
    steps: [
      '1. Citrus: Mix 256ml water, 10.24g Citric & 5.12g Malic acid. Stir until dissolved.',
      '2. Cordial: Mix 256ml Silpin Jasmine Rice, 256ml Coconut Monin, citrus solution, and 17 drops Pandan essence.',
      '3. Assembly: Combine Mango juice, Coconut juice, and Cordial. Add 2 pinches of Sodium Bicarbonate.',
      'FINAL: ~100ml per drink. Chill well.'
    ]
  },
  {
    id: 'lost-in-chatuchak',
    name: 'Lost in Chatuchak',
    baseVolume: 10,
    ingredients: [
      { name: 'Guava Juice', ml: 6660, isAlcohol: false },
      { name: 'Fresh Chillies (pcs)', ml: 10, isAlcohol: false },
      { name: 'Hale Blue Boy Jasmine 710 ml', ml: 555, isAlcohol: false },
      { name: 'Silpin Tamarind Syrup 500 ml', ml: 1110, isAlcohol: false },
      { name: 'Water (for Citrus)', ml: 1665, isAlcohol: false },
      { name: 'Citric acid (grams)', ml: 66.6, isAlcohol: false },
      { name: 'Malic acid (grams)', ml: 33.3, isAlcohol: false },
      { name: 'Sodium Bicarbonate (pinch)', ml: 2, isAlcohol: false }
    ],
    steps: [
      '1. Citrus: Mix 1665ml water, 66.6g Citric & 33.3g Malic acid.',
      '2. Spiced Guava: Blend 10 chillies with 2L of guava juice total (2 batches). Mix with citrus solution in nylon mesh, squeeze out juices.',
      '3. Assembly: Add remaining 4660ml guava juice, 555ml Hale Blue Boy, and 1110ml Silpin Tamarind Syrup.',
      '4. Final: Add 2 pinches Sodium Bicarbonate to prevent spoiling.',
      'FINAL: ~100ml per drink over ice.'
    ]
  }
];
