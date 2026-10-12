/* ═══════════════════════════════════════════════════════════
   MALIK — shared content data (residences, imagery, pricing rules)
   Single source of truth used by residences / property / booking / pricing
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var API = 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=';
  var LOCAL = {
    "Breathtaking%20ultra%20luxury%20modern%20coastal%20villa%20with%20cantilevered%20white%20stone%20terraces%20and%20infinity%20pool%20merging%20with%20turquoise%20ocean%2C%20distant%20mountain%20coastline%2C%20soft%20golden%20sunrise%20light%2C%20calm%20water%2C%20editorial%20architectural%20photography%2C%20serene%2C%20cinematic%2C%20hyperrealistic%2C%20premium%20real%20estate&image_size=landscape_16_9": 'assets/img/photos/hero-villa.webp',
    "Interior%20of%20ultra%20luxury%20modern%20glass%20mansion%2C%20double%20height%20floor%20to%20ceiling%20windows%2C%20elegant%20white%20designer%20sofas%2C%20polished%20travertine%20floor%2C%20infinity%20pool%20and%20tall%20pine%20trees%20outside%2C%20soft%20daylight%2C%20architectural%20digest%2C%20photorealistic&image_size=landscape_16_9": 'assets/img/photos/living.webp',
    "Ultra%20luxury%20modern%20white%20villa%20terrace%20with%20infinity%20pool%20overlooking%20the%20ocean%20at%20blue%20hour%2C%20sculptural%20loungers%2C%20warm%20interior%20glow%2C%20cinematic%20architectural%20photography%2C%20photorealistic&image_size=landscape_16_9": 'assets/img/photos/terrace.webp',
    "Ultra%20luxury%20minimal%20bedroom%20suite%20with%20floor%20to%20ceiling%20glass%20walls%20facing%20the%20sea%2C%20linen%20bedding%2C%20oak%20and%20travertine%2C%20soft%20morning%20light%2C%20premium%20interior%20photography%2C%20photorealistic&image_size=landscape_16_9": 'assets/img/photos/bedroom.webp',
    "Aerial%20view%20of%20ultra%20luxury%20modern%20white%20villa%20with%20infinity%20pool%20surrounded%20by%20misty%20green%20mountain%20forest%2C%20dramatic%20minimalist%20architecture%2C%20photorealistic%20editorial%20photography&image_size=portrait_4_3": 'assets/img/photos/mountain.webp',
    "Luxury%20modern%20lakeside%20residence%20with%20glass%20walls%2C%20heated%20infinity%20pool%2C%20tall%20cypress%20trees%2C%20calm%20lake%20reflections%20at%20golden%20hour%2C%20photorealistic%20architectural%20photography&image_size=portrait_4_3": 'assets/img/photos/lakeside.webp',
    "Interior%20of%20luxury%20coastal%20villa%2C%20double%20height%20glass%20living%20room%20opening%20to%20sea%20view%20terrace%2C%20elegant%20minimal%20cream%20furniture%2C%20soft%20daylight%2C%20photorealistic&image_size=portrait_4_3": 'assets/img/photos/coast-interior.webp',
    "Infinity%20swimming%20pool%20of%20ultra%20luxury%20villa%20at%20sunset%2C%20teak%20loungers%2C%20ocean%20horizon%2C%20cinematic%20warm%20golden%20light%2C%20photorealistic&image_size=landscape_4_3": 'assets/img/photos/pool.webp',
    "Ultra%20luxury%20private%20spa%20interior%20in%20cream%20marble%20and%20stone%2C%20candles%2C%20soft%20steam%2C%20brushed%20gold%20brass%20details%2C%20serene%20moody%20light%2C%20photorealistic&image_size=landscape_4_3": 'assets/img/photos/spa.webp',
    "Luxury%20private%20home%20cinema%20room%20with%20dark%20velvet%20loungers%2C%20warm%20ambient%20light%2C%20acoustic%20wood%20wall%20panels%2C%20premium%20interior%20photography%2C%20photorealistic&image_size=landscape_4_3": 'assets/img/photos/cinema.webp',
    "Luxury%20residential%20fitness%20studio%20with%20floor%20to%20ceiling%20windows%20overlooking%20tropical%20gardens%2C%20polished%20stone%20floors%2C%20premium%20equipment%2C%20soft%20daylight%2C%20photorealistic&image_size=landscape_4_3": 'assets/img/photos/fitness.webp',
    "Private%20fine%20dining%20room%20in%20ultra%20luxury%20modern%20mansion%2C%20marble%20chef%20table%20set%20for%20eight%2C%20candlelight%2C%20glass%20wine%20cellar%20wall%2C%20moody%20cinematic%20golden%20atmosphere%2C%20photorealistic&image_size=landscape_4_3": 'assets/img/photos/wine.webp',
    "Interior%20of%20luxury%20coastal%20villa%2C%20double%20height%20glass%20living%20room%20opening%20to%20sea%20view%20terrace%2C%20elegant%20minimal%20cream%20furniture%2C%20soft%20daylight%2C%20photorealistic&image_size=landscape_4_3": 'assets/img/photos/lounge.webp',
    "Private%20fine%20dining%20room%20in%20ultra%20luxury%20modern%20mansion%2C%20marble%20chef%20table%20set%20for%20eight%2C%20candlelight%2C%20glass%20wine%20cellar%20wall%2C%20moody%20cinematic%20golden%20atmosphere%2C%20photorealistic&image_size=landscape_16_9": 'assets/img/photos/dining.webp',
    "Aerial%20dusk%20view%20of%20glamorous%20coastal%20city%20peninsula%20with%20marina%20bay%2C%20golden%20city%20lights%2C%20luxury%20hillside%20homes%20along%20the%20coast%2C%20cinematic%2C%20photorealistic&image_size=landscape_4_3": 'assets/img/photos/aerial.webp',
    "Architectural%20detail%20of%20luxury%20building%20facade%2C%20fluted%20travertine%20columns%2C%20warm%20sunlight%20and%20shadow%2C%20brushed%20brass%20gold%20accents%2C%20minimal%20editorial%20photography&image_size=portrait_4_3": 'assets/img/photos/travertine.webp',
    "Ultra%20luxury%20villa%20terrace%20at%20twilight%20with%20warm%20glowing%20interiors%20overlooking%20infinity%20pool%20and%20calm%20sea%2C%20first%20stars%20in%20sky%2C%20cinematic%20atmospheric%2C%20photorealistic&image_size=landscape_16_9": 'assets/img/photos/twilight.webp',
    "Ultra%20luxury%20glass%20pavilion%20villa%20perched%20above%20a%20turquoise%20cove%2C%20cantilevered%20terrace%20with%20heated%20plunge%20pool%2C%20white%20stone%2C%20dramatic%20ocean%20cliffs%2C%20golden%20afternoon%20light%2C%20editorial%20architectural%20photography%2C%20photorealistic&image_size=landscape_4_3": 'assets/img/photos/ocean-pavilion.webp',
    "Ultra%20luxury%20rooftop%20penthouse%20terrace%20with%20private%20plunge%20pool%20overlooking%20a%20glittering%20marina%20and%20open%20sea%20at%20dusk%2C%20designer%20outdoor%20lounge%2C%20fire%20pit%2C%20cinematic%20skyline%2C%20photorealistic%20editorial&image_size=landscape_4_3": 'assets/img/photos/sky-penthouse.webp',
    "Ultra%20luxury%20tropical%20garden%20villa%20with%20lush%20private%20courtyard%2C%20turquoise%20pool%20surrounded%20by%20palms%20and%20sculptural%20white%20stone%20architecture%2C%20bright%20sunny%20day%2C%20photorealistic%20editorial&image_size=landscape_4_3": 'assets/img/photos/garden-estate.webp',
    "Minimal%20luxury%20two%20bedroom%20cliff%20house%20in%20dark%20timber%20and%20glass%2C%20cantilevered%20deck%20over%20wild%20ocean%20rocks%2C%20moody%20sky%2C%20warm%20interior%20glow%2C%20cinematic%20architectural%20photography%2C%20photorealistic&image_size=landscape_4_3": 'assets/img/photos/cliff-house.webp',
    "Ultra%20luxury%20private%20spa%20interior%20in%20cream%20marble%20and%20stone%2C%20candles%2C%20soft%20steam%2C%20brushed%20gold%20brass%20details%2C%20serene%20moody%20light%2C%20photorealistic&image_size=landscape_16_9": 'assets/img/photos/ultra-luxury-private-spa-interior-in-cream.webp',
    "Ultra%20luxury%20modern%20white%20villa%20terrace%20with%20infinity%20pool%20overlooking%20the%20ocean%20at%20blue%20hour%2C%20sculptural%20loungers%2C%20warm%20interior%20glow%2C%20cinematic%20architectural%20photography%2C%20photorealistic&image_size=landscape_4_3": 'assets/img/photos/ultra-luxury-modern-white-villa-terrace-with-2.webp',
    "Private%20fine%20dining%20room%20in%20ultra%20luxury%20modern%20mansion%2C%20marble%20chef%20table%20set%20for%20eight%2C%20candlelight%2C%20glass%20wine%20cellar%20wall%2C%20moody%20cinematic%20golden%20atmosphere%2C%20photorealistic&image_size=square": 'assets/img/photos/private-fine-dining-room-in-ultra-luxury.webp',
    "Ultra%20luxury%20villa%20terrace%20at%20twilight%20with%20warm%20glowing%20interiors%20overlooking%20infinity%20pool%20and%20calm%20sea%2C%20first%20stars%20in%20sky%2C%20cinematic%20atmospheric%2C%20photorealistic&image_size=landscape_4_3": 'assets/img/photos/ultra-luxury-villa-terrace-at-twilight-with.webp',
    "Aerial%20dusk%20view%20of%20glamorous%20coastal%20city%20peninsula%20with%20marina%20bay%2C%20golden%20city%20lights%2C%20luxury%20hillside%20homes%20along%20the%20coast%2C%20cinematic%2C%20photorealistic&image_size=landscape_16_9": 'assets/img/photos/aerial-dusk-view-of-glamorous-coastal-city.webp',
    "Ultra%20luxury%20modern%20cliffside%20villa%20exterior%20at%20golden%20hour%2C%20white%20stone%20architecture%2C%20sculptural%20infinity%20pool%20merging%20with%20the%20ocean%2C%20dramatic%20coastal%20cliffs%2C%20cinematic%20architectural%20photography%2C%20photorealistic&image_size=landscape_16_9": 'assets/img/photos/ultra-luxury-modern-cliffside-villa-exterior-at.webp',
    "Interior%20of%20ultra%20luxury%20modern%20glass%20mansion%2C%20double%20height%20floor%20to%20ceiling%20windows%2C%20elegant%20white%20designer%20sofas%2C%20polished%20travertine%20floor%2C%20infinity%20pool%20and%20tall%20pine%20trees%20outside%2C%20soft%20daylight%2C%20architectural%20digest%2C%20photorealistic&image_size=portrait_4_3": 'assets/img/photos/interior-of-ultra-luxury-modern-glass-mansion-2.webp'
  };
  function img(prompt, size) {
    var key = encodeURIComponent(prompt) + '&image_size=' + (size || 'landscape_4_3');
    return LOCAL[key] || (API + key);
  }

  /* ---- Shared architectural photography ---- */
  var PHOTO = {
    heroVilla: img('Breathtaking ultra luxury modern coastal villa with cantilevered white stone terraces and infinity pool merging with turquoise ocean, distant mountain coastline, soft golden sunrise light, calm water, editorial architectural photography, serene, cinematic, hyperrealistic, premium real estate', 'landscape_16_9'),
    living: img('Interior of ultra luxury modern glass mansion, double height floor to ceiling windows, elegant white designer sofas, polished travertine floor, infinity pool and tall pine trees outside, soft daylight, architectural digest, photorealistic', 'landscape_16_9'),
    terrace: img('Ultra luxury modern white villa terrace with infinity pool overlooking the ocean at blue hour, sculptural loungers, warm interior glow, cinematic architectural photography, photorealistic', 'landscape_16_9'),
    bedroom: img('Ultra luxury minimal bedroom suite with floor to ceiling glass walls facing the sea, linen bedding, oak and travertine, soft morning light, premium interior photography, photorealistic', 'landscape_16_9'),
    mountain: img('Aerial view of ultra luxury modern white villa with infinity pool surrounded by misty green mountain forest, dramatic minimalist architecture, photorealistic editorial photography', 'portrait_4_3'),
    lakeside: img('Luxury modern lakeside residence with glass walls, heated infinity pool, tall cypress trees, calm lake reflections at golden hour, photorealistic architectural photography', 'portrait_4_3'),
    coastInterior: img('Interior of luxury coastal villa, double height glass living room opening to sea view terrace, elegant minimal cream furniture, soft daylight, photorealistic', 'portrait_4_3'),
    pool: img('Infinity swimming pool of ultra luxury villa at sunset, teak loungers, ocean horizon, cinematic warm golden light, photorealistic', 'landscape_4_3'),
    spa: img('Ultra luxury private spa interior in cream marble and stone, candles, soft steam, brushed gold brass details, serene moody light, photorealistic', 'landscape_4_3'),
    cinema: img('Luxury private home cinema room with dark velvet loungers, warm ambient light, acoustic wood wall panels, premium interior photography, photorealistic', 'landscape_4_3'),
    fitness: img('Luxury residential fitness studio with floor to ceiling windows overlooking tropical gardens, polished stone floors, premium equipment, soft daylight, photorealistic', 'landscape_4_3'),
    wine: img('Private fine dining room in ultra luxury modern mansion, marble chef table set for eight, candlelight, glass wine cellar wall, moody cinematic golden atmosphere, photorealistic', 'landscape_4_3'),
    lounge: img('Interior of luxury coastal villa, double height glass living room opening to sea view terrace, elegant minimal cream furniture, soft daylight, photorealistic', 'landscape_4_3'),
    dining: img('Private fine dining room in ultra luxury modern mansion, marble chef table set for eight, candlelight, glass wine cellar wall, moody cinematic golden atmosphere, photorealistic', 'landscape_16_9'),
    aerial: img('Aerial dusk view of glamorous coastal city peninsula with marina bay, golden city lights, luxury hillside homes along the coast, cinematic, photorealistic', 'landscape_4_3'),
    travertine: img('Architectural detail of luxury building facade, fluted travertine columns, warm sunlight and shadow, brushed brass gold accents, minimal editorial photography', 'portrait_4_3'),
    twilight: img('Ultra luxury villa terrace at twilight with warm glowing interiors overlooking infinity pool and calm sea, first stars in sky, cinematic atmospheric, photorealistic', 'landscape_16_9'),
    oceanPavilion: img('Ultra luxury glass pavilion villa perched above a turquoise cove, cantilevered terrace with heated plunge pool, white stone, dramatic ocean cliffs, golden afternoon light, editorial architectural photography, photorealistic', 'landscape_4_3'),
    skyPenthouse: img('Ultra luxury rooftop penthouse terrace with private plunge pool overlooking a glittering marina and open sea at dusk, designer outdoor lounge, fire pit, cinematic skyline, photorealistic editorial', 'landscape_4_3'),
    gardenEstate: img('Ultra luxury tropical garden villa with lush private courtyard, turquoise pool surrounded by palms and sculptural white stone architecture, bright sunny day, photorealistic editorial', 'landscape_4_3'),
    cliffHouse: img('Minimal luxury two bedroom cliff house in dark timber and glass, cantilevered deck over wild ocean rocks, moody sky, warm interior glow, cinematic architectural photography, photorealistic', 'landscape_4_3'),
    capeCottage: img('Romantic tiny luxury stone cottage perched on a dramatic ocean cliff headland, outdoor copper bath on a private deck, warm glowing windows at dusk, wild sea spray, cinematic editorial architectural photography, photorealistic', 'landscape_4_3'),
    duneHouse: img('Ultra luxury modern beach villa behind natural sand dunes, white stone and teak terraces, boardwalk leading directly to a turquoise beach, soft dune grasses, bright airy daylight, editorial architectural photography, photorealistic', 'landscape_4_3'),
    reefPenthouse: img('Sleek luxury glass penthouse with compact plunge pool on a sky terrace high above a glittering marina and reef sea, designer lounge, deep orange sunset, cinematic editorial photography, photorealistic', 'landscape_4_3'),
    citrusEstate: img('Grand ultra luxury villa compound within a mature citrus grove, white stone colonnades, long reflecting pool, tennis court beyond the trees, golden afternoon light, aerial editorial architectural photography, photorealistic', 'landscape_4_3'),
    cove: img('Secluded powder-sand cove seen from above, turquoise reef water, two paddleboards on the shore, soft morning light, luxury travel editorial photography, photorealistic', 'landscape_4_3'),
    bath: img('Ultra luxury spa bathroom in travertine and brushed brass, freestanding stone bath, rain shower, ocean view through glass, candlelight steam, photorealistic', 'landscape_4_3')
  };

  /* ---- Guest review pool (deterministically attributed per residence) ---- */
  var REVIEW_POOL = [
    { n: 'Isabelle M.', l: 'Paris, France', t: 'The staff anticipated things we had not even thought of. Every detail, from the in-villa breakfast to the boat prepared at the cove, was effortless.' },
    { n: 'Haruto S.', l: 'Tokyo, Japan', t: 'The photographs are beautiful but the house itself is more so. Waking above the ocean with nothing but the sound of the waves was extraordinary.' },
    { n: 'Amara O.', l: 'Lagos, Nigeria', t: 'We travelled with three generations and there was space and grace for everyone. The family host made travelling with children feel like a true holiday.' },
    { n: 'Daniela R.', l: 'Milan, Italy', t: 'The chef alone was worth the journey — and then there was the sunset service, the spa, the quiet. Flawless from arrival to departure.' },
    { n: 'James W.', l: 'London, United Kingdom', t: 'Privacy that is absolute without ever feeling remote. The concierge was present exactly when needed and invisible otherwise.' },
    { n: 'Sofia L.', l: 'New York, USA', t: 'An exceptionally designed home — the materials, the light, the proportion of the rooms. Architectural Digest in real life.' },
    { n: 'Omar F.', l: 'Dubai, UAE', t: 'We have rented villas on four continents; this was the most polished operation we have experienced. The standard never slipped once.' },
    { n: 'Clara V.', l: 'Barcelona, Spain', t: 'The bed linens, the smell of jasmine at dusk, the pantry already stocked with our preferences — a level of care that is genuinely rare.' },
    { n: 'Nathaniel K.', l: 'Sydney, Australia', t: 'The water access is private and the watercraft were prepared daily. We spent a week in the sea and barely used the car once.' },
    { n: 'Yasmin H.', l: 'Marrakesh, Morocco', t: 'Perfect for our anniversary. Discreet, romantic and deeply restful. We left already speaking with the team about returning.' }
  ];

  var STANDARD_FEATURES = [
    'Private infinity or heated pool',
    'Dedicated villa host & daily housekeeping',
    'Pre-arrival pantry stocking',
    '24-hour concierge & in-residence dining',
    'Airport transfers in a private vehicle',
    'Premium spa bathroom with rain shower',
    'Smart-home climate, lighting & sound',
    'High-speed secure Wi-Fi throughout'
  ];

    var PROPERTIES = [
    {
      id: 'studio-110',
      name: 'The Studio · 110',
      tagline: 'East Parade — Leeds',
      area: 'East Parade, Leeds LS1',
      beds: 1, baths: 1, guests: 2, sqm: 38,
      price: 185, minNights: 2, category: 'studio',
      badge: 'Studio', featured: true,
      rating: 4.94, reviews: 47,
      tags: ['City centre', 'Smart home', 'Gym access'],
      map: { x: 50, y: 50 },
      card: 'assets/img/units/110-card.webp',
      gallery: ['assets/img/units/110-01.webp', 'assets/img/units/110-02.webp', 'assets/img/units/110-03.webp'],
      blurb: 'A perfectly formed studio residence with smart-home tech, premium finishes and access to all resident amenities.',
      description: [
        'The Studio · 110 is a thoughtfully designed compact residence at the heart of The Residence on East Parade. Every square metre has been considered — from the integrated kitchenette to the walk-in rainfall shower.',
        'Smart-home climate, lighting and sound are controlled via the resident app. Full access to the pool, gym, spa, cinema and all communal amenities is included.'
      ],
      features: ['Smart-home climate & lighting', 'Integrated kitchenette', 'Walk-in rainfall shower', 'Resident app control', 'Premium finishes throughout', 'Full amenity access'].concat(STANDARD_FEATURES.slice(3))
    },
    {
      id: 'luxe-studio-124',
      name: 'The Luxe Studio · 124',
      tagline: 'East Parade — Leeds',
      area: 'East Parade, Leeds LS1',
      beds: 1, baths: 1, guests: 2, sqm: 45,
      price: 225, minNights: 2, category: 'studio',
      badge: 'Luxe Studio', featured: true,
      rating: 4.96, reviews: 38,
      tags: ['Luxe finish', 'Larger layout', 'Spa access'],
      map: { x: 50, y: 50 },
      card: 'assets/img/units/124-card.webp',
      gallery: ['assets/img/units/124-01.webp', 'assets/img/units/124-02.webp', 'assets/img/units/124-03.webp'],
      blurb: 'An elevated studio with enhanced finishes, more space, and a dedicated dressing area.',
      description: [
        'The Luxe Studio · 124 offers an expanded layout with upgraded materials, a dedicated dressing area and a larger living space. The residence feels distinctly residential rather than aparthotel.',
        'Full smart-home integration, premium bedding and complete access to all amenities — including the spa, sauna and Teppanyaki bar.'
      ],
      features: ['Upgraded premium finishes', 'Dedicated dressing area', 'Expanded living space', 'Smart-home integration', 'Enhanced bedding package', 'Full amenity access'].concat(STANDARD_FEATURES.slice(3))
    },
    {
      id: 'terrace-studio-304',
      name: 'Terrace Studio · 304',
      tagline: 'East Parade — Leeds',
      area: 'East Parade, Leeds LS1',
      beds: 1, baths: 1, guests: 2, sqm: 52,
      price: 265, minNights: 2, category: 'terrace',
      badge: 'Terrace', featured: true,
      rating: 4.97, reviews: 29,
      tags: ['Private terrace', 'Outdoor space', 'City views'],
      map: { x: 50, y: 50 },
      card: 'assets/img/units/304-card.webp',
      gallery: ['assets/img/units/304-01.webp', 'assets/img/units/304-02.webp', 'assets/img/units/304-03.webp'],
      blurb: 'A spacious studio with a private outdoor terrace and city views across East Parade.',
      description: [
        'Terrace Studio · 304 combines the best of indoor and outdoor living, with a private terrace overlooking the city. The interior is generous and bright, with floor-to-ceiling glass and a well-appointed kitchenette.',
        'A perfect residence for those who value outdoor space and natural light, with all amenities included.'
      ],
      features: ['Private outdoor terrace', 'City views', 'Floor-to-ceiling glass', 'Spacious open layout', 'Well-appointed kitchenette', 'Full amenity access'].concat(STANDARD_FEATURES.slice(3))
    },
    {
      id: 'one-bedroom-328',
      name: 'One Bedroom · 328',
      tagline: 'East Parade — Leeds',
      area: 'East Parade, Leeds LS1',
      beds: 2, baths: 2, guests: 4, sqm: 68,
      price: 345, minNights: 2, category: 'one-bed',
      badge: 'One Bedroom', featured: false,
      rating: 4.98, reviews: 22,
      tags: ['Separate bedroom', 'Sleeps 4', 'Largest layout'],
      map: { x: 50, y: 50 },
      card: 'assets/img/units/328-card.webp',
      gallery: ['assets/img/units/328-01.webp', 'assets/img/units/328-02.webp', 'assets/img/units/328-03.webp'],
      blurb: 'A full one-bedroom residence with separate bedroom, living room and space for up to four guests.',
      description: [
        'One Bedroom · 328 is the most spacious residence in the collection — a full apartment with a separate bedroom, living room, dining area and a well-equipped kitchen. It sleeps up to four guests comfortably.',
        'Designed for longer stays, families or those who simply want more space. All amenities included, plus fortnightly cleaning.'
      ],
      features: ['Separate bedroom', 'Full living room', 'Dining area & kitchen', 'Sleeps up to 4 guests', 'Largest layout (68 sqm)', 'Full amenity access'].concat(STANDARD_FEATURES.slice(3))
    }
  ];

  var SERVICE = {
    cleaning: 0,
    serviceRate: 0.10,
    taxRate: 0.05,
    currency: '£'
  };

  window.MALIK = {
    img: img,
    PHOTO: PHOTO,
    PROPERTIES: PROPERTIES,
    REVIEW_POOL: REVIEW_POOL,
    SERVICE: SERVICE,
    getProperty: function (id) {
      for (var i = 0; i < PROPERTIES.length; i++) if (PROPERTIES[i].id === id) return PROPERTIES[i];
      return PROPERTIES[0];
    },
    findProperty: function (id) {
      for (var i = 0; i < PROPERTIES.length; i++) if (PROPERTIES[i].id === id) return PROPERTIES[i];
      return null;
    }
  };
})();
