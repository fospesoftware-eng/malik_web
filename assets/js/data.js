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
      id: 'signature-villa',
      name: 'The Signature Villa',
      tagline: 'The Estate — Ocean Cliffs',
      area: 'Ocean Cliffs, Private Bay',
      beds: 6, baths: 6, guests: 12, sqm: 980,
      price: 4800, minNights: 3, category: 'cliff',
      badge: 'Flagship', featured: true,
      rating: 4.98, reviews: 126,
      tags: ['Private chef', 'Horizon pool', 'Spa & hammam'],
      map: { x: 23.5, y: 63 },
      card: PHOTO.heroVilla,
      gallery: [PHOTO.living, PHOTO.terrace, PHOTO.bedroom],
      blurb: 'Our one-of-one estate cantilevered above the open ocean — six suites, a 25-metre horizon pool and a staff of eight.',
      description: [
        'Sculpted into the cliffside where the mountain folds into the sea, The Signature Villa is the estate the entire Coastal Collection was conceived around. A 25-metre horizon pool draws the eye across the bay, while double-height glass pavilions hold six suites, a private spa and a chef’s kitchen finished in travertine and oak.',
        'A staff of eight — villa host, private chef, butlers and housekeeping — anticipates every rhythm of your stay, from dawn yoga on the terrace to last-light cinema beneath the stars.'
      ],
      features: ['25-metre horizon infinity pool', 'Private chef & full staff of eight', 'Six en-suite bedrooms', 'In-residence spa & hammam', 'Private home cinema', 'Direct cliff-stair beach access'].concat(STANDARD_FEATURES.slice(2))
    },
    {
      id: 'ocean-pavilion',
      name: 'The Ocean Pavilion',
      tagline: 'The Collection — Coral Bay',
      area: 'Coral Bay Shoreline',
      beds: 3, baths: 3, guests: 6, sqm: 420,
      price: 2200, minNights: 2, category: 'coast',
      badge: 'Beachfront', featured: true,
      rating: 4.96, reviews: 88,
      tags: ['Direct beach', 'Plunge pool', 'Snorkelling cove'],
      map: { x: 41, y: 52 },
      card: PHOTO.oceanPavilion,
      gallery: [PHOTO.oceanPavilion, PHOTO.living, PHOTO.terrace],
      blurb: 'A glass pavilion hovering over a turquoise cove, with a cantilevered deck and steps that meet the sand.',
      description: [
        'The Ocean Pavilion dissolves the line between inside and horizon. Floor-to-ceiling glass wraps three en-suite suites and a travertine living pavilion, opening to a cantilevered deck where a heated plunge pool hangs above the cove.',
        'A private boardwalk leads directly to the powder-sand shore, and your villa host prepares the paddleboards, snorkelling gear and sunset service each afternoon.'
      ],
      features: ['Heated cantilevered plunge pool', 'Direct beach access via boardwalk', 'Three en-suite bedrooms', 'Outdoor rain shower & sun deck', 'Kayaks & paddleboards included', 'Twilight turndown service'].concat(STANDARD_FEATURES.slice(0, 6))
    },
    {
      id: 'sky-penthouse',
      name: 'The Sky Penthouse',
      tagline: 'The Collection — Marina Heights',
      area: 'Marina Heights, 28th Floor',
      beds: 4, baths: 4, guests: 8, sqm: 560,
      price: 3400, minNights: 2, category: 'sky',
      badge: 'Skyline', featured: true,
      rating: 4.95, reviews: 102,
      tags: ['Marina skyline', 'Private lift', 'Fire lounge'],
      map: { x: 78, y: 29 },
      card: PHOTO.skyPenthouse,
      gallery: [PHOTO.skyPenthouse, PHOTO.living, PHOTO.bedroom],
      blurb: 'A wrap-around sky terrace with a private plunge pool, fire lounge and uninterrupted views of the marina.',
      description: [
        'Crowning the tallest tower of Marina Heights, The Sky Penthouse wraps a full floor in glass and terraces. Four corner suites share a wrap-around sky garden with a heated plunge pool, outdoor fire lounge and dining for ten above the glittering marina.',
        'Private lift access, a dedicated penthouse host and priority bookings at the beach club and chef’s table come as standard.'
      ],
      features: ['Wrap-around sky terrace & plunge pool', 'Private lift lobby', 'Four corner en-suite bedrooms', 'Outdoor fire lounge & dining for ten', 'Floor-to-ceiling marina views', 'Priority beach club reservations'].concat(STANDARD_FEATURES.slice(0, 6))
    },
    {
      id: 'garden-estate',
      name: 'The Garden Estate',
      tagline: 'The Collection — Palm Valley',
      area: 'Palm Valley Gardens',
      beds: 5, baths: 5, guests: 10, sqm: 740,
      price: 2900, minNights: 2, category: 'garden',
      badge: 'Family Favourite',
      rating: 4.93, reviews: 74,
      tags: ['Lagoon pool', 'Family stays', 'Private orchard'],
      map: { x: 47, y: 80 },
      card: PHOTO.gardenEstate,
      gallery: [PHOTO.gardenEstate, PHOTO.pool, PHOTO.bedroom],
      blurb: 'A private garden world of courtyards, palms and a lagoon pool — made for long family lunches.',
      description: [
        'Hidden behind sculpted walls in Palm Valley, The Garden Estate unfolds around a lagoon-style pool wrapped in tropical courtyards. Five tranquil suites, an outdoor kitchen and a long shaded dining terrace make it the collection’s most loved home for families and gatherings.',
        'Children are welcomed with a dedicated pool attendant, treasure hunts arranged by the concierge and flexible connecting suites.'
      ],
      features: ['Lagoon-style garden pool', 'Outdoor kitchen & BBQ pavilion', 'Five en-suite bedrooms', 'Shaded dining terrace for twelve', 'Children’s pool attendant on request', 'Private garden with fruit orchard'].concat(STANDARD_FEATURES.slice(0, 6))
    },
    {
      id: 'lakeside-retreat',
      name: 'The Lakeside Retreat',
      tagline: 'The Collection — Cypress Lake',
      area: 'Cypress Lake, North Shore',
      beds: 3, baths: 2, guests: 6, sqm: 380,
      price: 1800, minNights: 2, category: 'lake',
      badge: 'Serenity',
      rating: 4.91, reviews: 59,
      tags: ['Private dock', 'Wine cellar', 'Secluded'],
      map: { x: 17.5, y: 85 },
      card: PHOTO.lakeside,
      gallery: [PHOTO.lakeside, PHOTO.bedroom, PHOTO.terrace],
      blurb: 'Stillness by the water — glass walls, cypress reflections and a heated pool that meets the lake.',
      description: [
        'On the quiet north shore of Cypress Lake, this low-slung retreat opens entirely to the water. A heated infinity pool appears to spill into the lake, and cypress trees frame the view from every room.',
        'The pace slows here: sunrise paddleboarding, long breakfasts on the dock and fireside evenings with a cellar chosen by our sommelier.'
      ],
      features: ['Heated infinity pool meeting the lake', 'Private dock & rowing boat', 'Three bedrooms, two bathrooms', 'Outdoor fire pit terrace', 'Wine cellar with sommelier selection', 'Lake paddleboards & kayaks'].concat(STANDARD_FEATURES.slice(0, 6))
    },
    {
      id: 'cliff-house',
      name: 'The Cliff House',
      tagline: 'The Collection — North Cape',
      area: 'North Cape Headland',
      beds: 2, baths: 2, guests: 4, sqm: 260,
      price: 1500, minNights: 2, category: 'cliff',
      badge: 'Intimate',
      rating: 4.97, reviews: 67,
      tags: ['For two couples', 'Storm fireplace', 'Headland trail'],
      map: { x: 11.5, y: 21 },
      card: PHOTO.cliffHouse,
      gallery: [PHOTO.cliffHouse, PHOTO.bedroom, PHOTO.living],
      blurb: 'A dark-timber hideaway for two couples, cantilevered over the wild rocks of North Cape.',
      description: [
        'The smallest residence in the collection and perhaps the most romantic, The Cliff House is a dark-timber and glass hideaway balanced over the surf-lashed rocks of North Cape. Two equal suites share a cantilevered deck, an outdoor bath and front-row seats to the storms and sunsets.',
        'A compact kitchen, a honesty bar and your host on call keep the stay effortless — wonderfully private, never isolated.'
      ],
      features: ['Cantilevered deck over the ocean', 'Two equal en-suite suites', 'Outdoor stone bath', 'Honesty bar & espresso lounge', 'Storm-watch fireplace', 'Private coastal trail access'].concat(STANDARD_FEATURES.slice(0, 6))
    },
    {
      id: 'cape-cottage',
      name: 'The Cape Cottage',
      tagline: 'The Collection — North Cape',
      area: 'North Cape Lighthouse Path',
      beds: 1, baths: 1, guests: 2, sqm: 140,
      price: 1350, minNights: 2, category: 'cliff',
      badge: 'Hideaway',
      rating: 4.99, reviews: 36,
      tags: ['For two', 'Copper bath', 'Storm fireplace'],
      map: { x: 7.5, y: 11.5 },
      card: PHOTO.capeCottage,
      gallery: [PHOTO.capeCottage, PHOTO.bedroom, PHOTO.bath],
      blurb: 'A one-suite stone cottage at the very tip of the cape — an outdoor copper bath and nothing but horizon.',
      description: [
        'The Cape Cottage is the smallest address in the collection and, guests tell us, the most romantic. A single stone suite, a deep copper bath on a sheltered deck and a firelit reading nook face the open Atlantic from the tip of North Cape.',
        'Your host arrives by arrangement — breakfast on the terrace, a picnic packed for the lighthouse trail — leaving the cottage otherwise entirely yours. The collection’s entry price, none of its restraint.'
      ],
      features: ['One king suite with ocean glass', 'Outdoor copper bath on the deck', 'Storm-watch fireplace lounge', 'Private lighthouse trail', 'Breakfast hamper & in-cottage dining', 'Binoculars, blankets & star chart'].concat(STANDARD_FEATURES.slice(1, 6))
    },
    {
      id: 'dune-house',
      name: 'The Dune House',
      tagline: 'The Collection — Coral Bay',
      area: 'Coral Bay, Dune Shore',
      beds: 4, baths: 4, guests: 8, sqm: 480,
      price: 2600, minNights: 2, category: 'coast',
      badge: 'Beachfront',
      rating: 4.92, reviews: 51,
      tags: ['Boardwalk to beach', 'Dune views', 'Four suites'],
      map: { x: 55, y: 45.5 },
      card: PHOTO.duneHouse,
      gallery: [PHOTO.duneHouse, PHOTO.cove, PHOTO.terrace],
      blurb: 'White stone and teak behind the dunes, with a private boardwalk that spills straight onto the sand.',
      description: [
        'Set back from Coral Bay behind protected dunes, The Dune House wraps four en-suite suites around a breezy teak courtyard and a 20-metre pool. A private boardwalk crosses the dune grass to the estate’s widest stretch of shore.',
        'The beach club is a barefoot stroll away, and the boardwalk gate means days here run on tide time rather than clock time — dawn swims, long lunches, afternoon shade.'
      ],
      features: ['Private boardwalk to the shore', '20-metre pool with dune views', 'Four en-suite bedrooms', 'Outdoor rain garden showers', 'Beach club access included', 'Surfboards, kayaks & beach cabana'].concat(STANDARD_FEATURES.slice(0, 6))
    },
    {
      id: 'reef-penthouse',
      name: 'The Reef Penthouse',
      tagline: 'The Collection — Marina Heights',
      area: 'Marina Heights, 24th Floor',
      beds: 2, baths: 2, guests: 4, sqm: 300,
      price: 2300, minNights: 2, category: 'sky',
      badge: 'Skyline',
      rating: 4.94, reviews: 44,
      tags: ['24th-floor skyline', 'Plunge pool', 'Sunset deck'],
      map: { x: 85.5, y: 19.5 },
      card: PHOTO.reefPenthouse,
      gallery: [PHOTO.reefPenthouse, PHOTO.living, PHOTO.bedroom],
      blurb: 'A two-suite sky residence above the reef sea — plunge pool, sunset deck and the marina lights below.',
      description: [
        'The Reef Penthouse is the compact counterpoint to its tower-mate above: two corner suites, a single great room wrapped in glass and a private plunge pool cantilevered over the skyline, oriented to catch the full sunset over the reef.',
        'Private lift access, a resident host and the same priority beach-club rights as the full-floor penthouse — composed for two couples or a family of four who live out on the terrace.'
      ],
      features: ['Cantilevered plunge pool at 24 floors', 'Two corner en-suite suites', 'Sunset-facing sky terrace', 'Private lift lobby', 'Rooftop residents’ lounge access', 'Priority beach-club reservations'].concat(STANDARD_FEATURES.slice(0, 6))
    },
    {
      id: 'citrus-estate',
      name: 'The Citrus Estate',
      tagline: 'The Estate — Palm Valley',
      area: 'Palm Valley, Old Groves',
      beds: 6, baths: 7, guests: 12, sqm: 860,
      price: 4200, minNights: 3, category: 'garden',
      badge: 'Grand Estate',
      rating: 4.96, reviews: 33,
      tags: ['Twelve guests', 'Tennis court', 'Citrus grove'],
      map: { x: 36, y: 88.5 },
      card: PHOTO.citrusEstate,
      gallery: [PHOTO.citrusEstate, PHOTO.living, PHOTO.pool],
      blurb: 'A walled estate in a century-old citrus grove — six suites, colonnades, a tennis court and a long reflecting pool.',
      description: [
        'Hidden within one of Palm Valley’s last working citrus groves, The Citrus Estate is a compound of white-stone pavilions joined by colonnades, courtyards of orange and lemon trees and a 30-metre reflecting pool. Six suites, a games house and a floodlit tennis court make it the collection’s most complete gathering estate.',
        'The kitchen gardens supply your chef; the orchard supplies breakfast. A staff of seven, an events pavilion and a fleet of electric bikes complete a stay that need never leave the gates.'
      ],
      features: ['30-metre reflecting pool', 'Private floodlit tennis court', 'Six suites & a games pavilion', 'Chef kitchen & events pavilion', 'Working citrus orchard & kitchen garden', 'Staff of seven & electric bikes'].concat(STANDARD_FEATURES.slice(2))
    }
  ];

  var SERVICE = {
    cleaning: 350,     // flat per stay
    serviceRate: 0.12, // of accommodation
    taxRate: 0.05,     // of accommodation
    currency: '$'
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
