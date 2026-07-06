const products = [

  // ═══════════════════════════════
  // SERUMS
  // ═══════════════════════════════
  {
    id: 1,
    name: 'Minimalist 10% Niacinamide + Zinc Serum',
    brand: 'Minimalist',
    category: 'Serum',
    subcategory: 'Brightening',
    price: 599,
    image: '/images/hair_care_serum.png',
    buyLink: 'https://www.nykaa.com/minimalist-10-niacinamide-serum/p/4709890',
    description: 'High-strength niacinamide serum that controls oil, minimises pores and fades dark spots.',
    rating: 4.5,
    reviews: 12400,
    ingredients: [
      { name: 'Niacinamide 10%', benefit: 'Controls sebum, reduces pores, brightens skin', suitableFor: ['oily', 'combination'], avoidFor: [] },
      { name: 'Zinc PCA', benefit: 'Balances oil production, anti-inflammatory', suitableFor: ['oily', 'acne-prone'], avoidFor: [] }
    ],
    suitability: {
      skinTypes: ['oily', 'combination'],
      concerns: ['acne', 'pores', 'pigmentation', 'oiliness', 'dark_spots'],
      humidity: 'high',
      uvIndex: 'any',
      season: ['summer', 'monsoon']
    },
    mamaTip: 'Mix a drop of raw turmeric juice with rose water and apply before this serum — turmeric fights the same bacteria niacinamide targets.',
    weatherReason: 'High humidity increases sebum — niacinamide actively controls this'
  },
  {
    id: 2,
    name: 'Mamaearth Vitamin C Face Serum',
    brand: 'Mamaearth',
    category: 'Serum',
    subcategory: 'Brightening',
    price: 599,
    image: '/images/hair_care_serum.png',
    buyLink: 'https://www.nykaa.com/mamaearth-vitamin-c-face-serum/p/4327099',
    description: 'Vitamin C serum with turmeric that brightens skin, fades dark spots and protects against UV damage.',
    rating: 4.3,
    reviews: 8900,
    ingredients: [
      { name: 'Vitamin C', benefit: 'Brightens skin, fades pigmentation, antioxidant protection', suitableFor: ['all'], avoidFor: [] },
      { name: 'Turmeric', benefit: 'Anti-inflammatory, traditional brightening agent', suitableFor: ['all'], avoidFor: ['sensitive'] }
    ],
    suitability: {
      skinTypes: ['all'],
      concerns: ['pigmentation', 'dark_spots', 'dullness', 'tan', 'uneven_texture'],
      humidity: 'any',
      uvIndex: 'high',
      season: ['all']
    },
    mamaTip: 'Apply fresh orange peel paste on dark spots for 10 minutes before washing — natural Vitamin C that works beautifully with this serum.',
    weatherReason: 'High UV today — Vitamin C neutralises free radical damage from sun exposure'
  },
  {
    id: 3,
    name: 'The Derma Co 2% Salicylic Acid Serum',
    brand: 'The Derma Co',
    category: 'Serum',
    subcategory: 'Acne Control',
    price: 449,
    image: '/images/hair_care_serum.png',
    buyLink: 'https://www.nykaa.com/the-derma-co-2-salicylic-acid-serum/p/4327100',
    description: 'Oil-soluble BHA serum that penetrates pores, clears blackheads and prevents acne breakouts.',
    rating: 4.4,
    reviews: 6700,
    ingredients: [
      { name: 'Salicylic Acid 2%', benefit: 'Unclogs pores, removes blackheads, prevents acne', suitableFor: ['oily', 'combination'], avoidFor: ['dry', 'sensitive'] },
      { name: 'Niacinamide', benefit: 'Soothes inflammation from breakouts', suitableFor: ['oily', 'combination'], avoidFor: [] }
    ],
    suitability: {
      skinTypes: ['oily', 'combination'],
      concerns: ['acne', 'blackheads', 'whiteheads', 'pores', 'oiliness'],
      humidity: 'high',
      uvIndex: 'any',
      season: ['summer', 'monsoon']
    },
    mamaTip: 'Steam your face with neem leaves for 5 minutes before applying — neem opens pores and multiplies salicylic acid\'s effectiveness.',
    weatherReason: 'Humidity causes excess sweat mixing with oil — salicylic acid prevents the clogging this causes'
  },
  {
    id: 4,
    name: 'Dot & Key Watermelon Hyaluronic Serum',
    brand: 'Dot & Key',
    category: 'Serum',
    subcategory: 'Hydration',
    price: 695,
    image: '/images/dot_key_watermelon_serum.png',
    buyLink: 'https://www.nykaa.com/dot-key-watermelon-hyaluronic-serum/p/4327095',
    description: 'Lightweight hydrating serum with watermelon extract and hyaluronic acid for plump, bouncy skin.',
    rating: 4.4,
    reviews: 5400,
    ingredients: [
      { name: 'Hyaluronic Acid', benefit: 'Holds 1000x its weight in water, deep hydration', suitableFor: ['dry', 'normal', 'sensitive'], avoidFor: [] },
      { name: 'Watermelon Extract', benefit: 'Lightweight hydration, cooling effect', suitableFor: ['all'], avoidFor: [] }
    ],
    suitability: {
      skinTypes: ['dry', 'normal', 'sensitive'],
      concerns: ['dryness', 'dullness', 'uneven_texture', 'sensitivity'],
      humidity: 'low',
      uvIndex: 'any',
      season: ['winter', 'autumn']
    },
    mamaTip: 'Apply fresh aloe vera gel on face, let it dry, then apply this serum — aloe locks in additional moisture from within the skin.',
    weatherReason: 'Low humidity pulls moisture from skin — hyaluronic acid creates a protective moisture barrier'
  },
  {
    id: 5,
    name: 'Plum 15% Vitamin C Serum',
    brand: 'Plum',
    category: 'Serum',
    subcategory: 'Brightening',
    price: 895,
    image: '/images/hair_care_serum.png',
    buyLink: 'https://www.nykaa.com/plum-15-vitamin-c-serum/p/4327101',
    description: 'High-potency Vitamin C serum that visibly brightens skin and reduces signs of ageing.',
    rating: 4.5,
    reviews: 7800,
    ingredients: [
      { name: 'Ethyl Ascorbic Acid 15%', benefit: 'Stable Vitamin C, brightens and protects', suitableFor: ['all'], avoidFor: [] },
      { name: 'Alpha Arbutin', benefit: 'Targets melanin production, fades dark spots', suitableFor: ['all'], avoidFor: [] }
    ],
    suitability: {
      skinTypes: ['all'],
      concerns: ['pigmentation', 'dark_spots', 'dullness', 'tan', 'wrinkles', 'sagging'],
      humidity: 'any',
      uvIndex: 'high',
      season: ['all']
    },
    mamaTip: 'Massage your face with 2-3 drops of rosehip oil at night after this serum — rosehip has natural Vitamin C that works synergistically.',
    weatherReason: 'UV index is high — Vitamin C is your best antioxidant shield against sun damage'
  },

  // ═══════════════════════════════
  // MOISTURISERS
  // ═══════════════════════════════
  {
    id: 6,
    name: 'Neutrogena Hydro Boost Water Gel',
    brand: 'Neutrogena',
    category: 'Moisturiser',
    subcategory: 'Gel',
    price: 899,
    image: '/images/dot_key_watermelon_serum.png',
    buyLink: 'https://www.nykaa.com/neutrogena-hydro-boost-water-gel/p/432932',
    description: 'Lightweight water gel moisturiser that hydrates without heaviness — perfect for humid climates.',
    rating: 4.6,
    reviews: 15600,
    ingredients: [
      { name: 'Hyaluronic Acid', benefit: 'Deep hydration without greasiness', suitableFor: ['oily', 'combination', 'normal'], avoidFor: [] },
      { name: 'Glycerin', benefit: 'Draws moisture to skin surface', suitableFor: ['all'], avoidFor: [] }
    ],
    suitability: {
      skinTypes: ['oily', 'combination', 'normal'],
      concerns: ['dullness', 'dryness', 'uneven_texture'],
      humidity: 'high',
      uvIndex: 'any',
      season: ['summer', 'monsoon']
    },
    mamaTip: 'Apply cucumber juice on your face for 5 minutes before moisturising — cucumber has the same water-binding properties as hyaluronic acid.',
    weatherReason: 'Gel texture prevents the heavy, sticky feeling that cream moisturisers cause in humidity'
  },
  {
    id: 7,
    name: 'Cetaphil Moisturising Cream',
    brand: 'Cetaphil',
    category: 'Moisturiser',
    subcategory: 'Cream',
    price: 499,
    image: '/images/dot_key_watermelon_serum.png',
    buyLink: 'https://www.nykaa.com/cetaphil-moisturising-cream/p/432924',
    description: 'Dermatologist-recommended fragrance-free cream for dry and sensitive skin.',
    rating: 4.7,
    reviews: 22000,
    ingredients: [
      { name: 'Petrolatum', benefit: 'Seals moisture in, repairs skin barrier', suitableFor: ['dry', 'sensitive'], avoidFor: ['oily', 'acne-prone'] },
      { name: 'Sweet Almond Oil', benefit: 'Nourishes and softens dry skin', suitableFor: ['dry', 'normal'], avoidFor: [] }
    ],
    suitability: {
      skinTypes: ['dry', 'sensitive', 'normal'],
      concerns: ['dryness', 'sensitivity', 'redness', 'uneven_texture'],
      humidity: 'low',
      uvIndex: 'any',
      season: ['winter', 'autumn']
    },
    mamaTip: 'Apply warm coconut oil on your face for 2 minutes before washing, then use this cream — traditional malai (milk cream) works equally well as a pre-moisturiser.',
    weatherReason: 'Dry weather strips your natural oils — this cream recreates a protective barrier'
  },
  {
    id: 8,
    name: 'Plum Green Tea Mattifying Moisturiser',
    brand: 'Plum',
    category: 'Moisturiser',
    subcategory: 'Gel',
    price: 445,
    image: '/images/dot_key_watermelon_serum.png',
    buyLink: 'https://www.nykaa.com/plum-green-tea-moisturiser/p/432936',
    description: 'Vegan gel moisturiser with green tea that controls oil and keeps skin matte all day.',
    rating: 4.4,
    reviews: 9800,
    ingredients: [
      { name: 'Green Tea Extract', benefit: 'Powerful antioxidant, controls sebum', suitableFor: ['oily', 'combination'], avoidFor: [] },
      { name: 'Glycerin', benefit: 'Lightweight hydration', suitableFor: ['oily', 'combination'], avoidFor: [] }
    ],
    suitability: {
      skinTypes: ['oily', 'combination'],
      concerns: ['oiliness', 'acne', 'pores', 'dullness'],
      humidity: 'high',
      uvIndex: 'any',
      season: ['summer', 'monsoon']
    },
    mamaTip: 'Brew strong green tea, let it cool completely, then use it as a face toner before this moisturiser — the antioxidants stack powerfully.',
    weatherReason: 'Green tea extract keeps sebum in check during hot humid days'
  },
  {
    id: 9,
    name: 'Minimalist Peptide + Matrixyl Moisturiser',
    brand: 'Minimalist',
    category: 'Moisturiser',
    subcategory: 'Anti-ageing',
    price: 699,
    image: '/images/dot_key_watermelon_serum.png',
    buyLink: 'https://www.nykaa.com/minimalist-peptide-moisturiser/p/4709891',
    description: 'Science-backed moisturiser with peptides that visibly firms skin and reduces fine lines.',
    rating: 4.3,
    reviews: 4500,
    ingredients: [
      { name: 'Matrixyl 3000', benefit: 'Stimulates collagen, reduces wrinkles', suitableFor: ['normal', 'dry', 'combination'], avoidFor: [] },
      { name: 'Peptides', benefit: 'Rebuilds skin structure, improves firmness', suitableFor: ['all'], avoidFor: [] }
    ],
    suitability: {
      skinTypes: ['normal', 'dry', 'combination', 'sensitive'],
      concerns: ['wrinkles', 'sagging', 'dullness', 'uneven_texture'],
      humidity: 'any',
      uvIndex: 'any',
      season: ['all']
    },
    mamaTip: 'Massage your face upward with a few drops of pure almond oil before bed — centuries-old Indian practice that stimulates collagen naturally.',
    weatherReason: 'Peptides work in all weather conditions — great for daily anti-ageing protection'
  },
  {
    id: 10,
    name: 'Foxtale Barrier Repair Moisturiser',
    brand: 'Foxtale',
    category: 'Moisturiser',
    subcategory: 'Barrier Repair',
    price: 649,
    image: '/images/dot_key_watermelon_serum.png',
    buyLink: 'https://www.nykaa.com/foxtale-barrier-repair-moisturiser/p/4327101',
    description: 'Ceramide-rich moisturiser that repairs damaged skin barrier and reduces sensitivity.',
    rating: 4.5,
    reviews: 3200,
    ingredients: [
      { name: 'Ceramides', benefit: 'Repairs skin barrier, locks moisture in', suitableFor: ['dry', 'sensitive', 'normal'], avoidFor: [] },
      { name: 'Squalane', benefit: 'Lightweight oil that mimics skin\'s natural sebum', suitableFor: ['all'], avoidFor: [] }
    ],
    suitability: {
      skinTypes: ['dry', 'sensitive', 'normal'],
      concerns: ['dryness', 'sensitivity', 'redness', 'uneven_texture'],
      humidity: 'low',
      uvIndex: 'any',
      season: ['winter', 'autumn']
    },
    mamaTip: 'Apply a thin layer of pure ghee on your face before bed once a week — ghee contains the same fatty acids as ceramides and has been used in Ayurveda for centuries.',
    weatherReason: 'Cold dry weather destroys ceramide bonds — this replenishes them directly'
  },

  // ═══════════════════════════════
  // SUNSCREENS
  // ═══════════════════════════════
  {
    id: 11,
    name: 'Dot & Key Waterlight Sunscreen SPF 50',
    brand: 'Dot & Key',
    category: 'Sunscreen',
    subcategory: 'Lightweight',
    price: 595,
    image: '/images/minimalist_sunscreen.png',
    buyLink: 'https://www.nykaa.com/dot-key-sunscreen/p/4327095',
    description: 'Ultra-light watery sunscreen that feels like nothing on skin — no white cast, no greasiness.',
    rating: 4.6,
    reviews: 18900,
    ingredients: [
      { name: 'Zinc Oxide', benefit: 'Broad spectrum UV protection', suitableFor: ['all'], avoidFor: [] },
      { name: 'Niacinamide', benefit: 'Prevents tanning while protecting', suitableFor: ['all'], avoidFor: [] }
    ],
    suitability: {
      skinTypes: ['all'],
      concerns: ['tan', 'pigmentation', 'dark_spots', 'dullness'],
      humidity: 'any',
      uvIndex: 'high',
      season: ['summer', 'all']
    },
    mamaTip: 'Apply tomato juice on your face for 10 minutes before sunscreen — tomato\'s lycopene is a natural SPF booster used in traditional Indian households.',
    weatherReason: 'UV index is high today — unprotected skin gets tan in as little as 15 minutes outdoors'
  },
  {
    id: 12,
    name: "Re'equil Ultra Matte Dry Touch SPF 50",
    brand: "Re'equil",
    category: 'Sunscreen',
    subcategory: 'Matte',
    price: 625,
    image: '/images/minimalist_sunscreen.png',
    buyLink: 'https://www.nykaa.com/reequil-sunscreen/p/4327098',
    description: 'Matte finish sunscreen gel with dry touch technology — ideal for oily skin in Indian summers.',
    rating: 4.5,
    reviews: 14200,
    ingredients: [
      { name: 'Ethylhexyl Methoxycinnamate', benefit: 'Chemical UV filter, lightweight', suitableFor: ['oily', 'combination'], avoidFor: ['sensitive'] },
      { name: 'Silica', benefit: 'Creates matte finish, absorbs oil', suitableFor: ['oily'], avoidFor: [] }
    ],
    suitability: {
      skinTypes: ['oily', 'combination'],
      concerns: ['tan', 'oiliness', 'pores'],
      humidity: 'high',
      uvIndex: 'high',
      season: ['summer', 'monsoon']
    },
    mamaTip: 'Mix a pinch of sandalwood powder with rose water and apply before sunscreen — sandalwood naturally reduces UV damage and has been used in India for centuries.',
    weatherReason: 'Humidity + oily skin + high UV = triple problem — matte SPF solves all three'
  },
  {
    id: 13,
    name: 'Minimalist SPF 50 Sunscreen',
    brand: 'Minimalist',
    category: 'Sunscreen',
    subcategory: 'Lightweight',
    price: 399,
    image: '/images/minimalist_sunscreen.png',
    buyLink: 'https://www.nykaa.com/minimalist-spf-50/p/4709892',
    description: 'Affordable, no-nonsense sunscreen with clean ingredients and zero white cast.',
    rating: 4.4,
    reviews: 11000,
    ingredients: [
      { name: 'Tinosorb M', benefit: 'Next-gen UV filter, photostable', suitableFor: ['all'], avoidFor: [] },
      { name: 'Glycerin', benefit: 'Hydrates while protecting', suitableFor: ['all'], avoidFor: [] }
    ],
    suitability: {
      skinTypes: ['all'],
      concerns: ['tan', 'pigmentation', 'dark_spots'],
      humidity: 'any',
      uvIndex: 'high',
      season: ['all']
    },
    mamaTip: 'Add 2-3 drops of carrot seed oil to your moisturiser before sunscreen — it has natural SPF properties used in Ayurvedic sun protection.',
    weatherReason: 'Best value SPF for everyday UV protection'
  },
  {
    id: 14,
    name: 'Episoft AC Moisturising Sunscreen SPF 30',
    brand: 'Episoft',
    category: 'Sunscreen',
    subcategory: 'Moisturising',
    price: 445,
    image: '/images/minimalist_sunscreen.png',
    buyLink: 'https://www.nykaa.com/episoft-sunscreen/p/4327096',
    description: 'Dermat-recommended sunscreen with built-in moisturisation for dry and sensitive skin types.',
    rating: 4.3,
    reviews: 5600,
    ingredients: [
      { name: 'Avobenzone', benefit: 'UVA protection, prevents ageing', suitableFor: ['dry', 'sensitive', 'normal'], avoidFor: [] },
      { name: 'Shea Butter', benefit: 'Moisturises while protecting', suitableFor: ['dry', 'sensitive'], avoidFor: ['oily'] }
    ],
    suitability: {
      skinTypes: ['dry', 'sensitive', 'normal'],
      concerns: ['tan', 'dryness', 'sensitivity'],
      humidity: 'low',
      uvIndex: 'high',
      season: ['summer', 'winter']
    },
    mamaTip: 'Mix a tiny amount of aloe vera gel with this sunscreen before applying — aloe provides additional soothing protection for sensitive skin.',
    weatherReason: 'Dry skin needs sun protection that hydrates simultaneously'
  },

  // ═══════════════════════════════
  // CLEANSERS
  // ═══════════════════════════════
  {
    id: 15,
    name: 'Minimalist Salicylic + LHA Cleanser',
    brand: 'Minimalist',
    category: 'Cleanser',
    subcategory: 'Exfoliating',
    price: 349,
    image: '/images/minimalist_cleanser.png',
    buyLink: 'https://www.nykaa.com/minimalist-salicylic-cleanser/p/4709893',
    description: 'BHA-based face wash that gently exfoliates pores and controls excess oil production.',
    rating: 4.5,
    reviews: 8900,
    ingredients: [
      { name: 'Salicylic Acid', benefit: 'Clears pores while cleansing', suitableFor: ['oily', 'combination'], avoidFor: ['dry', 'sensitive'] },
      { name: 'LHA', benefit: 'Gentler BHA, reduces skin cell build-up', suitableFor: ['oily', 'combination'], avoidFor: [] }
    ],
    suitability: {
      skinTypes: ['oily', 'combination'],
      concerns: ['acne', 'blackheads', 'pores', 'oiliness'],
      humidity: 'high',
      uvIndex: 'any',
      season: ['summer', 'monsoon']
    },
    mamaTip: 'Steam your face over a bowl of water with neem leaves for 3 minutes before cleansing — neem is nature\'s most powerful antibacterial and opens pores for deeper cleansing.',
    weatherReason: 'Humidity increases sebum production — a BHA cleanser removes this without over-drying'
  },
  {
    id: 16,
    name: 'Cetaphil Gentle Skin Cleanser',
    brand: 'Cetaphil',
    category: 'Cleanser',
    subcategory: 'Gentle',
    price: 399,
    image: '/images/minimalist_cleanser.png',
    buyLink: 'https://www.nykaa.com/cetaphil-gentle-cleanser/p/432920',
    description: 'The gentlest cleanser on the market — dermatologist recommended for sensitive and dry skin.',
    rating: 4.7,
    reviews: 28000,
    ingredients: [
      { name: 'Glycerin', benefit: 'Cleanses without stripping moisture', suitableFor: ['dry', 'sensitive', 'normal'], avoidFor: [] },
      { name: 'Panthenol', benefit: 'Soothes and repairs skin barrier', suitableFor: ['sensitive', 'dry'], avoidFor: [] }
    ],
    suitability: {
      skinTypes: ['dry', 'sensitive', 'normal'],
      concerns: ['dryness', 'sensitivity', 'redness'],
      humidity: 'any',
      uvIndex: 'any',
      season: ['all']
    },
    mamaTip: 'Mix raw milk with a pinch of turmeric and use as a pre-cleanser for 5 minutes — this dadi nuskha has been cleansing and brightening Indian skin for generations.',
    weatherReason: 'Gentle cleansing preserves your skin barrier regardless of weather'
  },
  {
    id: 17,
    name: 'Foxtale Acne Control Face Wash',
    brand: 'Foxtale',
    category: 'Cleanser',
    subcategory: 'Acne Control',
    price: 349,
    image: '/images/minimalist_cleanser.png',
    buyLink: 'https://www.nykaa.com/foxtale-acne-face-wash/p/4327102',
    description: 'Targeted acne-control face wash with tea tree and niacinamide for clear skin.',
    rating: 4.3,
    reviews: 4200,
    ingredients: [
      { name: 'Tea Tree Oil', benefit: 'Natural antibacterial, kills acne-causing bacteria', suitableFor: ['oily', 'combination'], avoidFor: ['sensitive'] },
      { name: 'Niacinamide', benefit: 'Soothes post-acne redness', suitableFor: ['oily', 'combination'], avoidFor: [] }
    ],
    suitability: {
      skinTypes: ['oily', 'combination'],
      concerns: ['acne', 'oiliness', 'pores', 'blackheads'],
      humidity: 'high',
      uvIndex: 'any',
      season: ['summer', 'monsoon']
    },
    mamaTip: 'Apply neem paste (ground neem leaves) on active pimples for 15 minutes before cleansing — neem has been proven more effective than benzoyl peroxide in some studies.',
    weatherReason: 'Humidity triggers more breakouts — antibacterial cleansing twice daily is essential'
  },
  {
    id: 18,
    name: 'WOW Apple Cider Vinegar Foaming Face Wash',
    brand: 'WOW',
    category: 'Cleanser',
    subcategory: 'Brightening',
    price: 299,
    image: '/images/minimalist_cleanser.png',
    buyLink: 'https://www.nykaa.com/wow-acv-face-wash/p/4327103',
    description: 'Apple cider vinegar face wash that balances skin pH and removes impurities gently.',
    rating: 4.2,
    reviews: 11200,
    ingredients: [
      { name: 'Apple Cider Vinegar', benefit: 'Balances pH, mild exfoliation', suitableFor: ['oily', 'combination', 'normal'], avoidFor: ['sensitive', 'dry'] },
      { name: 'Aloe Vera', benefit: 'Soothes while cleansing', suitableFor: ['all'], avoidFor: [] }
    ],
    suitability: {
      skinTypes: ['oily', 'combination', 'normal'],
      concerns: ['dullness', 'oiliness', 'uneven_texture', 'tan'],
      humidity: 'any',
      uvIndex: 'any',
      season: ['all']
    },
    mamaTip: 'Dilute 1 teaspoon of apple cider vinegar in half cup water and use as a toner after cleansing — the same active ingredient in a traditional kitchen remedy.',
    weatherReason: 'Balanced pH helps skin handle weather changes better'
  },

  // ═══════════════════════════════
  // FACE MASKS
  // ═══════════════════════════════
  {
    id: 19,
    name: 'Mamaearth Ubtan Face Mask',
    brand: 'Mamaearth',
    category: 'Mask',
    subcategory: 'Brightening',
    price: 349,
    image: '/images/dot_key_watermelon_serum.png',
    buyLink: 'https://www.nykaa.com/mamaearth-ubtan-mask/p/4327103',
    description: 'Traditional ubtan-inspired mask with turmeric and saffron for instant brightening and de-tan.',
    rating: 4.4,
    reviews: 16700,
    ingredients: [
      { name: 'Turmeric', benefit: 'Brightens, anti-inflammatory, de-tan', suitableFor: ['all'], avoidFor: ['sensitive'] },
      { name: 'Saffron', benefit: 'Luxury brightening agent, evens skin tone', suitableFor: ['all'], avoidFor: [] }
    ],
    suitability: {
      skinTypes: ['all'],
      concerns: ['tan', 'dullness', 'pigmentation', 'uneven_texture'],
      humidity: 'any',
      uvIndex: 'high',
      season: ['summer', 'all']
    },
    mamaTip: 'Mix besan (gram flour) + turmeric + raw milk + a few drops of lemon juice — this is the original ubtan recipe used in Indian households for thousands of years. Use 3x weekly.',
    weatherReason: 'High UV exposure means accumulated tan — ubtan reverses it naturally'
  },
  {
    id: 20,
    name: 'Plum Kaolin Clay Face Mask',
    brand: 'Plum',
    category: 'Mask',
    subcategory: 'Oil Control',
    price: 395,
    image: '/images/dot_key_watermelon_serum.png',
    buyLink: 'https://www.nykaa.com/plum-clay-mask/p/4327104',
    description: 'Kaolin and bentonite clay mask that draws out impurities and minimises pores visibly.',
    rating: 4.3,
    reviews: 6800,
    ingredients: [
      { name: 'Kaolin Clay', benefit: 'Gently absorbs oil without over-drying', suitableFor: ['oily', 'combination'], avoidFor: ['dry'] },
      { name: 'Bentonite', benefit: 'Deep pore cleansing, detoxifying', suitableFor: ['oily'], avoidFor: ['dry', 'sensitive'] }
    ],
    suitability: {
      skinTypes: ['oily', 'combination'],
      concerns: ['pores', 'oiliness', 'blackheads', 'acne'],
      humidity: 'high',
      uvIndex: 'any',
      season: ['summer', 'monsoon']
    },
    mamaTip: 'Mix multani mitti (Fuller\'s Earth) with rose water and apply for 15 minutes — India\'s original clay mask used for centuries, with the same pore-minimising properties.',
    weatherReason: 'Humidity enlarges pores — weekly clay masking keeps them visibly smaller'
  },
  {
    id: 21,
    name: 'The Derma Co AHA BHA Face Mask',
    brand: 'The Derma Co',
    category: 'Mask',
    subcategory: 'Exfoliating',
    price: 449,
    image: '/images/dot_key_watermelon_serum.png',
    buyLink: 'https://www.nykaa.com/derma-co-aha-bha-mask/p/4327105',
    description: 'Chemical exfoliant mask with AHAs and BHAs that resurfaces skin and fades dark spots.',
    rating: 4.2,
    reviews: 4100,
    ingredients: [
      { name: 'Glycolic Acid (AHA)', benefit: 'Resurfaces skin, fades dark spots', suitableFor: ['normal', 'combination'], avoidFor: ['sensitive', 'dry'] },
      { name: 'Salicylic Acid (BHA)', benefit: 'Clears pores, prevents breakouts', suitableFor: ['oily', 'combination'], avoidFor: ['dry', 'sensitive'] }
    ],
    suitability: {
      skinTypes: ['normal', 'combination', 'oily'],
      concerns: ['dark_spots', 'uneven_texture', 'dullness', 'acne', 'pores'],
      humidity: 'any',
      uvIndex: 'low',
      season: ['winter', 'autumn']
    },
    mamaTip: 'Mix papaya pulp with a few drops of honey and apply as a mask — papain enzyme in papaya is a natural AHA that Indian grandmothers have used for generations.',
    weatherReason: 'Best used on lower UV days — acids increase sun sensitivity'
  },

  // ═══════════════════════════════
  // TONERS
  // ═══════════════════════════════
  {
    id: 22,
    name: 'Plum Green Tea Alcohol-Free Toner',
    brand: 'Plum',
    category: 'Toner',
    subcategory: 'Balancing',
    price: 345,
    image: '/images/minimalist_cleanser.png',
    buyLink: 'https://www.nykaa.com/plum-green-tea-toner/p/4327106',
    description: 'Alcohol-free toner with green tea that balances skin pH and tightens pores after cleansing.',
    rating: 4.4,
    reviews: 13400,
    ingredients: [
      { name: 'Green Tea Extract', benefit: 'Antioxidant protection, oil control', suitableFor: ['oily', 'combination'], avoidFor: [] },
      { name: 'Witch Hazel', benefit: 'Natural astringent, minimises pores', suitableFor: ['oily', 'combination'], avoidFor: ['dry', 'sensitive'] }
    ],
    suitability: {
      skinTypes: ['oily', 'combination'],
      concerns: ['pores', 'oiliness', 'acne', 'dullness'],
      humidity: 'high',
      uvIndex: 'any',
      season: ['summer', 'monsoon']
    },
    mamaTip: 'Brew green tea, cool it completely, add 2 drops of rose water and use as your daily toner — this kitchen toner does exactly what this product does for ₹5.',
    weatherReason: 'A toner after cleansing in humid weather removes the residue humidity leaves on skin'
  },
  {
    id: 23,
    name: 'Deconstruct Exfoliating Toner',
    brand: 'Deconstruct',
    category: 'Toner',
    subcategory: 'Exfoliating',
    price: 449,
    image: '/images/minimalist_cleanser.png',
    buyLink: 'https://www.nykaa.com/deconstruct-exfoliating-toner/p/4327107',
    description: 'Mild AHA/BHA toner that gently exfoliates and brightens between wash days.',
    rating: 4.3,
    reviews: 5600,
    ingredients: [
      { name: 'Mandelic Acid', benefit: 'Gentle AHA, safe for Indian skin tones', suitableFor: ['normal', 'sensitive', 'combination'], avoidFor: [] },
      { name: 'PHAs', benefit: 'Humectant exfoliant, gentler than AHAs', suitableFor: ['sensitive', 'dry'], avoidFor: [] }
    ],
    suitability: {
      skinTypes: ['normal', 'sensitive', 'combination', 'dry'],
      concerns: ['dullness', 'uneven_texture', 'dark_spots', 'pigmentation'],
      humidity: 'any',
      uvIndex: 'any',
      season: ['all']
    },
    mamaTip: 'Rice water (soak rice for 30 minutes, strain) used as a toner has been used across India and Asia for centuries — it contains ferulic acid, a natural exfoliant.',
    weatherReason: 'Regular gentle exfoliation keeps skin clear regardless of season'
  },

  // ═══════════════════════════════
  // EYE CARE
  // ═══════════════════════════════
  {
    id: 24,
    name: 'Mamaearth Bye Bye Dark Circles Eye Cream',
    brand: 'Mamaearth',
    category: 'Eye Care',
    subcategory: 'Dark Circles',
    price: 449,
    image: '/images/hair_care_serum.png',
    buyLink: 'https://www.nykaa.com/mamaearth-eye-cream/p/4327108',
    description: 'Eye cream with coffee and vitamin C that reduces dark circles and puffiness.',
    rating: 4.2,
    reviews: 7800,
    ingredients: [
      { name: 'Caffeine', benefit: 'Constricts blood vessels, reduces puffiness', suitableFor: ['all'], avoidFor: [] },
      { name: 'Vitamin C', benefit: 'Brightens dark circles', suitableFor: ['all'], avoidFor: [] }
    ],
    suitability: {
      skinTypes: ['all'],
      concerns: ['dark_circles', 'puffy_eyes'],
      humidity: 'any',
      uvIndex: 'any',
      season: ['all']
    },
    mamaTip: 'Place cold raw potato slices on eyes for 15 minutes — potato catecholase enzyme has been scientifically proven to lighten dark circles, exactly as our grandmothers taught.',
    weatherReason: 'Dark circles worsen with dehydration in any weather — treat them daily'
  },
  {
    id: 25,
    name: 'Dot & Key Peptide Eye Serum',
    brand: 'Dot & Key',
    category: 'Eye Care',
    subcategory: 'Anti-ageing',
    price: 795,
    image: '/images/hair_care_serum.png',
    buyLink: 'https://www.nykaa.com/dot-key-eye-serum/p/4327109',
    description: 'Peptide-rich eye serum that reduces fine lines and crow\'s feet around the eye area.',
    rating: 4.3,
    reviews: 3400,
    ingredients: [
      { name: 'Argireline', benefit: 'Relaxes expression lines, botox-like peptide', suitableFor: ['all'], avoidFor: [] },
      { name: 'Retinol', benefit: 'Increases cell turnover, reduces wrinkles', suitableFor: ['normal', 'combination'], avoidFor: ['sensitive'] }
    ],
    suitability: {
      skinTypes: ['all'],
      concerns: ['wrinkles', 'dark_circles', 'sagging', 'puffy_eyes'],
      humidity: 'any',
      uvIndex: 'any',
      season: ['all']
    },
    mamaTip: 'Massage the under-eye area with cold almond oil every night using your ring finger — almond oil\'s Vitamin E reduces dark circles and the cold temperature reduces puffiness.',
    weatherReason: 'Eye area skin is 10x thinner — needs dedicated care regardless of weather'
  },

  // ═══════════════════════════════
  // LIP CARE
  // ═══════════════════════════════
  {
    id: 26,
    name: 'Plum Butter Believe It Lip Balm',
    brand: 'Plum',
    category: 'Lip Care',
    subcategory: 'Hydrating',
    price: 195,
    image: '/images/lip_care_balm.png',
    buyLink: 'https://www.nykaa.com/plum-lip-balm/p/4327110',
    description: 'Rich buttery lip balm with shea and cocoa butter that repairs extremely chapped lips.',
    rating: 4.6,
    reviews: 19800,
    ingredients: [
      { name: 'Shea Butter', benefit: 'Deep moisturisation, repairs chapped lips', suitableFor: ['all'], avoidFor: [] },
      { name: 'Vitamin E', benefit: 'Heals cracks, antioxidant protection', suitableFor: ['all'], avoidFor: [] }
    ],
    suitability: {
      skinTypes: ['all'],
      concerns: ['dryness'],
      humidity: 'low',
      uvIndex: 'any',
      season: ['winter', 'all']
    },
    mamaTip: 'Apply desi ghee on lips every night before sleeping — this centuries-old nuskha heals chapped lips in 3 nights and costs almost nothing.',
    weatherReason: 'Dry weather and UV rays both damage lip skin — protect daily'
  },
  {
    id: 27,
    name: 'Minimalist SPF 50 Lip Balm',
    brand: 'Minimalist',
    category: 'Lip Care',
    subcategory: 'SPF',
    price: 249,
    image: '/images/lip_care_balm.png',
    buyLink: 'https://www.nykaa.com/minimalist-lip-spf/p/4709894',
    description: 'SPF 50 lip protection that prevents darkening and UV damage on lips.',
    rating: 4.3,
    reviews: 4500,
    ingredients: [
      { name: 'Titanium Dioxide', benefit: 'Sun protection for delicate lip skin', suitableFor: ['all'], avoidFor: [] },
      { name: 'Castor Oil', benefit: 'Locks moisture in lip skin', suitableFor: ['all'], avoidFor: [] }
    ],
    suitability: {
      skinTypes: ['all'],
      concerns: ['tan', 'dryness', 'pigmentation'],
      humidity: 'any',
      uvIndex: 'high',
      season: ['summer', 'all']
    },
    mamaTip: 'Apply beetroot juice on lips daily for natural tinting and UV protection — beetroot\'s betalains act as a natural pigment shield.',
    weatherReason: 'High UV darkens lips faster than you think — SPF lip care is often forgotten'
  },

  // ═══════════════════════════════
  // BODY CARE
  // ═══════════════════════════════
  {
    id: 28,
    name: 'Mamaearth Ubtan Body Lotion',
    brand: 'Mamaearth',
    category: 'Body Care',
    subcategory: 'Brightening',
    price: 399,
    image: '/images/shampoo_bottle.png',
    buyLink: 'https://www.nykaa.com/mamaearth-body-lotion/p/4327111',
    description: 'Ubtan-enriched body lotion that brightens skin and reduces body tan naturally.',
    rating: 4.3,
    reviews: 8900,
    ingredients: [
      { name: 'Turmeric', benefit: 'Brightens body skin, reduces tan', suitableFor: ['all'], avoidFor: [] },
      { name: 'Saffron', benefit: 'Evens skin tone, natural glow', suitableFor: ['all'], avoidFor: [] }
    ],
    suitability: {
      skinTypes: ['all'],
      concerns: ['tan', 'dullness', 'dryness'],
      humidity: 'any',
      uvIndex: 'high',
      season: ['summer', 'all']
    },
    mamaTip: 'Before showering, apply a mix of besan + turmeric + curd on your body and scrub gently — traditional full-body ubtan removes tan and brings glow better than any commercial scrub.',
    weatherReason: 'Body skin gets tanned faster than face — treat it with the same care'
  },
  {
    id: 29,
    name: 'Plum BodyLovin Vanilla Shea Body Butter',
    brand: 'Plum',
    category: 'Body Care',
    subcategory: 'Moisturising',
    price: 595,
    image: '/images/shampoo_bottle.png',
    buyLink: 'https://www.nykaa.com/plum-body-butter/p/4327112',
    description: 'Rich shea body butter that melts into skin and provides 48-hour moisture lock.',
    rating: 4.5,
    reviews: 12300,
    ingredients: [
      { name: 'Shea Butter', benefit: 'Deep moisturisation, repairs cracked skin', suitableFor: ['dry', 'normal'], avoidFor: ['oily'] },
      { name: 'Cocoa Butter', benefit: 'Creates moisture barrier, improves elasticity', suitableFor: ['dry', 'normal'], avoidFor: ['oily'] }
    ],
    suitability: {
      skinTypes: ['dry', 'normal', 'sensitive'],
      concerns: ['dryness', 'uneven_texture'],
      humidity: 'low',
      uvIndex: 'any',
      season: ['winter', 'autumn']
    },
    mamaTip: 'Massage warm coconut oil on your body after bath for 5 minutes before drying — traditional Indian abhyanga (oil massage) that has been moisturising Indian skin for 5000 years.',
    weatherReason: 'Winter air pulls moisture from body skin fast — lock it in with a butter'
  },
  {
    id: 30,
    name: 'WOW Skin Science Aloe Vera Body Lotion',
    brand: 'WOW',
    category: 'Body Care',
    subcategory: 'Lightweight',
    price: 349,
    image: '/images/shampoo_bottle.png',
    buyLink: 'https://www.nykaa.com/wow-aloe-body-lotion/p/4327113',
    description: 'Lightweight aloe-based body lotion that hydrates without stickiness in hot weather.',
    rating: 4.2,
    reviews: 9400,
    ingredients: [
      { name: 'Aloe Vera', benefit: 'Lightweight hydration, cooling effect', suitableFor: ['all'], avoidFor: [] },
      { name: 'Vitamin E', benefit: 'Antioxidant protection, skin repair', suitableFor: ['all'], avoidFor: [] }
    ],
    suitability: {
      skinTypes: ['oily', 'combination', 'normal'],
      concerns: ['dullness', 'tan', 'dryness'],
      humidity: 'high',
      uvIndex: 'any',
      season: ['summer', 'monsoon']
    },
    mamaTip: 'Cut fresh aloe vera from a plant, scoop the gel and apply directly on body skin — 100% pure, no preservatives, and the most effective version of what this lotion contains.',
    weatherReason: 'Humid weather needs a lightweight lotion — heavy creams feel suffocating'
  },
  {
    id: 36,
    name: 'mCaffeine Naked & Raw Coffee Body Scrub',
    brand: 'mCaffeine',
    category: 'Body Care',
    subcategory: 'Exfoliating',
    price: 449,
    image: '/images/shampoo_bottle.png',
    buyLink: 'https://www.nykaa.com/mcaffeine-naked-raw-coffee-body-scrub/p/310383',
    description: 'Polishing coffee scrub that exfoliates dead skin, reduces cellulite, and prevents ingrown hair.',
    rating: 4.6,
    reviews: 18200,
    ingredients: [
      { name: 'Pure Arabica Coffee', benefit: 'Exfoliates, improves blood circulation, removes tan', suitableFor: ['all'], avoidFor: ['sensitive'] },
      { name: 'Coconut Oil', benefit: 'Deeply hydrates and nourishes skin post-scrub', suitableFor: ['all'], avoidFor: [] }
    ],
    suitability: {
      skinTypes: ['all'],
      concerns: ['tan', 'strawberry_legs', 'dryness_roughness', 'ingrown_hair'],
      humidity: 'any',
      uvIndex: 'any',
      season: ['all']
    },
    mamaTip: 'Mix coffee powder with sugar and coconut oil at home — it matches commercial body scrubs and is highly effective at smoothing strawberry skin.',
    weatherReason: 'Sweat and UV cause accumulated dead skin — weekly exfoliating keeps skin smooth'
  },
  {
    id: 37,
    name: 'Be Bodywise 1% Salicylic Acid Body Wash',
    brand: 'Be Bodywise',
    category: 'Body Care',
    subcategory: 'Acne Control',
    price: 349,
    image: '/images/shampoo_bottle.png',
    buyLink: 'https://www.nykaa.com/be-bodywise-1percent-salicylic-acid-body-wash/p/5211993',
    description: 'Antibacterial body wash that cleanses pores, cures bacne, and smooths strawberry legs.',
    rating: 4.4,
    reviews: 9800,
    ingredients: [
      { name: 'Salicylic Acid 1%', benefit: 'Penetrates pores, exfoliates sebum, cures body acne', suitableFor: ['all'], avoidFor: [] },
      { name: 'Chamomile Extract', benefit: 'Soothes inflammation and calms irritated skin', suitableFor: ['all'], avoidFor: [] }
    ],
    suitability: {
      skinTypes: ['all'],
      concerns: ['body_acne', 'strawberry_legs', 'uneven_texture'],
      humidity: 'high',
      uvIndex: 'any',
      season: ['summer', 'monsoon']
    },
    mamaTip: 'Steam for 5 minutes during bath before using this wash — open pores let salicylic acid dissolve trapped oils and keratin plug much faster.',
    weatherReason: 'Humid conditions lead to chest and back acne — salicylic body wash clears pores'
  },

  // ═══════════════════════════════
  // HAIR CARE
  // ═══════════════════════════════
  {
    id: 31,
    name: 'Mamaearth Onion Hair Oil',
    brand: 'Mamaearth',
    category: 'Hair Care',
    subcategory: 'Hair Fall',
    price: 349,
    image: '/images/hair_care_serum.png',
    buyLink: 'https://www.nykaa.com/mamaearth-onion-hair-oil/p/4327114',
    description: 'Onion oil enriched with 14 oils that reduces hair fall and promotes new hair growth.',
    rating: 4.3,
    reviews: 34000,
    ingredients: [
      { name: 'Onion Extract', benefit: 'Rich in sulphur, stimulates hair follicles', suitableFor: ['all hair types'], avoidFor: [] },
      { name: 'Redensyl', benefit: 'Clinically proven hair growth activator', suitableFor: ['all hair types'], avoidFor: [] }
    ],
    suitability: {
      skinTypes: ['all'],
      concerns: ['hair_fall', 'hair_loss', 'dandruff'],
      humidity: 'any',
      uvIndex: 'any',
      season: ['all']
    },
    mamaTip: 'Warm pure onion juice, apply to scalp and leave for 30 minutes before washing — Dadi\'s original recipe that clinically matches onion extract products in effectiveness.',
    weatherReason: 'Monsoon and humidity weaken hair roots — regular oil massage strengthens them'
  },
  {
    id: 32,
    name: 'WOW Apple Cider Vinegar Shampoo',
    brand: 'WOW',
    category: 'Hair Care',
    subcategory: 'Scalp Care',
    price: 399,
    image: '/images/shampoo_bottle.png',
    buyLink: 'https://www.nykaa.com/wow-acv-shampoo/p/4327115',
    description: 'Sulphate-free shampoo with ACV that clarifies scalp, controls dandruff and adds shine.',
    rating: 4.3,
    reviews: 22000,
    ingredients: [
      { name: 'Apple Cider Vinegar', benefit: 'Balances scalp pH, removes product buildup', suitableFor: ['all hair types'], avoidFor: [] },
      { name: 'Argan Oil', benefit: 'Adds shine, reduces frizz', suitableFor: ['dry', 'frizzy hair'], avoidFor: [] }
    ],
    suitability: {
      skinTypes: ['all'],
      concerns: ['dandruff', 'frizzy_hair', 'hair_fall', 'oily_scalp'],
      humidity: 'high',
      uvIndex: 'any',
      season: ['monsoon', 'summer']
    },
    mamaTip: 'Final rinse with diluted ACV (1:8 ratio with water) after shampooing — this kitchen staple closes hair cuticles and adds shine exactly as expensive hair glossing treatments do.',
    weatherReason: 'Humidity causes scalp sweat and product buildup — clarifying shampoo once weekly essential'
  },
  {
    id: 33,
    name: 'Plum Olive & Macadamia Frizz-Control Conditioner',
    brand: 'Plum',
    category: 'Hair Care',
    subcategory: 'Frizz Control',
    price: 445,
    image: '/images/shampoo_bottle.png',
    buyLink: 'https://www.nykaa.com/plum-conditioner/p/4327116',
    description: 'Rich conditioner with olive and macadamia oils that tames frizz in humid weather.',
    rating: 4.4,
    reviews: 8900,
    ingredients: [
      { name: 'Macadamia Oil', benefit: 'Penetrates hair shaft, eliminates frizz', suitableFor: ['frizzy', 'dry hair'], avoidFor: [] },
      { name: 'Olive Oil', benefit: 'Deep conditioning, adds gloss', suitableFor: ['dry', 'damaged hair'], avoidFor: ['oily scalp'] }
    ],
    suitability: {
      skinTypes: ['all'],
      concerns: ['frizzy_hair', 'dry_hair', 'hair_damage'],
      humidity: 'high',
      uvIndex: 'any',
      season: ['monsoon', 'summer']
    },
    mamaTip: 'Apply a mixture of curd + honey on hair for 30 minutes before washing — curd proteins coat each strand reducing frizz naturally, exactly as silicones in conditioners do.',
    weatherReason: 'High humidity opens hair cuticles causing frizz — conditioner seals them shut'
  },
  {
    id: 34,
    name: 'Minimalist 18-MEA Hair Serum',
    brand: 'Minimalist',
    category: 'Hair Care',
    subcategory: 'Shine & Repair',
    price: 599,
    image: '/images/hair_care_serum.png',
    buyLink: 'https://www.nykaa.com/minimalist-hair-serum/p/4709895',
    description: 'Science-backed hair serum with 18-MEA that repairs damaged hair cuticles and adds mirror shine.',
    rating: 4.5,
    reviews: 6700,
    ingredients: [
      { name: '18-MEA', benefit: 'Mimics natural hair lipid, repairs damage', suitableFor: ['all hair types'], avoidFor: [] },
      { name: 'Ceramides', benefit: 'Rebuilds hair cuticle structure', suitableFor: ['damaged hair'], avoidFor: [] }
    ],
    suitability: {
      skinTypes: ['all'],
      concerns: ['hair_damage', 'frizzy_hair', 'dry_hair'],
      humidity: 'any',
      uvIndex: 'any',
      season: ['all']
    },
    mamaTip: 'Apply warm hibiscus oil on hair tips overnight weekly — hibiscus has been used in South Indian hair care for centuries and contains natural ceramides.',
    weatherReason: 'Damaged hair reacts worse to weather changes — repair the cuticle first'
  },
  {
    id: 35,
    name: 'Dove Intense Repair Shampoo',
    brand: 'Dove',
    category: 'Hair Care',
    subcategory: 'Repair',
    price: 249,
    image: '/images/shampoo_bottle.png',
    buyLink: 'https://www.nykaa.com/dove-intense-repair-shampoo/p/4327117',
    description: 'Keratin actives shampoo that repairs damaged hair from within and prevents breakage.',
    rating: 4.3,
    reviews: 45000,
    ingredients: [
      { name: 'Keratin', benefit: 'Fills gaps in hair cuticle, reduces breakage', suitableFor: ['damaged hair'], avoidFor: [] },
      { name: 'Fiber Actives', benefit: 'Strengthens hair strand from root to tip', suitableFor: ['weak hair'], avoidFor: [] }
    ],
    suitability: {
      skinTypes: ['all'],
      concerns: ['hair_damage', 'hair_fall', 'dry_hair'],
      humidity: 'any',
      uvIndex: 'any',
      season: ['all']
    },
    mamaTip: 'Apply egg white on hair for 20 minutes before shampooing — egg white proteins are natural keratin that strengthen and repair hair exactly as this shampoo does.',
    weatherReason: 'Monsoon humidity weakens hair structure — protein treatment prevents breakage'
  }
]

module.exports = products