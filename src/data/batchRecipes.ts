import { BatchRecipe } from '../types';

export const initialBatchRecipes: BatchRecipe[] = [
  {
    id: '7-11-sugar-rush',
    name: '7/11 Sugar Rush',
    baseVolume: 7.5,
    ingredients: [
      { name: 'Bacardi Carta Blanca 750 ml', ml: 3750, isAlcohol: true },
      { name: 'Oolong tea (grams)', ml: 56.25, isAlcohol: false },
      { name: 'Palm sugar (grams)', ml: 416.25, isAlcohol: false },
      { name: 'Jasmine rice syrup 500 ml', ml: 208, isAlcohol: false },
      { name: 'Coconut water', ml: 625, isAlcohol: false },
      { name: 'Kraken Spiced Rum 700 ml', ml: 1875, isAlcohol: true },
      { name: 'Crème de cacao 700 ml', ml: 625, isAlcohol: true },
      { name: 'Orange blossom', ml: 6, isAlcohol: false }
    ],
    steps: [
      'STEP 1 - Assembly: Combine all ingredients.',
      'SERVICE: Pour 75ml per glass over ice.'
    ]
  },
  {
    id: 'sukhumvit-after-dark',
    name: 'Sukhumvit After Dark',
    baseVolume: 6.5,
    ingredients: [
      { name: 'Grey goose Vodka 750 ml', ml: 4490, isAlcohol: true },
      { name: 'Kwai feh Lychee liqueur 700 ml', ml: 1000, isAlcohol: true },
      { name: 'Citric acid (grams)', ml: 20, isAlcohol: false },
      { name: 'Malic acid (grams)', ml: 10, isAlcohol: false },
      { name: 'Water', ml: 483.5, isAlcohol: false },
      { name: 'Simple syrup', ml: 250, isAlcohol: false },
      { name: 'Agave syrup', ml: 250, isAlcohol: false },
      { name: 'Salt (grams)', ml: 1.5, isAlcohol: false },
      { name: 'Butterfly pea (grams)', ml: 65, isAlcohol: false },
      { name: 'Saffron (grams)', ml: 0.16, isAlcohol: false },
    ],
    steps: [
      'Step 1 — Infusion: Infuse Grey Goose with Butterfly Pea and Saffron.',
      'Step 2 - Assembly: Mix all other ingredients.',
      'SERVICE: 65ml per cocktail + 60ml Prosecco top up.'
    ]
  },
  {
    id: 'khaosan-regret',
    name: 'Khaosan Regret',
    baseVolume: 9,
    ingredients: [
      { name: 'Bombay Sapphire 750 ml', ml: 1800, isAlcohol: true },
      { name: 'Demonio Los Andes Pisco 700 ml', ml: 2400, isAlcohol: true },
      { name: 'Aperol 700 ml', ml: 1200, isAlcohol: true },
      { name: 'White Wine (Sauvignon Blanc) 750 ml', ml: 1560, isAlcohol: true },
      { name: 'Strawberry Monin 700 ml', ml: 780, isAlcohol: false },
      { name: 'Passionfruit Monin 700 ml', ml: 260, isAlcohol: false },
      { name: 'Citric Acid (grams)', ml: 34, isAlcohol: false },
      { name: 'Malic Acid (grams)', ml: 17, isAlcohol: false },
      { name: 'Water', ml: 944, isAlcohol: false },
      { name: 'Salt (grams)', ml: 10, isAlcohol: false },
      { name: 'Coconut Essence', ml: 12, isAlcohol: false },
      { name: 'Orange Blossom Water', ml: 3, isAlcohol: false }
    ],
    steps: [
      '1. Assembly: Combine all ingredients.',
      'SERVICE: 90ml per drink over ice.'
    ]
  },
  {
    id: 'bts-highball',
    name: 'BTS Highball',
    baseVolume: 8,
    ingredients: [
      { name: 'Patron Reposado 750 ml', ml: 3480, isAlcohol: true },
      { name: 'Martini Bianco 750 ml', ml: 745, isAlcohol: true },
      { name: 'Blue Curaçao 700 ml', ml: 497, isAlcohol: true },
      { name: 'Monin Rose 700 ml', ml: 994, isAlcohol: false },
      { name: 'Citric acid (grams)', ml: 48, isAlcohol: false },
      { name: 'Malic acid (grams)', ml: 24, isAlcohol: false },
      { name: 'Water', ml: 1209, isAlcohol: false },
      { name: 'Salt (grams)', ml: 10, isAlcohol: false },
      { name: 'Hops (grams)', ml: 50, isAlcohol: false },
      { name: 'Grey Goose Vodka 750 ml', ml: 944, isAlcohol: true },
      { name: 'Rose water', ml: 10, isAlcohol: false },
    ],
    steps: [
      '1. Assembly: Combine all ingredients.',
      'SERVICE: ~80ml per drink.'
    ]
  },
  {
    id: 'sunset-at-chao-phraya',
    name: 'Sunset at Chao Phraya',
    baseVolume: 7.5,
    ingredients: [
      { name: 'Earl Grey tea (grams)', ml: 4.3, isAlcohol: false },
      { name: 'Water (for Tea)', ml: 3680, isAlcohol: false },
      { name: 'Peachtree peach liqueur 700 ml', ml: 1140, isAlcohol: true },
      { name: 'St-Germain 700 ml', ml: 610, isAlcohol: true },
      { name: 'Salt (grams)', ml: 8, isAlcohol: false },
      { name: 'Bergamotto Fantastico 700 ml', ml: 2000, isAlcohol: true },
      { name: 'Citric acid (grams)', ml: 40, isAlcohol: false },
      { name: 'Malic acid (grams)', ml: 20, isAlcohol: false },
    ],
    steps: [
      '1. Assembly: Combine all ingredients.',
      'SERVICE: 75ml per drink + 60ml Grapefruit soda top up.'
    ]
  },
  {
    id: 'jodd-fairs-gluttony',
    name: 'Jodd Fairs Gluttony',
    baseVolume: 7.5,
    ingredients: [
      { name: 'Hoxton Gin 700 ml', ml: 2000, isAlcohol: true },
      { name: 'Patrón Reposado 750 ml', ml: 3000, isAlcohol: true },
      { name: 'La Luna Mezcal 750 ml', ml: 600, isAlcohol: true },
      { name: 'Fino Sherry (Tio Pepe) 750 ml', ml: 400, isAlcohol: true },
      { name: 'Sake (Emishiki) 1.5 L', ml: 100, isAlcohol: true },
      { name: 'Pineapple Monin 700 ml', ml: 900, isAlcohol: false },
      { name: 'White soy sauce', ml: 100, isAlcohol: false },
      { name: 'Water', ml: 460, isAlcohol: false },
      { name: 'Citric Acid (grams)', ml: 26, isAlcohol: false },
      { name: 'Malic Acid (grams)', ml: 13, isAlcohol: false },
    ],
    steps: [
      '1. Assembly: Combine all ingredients.',
      'SERVICE: 75ml per drink.'
    ]
  },
  {
    id: 'hotel-lobby-drams',
    name: 'Hotel Lobby Drams',
    baseVolume: 7.5,
    ingredients: [
      { name: 'Butterscotch Monin 700 ml', ml: 520, isAlcohol: false },
      { name: 'Fernet Branca 700 ml', ml: 780, isAlcohol: true },
      { name: 'Palo Cortado Sherry 375 ml', ml: 1030, isAlcohol: true },
      { name: 'Campari Cask Tales 1 L', ml: 520, isAlcohol: true },
      { name: 'Johnnie Walker Gold 750 ml', ml: 4140, isAlcohol: true },
      { name: 'Talisker 10 750 ml', ml: 520, isAlcohol: true },
    ],
    steps: [
      '1. Assembly: Combine all ingredients.',
      'SERVICE: 75ml per drink.'
    ]
  },
  {
    id: 'lost-in-chatuchak',
    name: 'Lost in Chatuchak (Mocktail)',
    baseVolume: 7.5,
    ingredients: [
      { name: 'Guava juice', ml: 5500, isAlcohol: false },
      { name: 'Water', ml: 1249, isAlcohol: false },
      { name: 'Jasmine syrup', ml: 416, isAlcohol: false },
      { name: 'Tamarind syrup', ml: 833, isAlcohol: false },
      { name: 'Citric acid (grams)', ml: 50, isAlcohol: false },
      { name: 'Malic acid (grams)', ml: 25, isAlcohol: false },
    ],
    steps: [
      '1. Assembly: Combine all ingredients.',
      'SERVICE: 75ml per drink.'
    ]
  },
  {
    id: 'temple-run',
    name: 'Temple Run (Mocktail)',
    baseVolume: 12,
    ingredients: [
      { name: 'Mango juice', ml: 8308, isAlcohol: false },
      { name: 'Coconut juice', ml: 5168, isAlcohol: false },
      { name: 'Jasmine rice silpin', ml: 308, isAlcohol: false },
      { name: 'Coconut Monin 700 ml', ml: 308, isAlcohol: false },
      { name: 'Water', ml: 308, isAlcohol: false },
      { name: 'Citric acid (grams)', ml: 12, isAlcohol: false },
      { name: 'Malic acid (grams)', ml: 6, isAlcohol: false },
    ],
    steps: [
      '1. Assembly: Combine all ingredients.',
      'SERVICE: 120ml per drink.'
    ]
  }
];
