export interface FoodItem {
  id: string;
  name: string;
  price: number; // in RWF
  rating: number;
  reviews: number;
  deliveryTime: string;
  image: string;
  category: "Traditional" | "Grill" | "Stews" | "Street Food" | "Beverages" | "Dessert";
  description: string;
  chef: {
    name: string;
    avatar: string;
    quote: string;
  };
  isVegetarian?: boolean;
  isPopular?: boolean;
}

const RAW_FOODS_DATA: FoodItem[] = [
  {
    id: "isombe-rice",
    name: "Isombe with Rice",
    price: 4500,
    rating: 4.8,
    reviews: 142,
    deliveryTime: "20-25 min",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=500",
    category: "Traditional",
    description: "Traditional Rwandan masterpiece made of pounded cassava leaves slow-cooked with peanuts, palm oil, eggplant, green peppers, and native spices. Served hot with a generous portion of steamed local white rice.",
    chef: {
      name: "Master Chef N. Karisa (NK)",
      avatar: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=200",
      quote: "Isombe is the soul of Rwandan cuisine. We select cassava leaves from Kirehe valley and simmer them for 4 hours to achieve peak tenderness."
    },
    isVegetarian: true,
    isPopular: true
  },
  {
    id: "grilled-tilapia",
    name: "Kigali Grilled Tilapia",
    price: 9000,
    rating: 4.9,
    reviews: 218,
    deliveryTime: "30-45 min",
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=500",
    category: "Grill",
    description: "Freshly caught local tilapia, deep-scored and stuffed with chopped red onions, fresh garlic, sliced ginger, native celery, and pili-pili peppers. Slow flame-grilled over volcanic charcoal for a smokey, juicy taste.",
    chef: {
      name: "Chef Joshua",
      avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=200",
      quote: "Nothing represents lakeside hospitality better than a whole grilled Tilapia. We source ours fresh daily."
    },
    isVegetarian: false,
    isPopular: true
  },
  {
    id: "akabenz-special",
    name: "Akabenz Special with Plantains",
    price: 6000,
    rating: 4.9,
    reviews: 310,
    deliveryTime: "25-30 min",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=500",
    category: "Street Food",
    description: "Rwanda's famous roasted pork delicacy, glazed in a reduced sweet-savory local honey, ginger, and soy sauce marinade. Served with caramelized sweet plantain slices (Ibitoki). Perfect with a cold drink.",
    chef: {
      name: "Chef Joshua",
      avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=200",
      quote: "Our Akabenz has a secret touch—we glaze it with pure honey harvested from the Nyungwe outskirts."
    },
    isVegetarian: false,
    isPopular: true
  },
  {
    id: "goat-brochette",
    name: "Goat Brochette Platter",
    price: 4000,
    rating: 4.7,
    reviews: 189,
    deliveryTime: "20-30 min",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=500",
    category: "Grill",
    description: "The pride of Rwandan social culinary circles. Tender, hand-cut chunks of fresh local goat meat, marinated in garlic oil, mild curry, and onion juice, skewered and grilled over slow burning wood coals. Served with grilled bananes.",
    chef: {
      name: "Master Chef N. Karisa (NK)",
      avatar: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=200",
      quote: "A perfect brochette needs patience and high-heat volcanic coal to lock in all dry juices."
    },
    isVegetarian: false,
    isPopular: true
  },
  {
    id: "beef-brochette-fries",
    name: "Beef Brochette with Fries",
    price: 4500,
    rating: 4.6,
    reviews: 145,
    deliveryTime: "15-25 min",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=500",
    category: "Grill",
    description: "Succulent cubes of flame-grilled prime beef, lightly brushed with aromatic spiced oil. Set alongside a generous portion of crisp, golden, Hand-cut Rwandan potato fries and a small side of shredded tomato and cabbage cabbage cabbage mix.",
    chef: {
      name: "Chef Joshua",
      avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=200",
      quote: "We use select cuts of grass-fed premium Rwandan beef to ensure every bite is incredibly tender."
    },
    isVegetarian: false,
    isPopular: false
  },
  {
    id: "agatogo",
    name: "Agatogo with Plantains & Beans",
    price: 3500,
    rating: 4.7,
    reviews: 95,
    deliveryTime: "20-30 min",
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=500",
    category: "Traditional",
    description: "A hearty classic comfort dish. Thick green bananas (Ibitoki) slow-simmered in a rich tomato-onion broth with native red kidney beans, tender potato wedges, sunflower oil, and local spinach leaves.",
    chef: {
      name: "Master Chef N. Karisa (NK)",
      avatar: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=200",
      quote: "Every Rwandan child grew up on Agatogo. It represents home, warmth, and Kirehe soil abundance."
    },
    isVegetarian: true,
    isPopular: false
  },
  {
    id: "rwandan-rolex",
    name: "Rwandan Chapati Rolex",
    price: 1500,
    rating: 4.8,
    reviews: 280,
    deliveryTime: "10-15 min",
    image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&q=80&w=500",
    category: "Street Food",
    description: "Rwandan quick street classic! A warm, pillowy, multi-layered handmade chapati wrapped around a fluffy 2-egg omelette loaded with thinly sliced green cabbage, diced tomatoes, sweet purple onions, and a splash of salt.",
    chef: {
      name: "Chef Joshua",
      avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=200",
      quote: "Our secret is in the chapati fold--lightly pan-pressed so it stays moist and beautifully flaky."
    },
    isVegetarian: true,
    isPopular: true
  },
  {
    id: "urwagwa-beer",
    name: "Urwagwa Banana Brew (Cup)",
    price: 1000,
    rating: 4.5,
    reviews: 67,
    deliveryTime: "5-10 min",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=500",
    category: "Beverages",
    description: "Traditional craft banana brew made through local fermentation of crushed sweet and bitter bananas mixed with roasted sorghum flour. Serves in a rustic cup for a deeply authentic cultural experience.",
    chef: {
      name: "Master Chef N. Karisa (NK)",
      avatar: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=200",
      quote: "We use aged sorghum grains to preserve the traditional tangy-sweet profile our grandparents loved."
    },
    isVegetarian: true,
    isPopular: false
  },
  {
    id: "iginyama-stew",
    name: "Iginyama Beef & Potato Stew",
    price: 4500,
    rating: 4.7,
    reviews: 112,
    deliveryTime: "25-35 min",
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&q=80&w=500",
    category: "Stews",
    description: "Rich, aromatic, slow-matured beef shank stew, gently braised with golden baby potatoes, sliced carrots, rosemary twigs, bell peppers, fresh garlic puree, and a thick, savory master gravy.",
    chef: {
      name: "Chef Joshua",
      avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=200",
      quote: "Matured shank meat has the best gelatin which yields a naturally thick gravy without any artificial starches."
    },
    isVegetarian: false,
    isPopular: false
  },
  {
    id: "inyange-milk",
    name: "Fresh Inyange Whole Milk",
    price: 800,
    rating: 4.9,
    reviews: 198,
    deliveryTime: "5-10 min",
    image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&q=80&w=500",
    category: "Beverages",
    description: "Pure, delicious, fresh cold whole milk, pasteurized of the highest standards by Inyange. Rich in cream and calcium, sourcing the soul of Rwandan cattle valleys.",
    chef: {
      name: "Chef Joshua",
      avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=200",
      quote: "Fresh milk is a traditional sign of peace and respect. We serve it crisp, fresh, and cold."
    },
    isVegetarian: true,
    isPopular: false
  },
  {
    id: "ibitoki-bizanye",
    name: "Roasted G-Bananas (Ibitoki)",
    price: 2500,
    rating: 4.6,
    reviews: 74,
    deliveryTime: "15-20 min",
    image: "https://images.unsplash.com/photo-1566393028639-d108a42c46a7?auto=format&fit=crop&q=80&w=500",
    category: "Traditional",
    description: "Hand-peeled green cooking bananas seasoned lightly with local sea salt, a pinch of chili spice, wrapped in banana leaves and roasted over embers, served with a rich dipping peanut oil sauce.",
    chef: {
      name: "Master Chef N. Karisa (NK)",
      avatar: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=200",
      quote: "Wrapping the ibitoki in fresh banana leaves preserves moisture and imparts a herbaceous aroma."
    },
    isVegetarian: true,
    isPopular: false
  },
  {
    id: "chapati-beans-kikomando",
    name: "Kikomando Chapati & Beans",
    price: 1500,
    rating: 4.7,
    reviews: 156,
    deliveryTime: "10-15 min",
    image: "https://images.unsplash.com/photo-1585938338392-50a59970d2ee?auto=format&fit=crop&q=80&w=500",
    category: "Street Food",
    description: "One of the most loved comfort street foods. Shaved pieces of flaky golden chapati mixed with rich, slow-boiled Rwandan yellow beans, diced red onions, and tomato paste simmered to perfection.",
    chef: {
      name: "Chef Joshua",
      avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=200",
      quote: "Kikomando is the king of quick energy. It's affordable, delicious, and holds a highly special place in streets."
    },
    isVegetarian: true,
    isPopular: true
  },
  {
    id: "african-ginger-tea",
    name: "Spiced African Chayi (Cup)",
    price: 1000,
    rating: 4.8,
    reviews: 165,
    deliveryTime: "5-10 min",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=500",
    category: "Beverages",
    description: "Rejuvenating traditional Rwandan milk tea. Brewed from dark tea leaves cultivated on the high hills, mixed with pure whole milk, crushed ginger root (Tangawizi), cardamom pods, and a touch of black pepper.",
    chef: {
      name: "Master Chef N. Karisa (NK)",
      avatar: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=200",
      quote: "Our local ginger is exceptionally punchy. It clears the chest and warms the heart instantly."
    },
    isVegetarian: true,
    isPopular: false
  },
  {
    id: "grilled-chicken-leg",
    name: "Grilled Chicken Leg (Inkoko)",
    price: 3500,
    rating: 4.7,
    reviews: 132,
    deliveryTime: "20-25 min",
    image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&q=80&w=500",
    category: "Grill",
    description: "Savory free-range local chicken quarter drumstick, pre-marinated overnight in lemon juice, rosemary, dry coriander, onion powder, and garlic, coal-seared to crisp perfection.",
    chef: {
      name: "Chef Joshua",
      avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=200",
      quote: "Free-range chicken is leaner and packs ten times more organic flavor than normal broiler poultry."
    },
    isVegetarian: false,
    isPopular: false
  },
  {
    id: "cassava-ugali-fish",
    name: "Cassava Ugali & Fish Curry",
    price: 3500,
    rating: 4.8,
    reviews: 84,
    deliveryTime: "25-30 min",
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&q=80&w=500",
    category: "Traditional",
    description: "Smooth, dense traditional starch lump whipped from fine cassava and sorghum flours. Accompanied by a rich red fish curry made with freshwater sardines, local tomatoes, coriander leaves, and peanut butter broth.",
    chef: {
      name: "Master Chef N. Karisa (NK)",
      avatar: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=200",
      quote: "Whipping ugali requires strong biceps! It must stay smooth, elastic, and free of any raw lumps."
    },
    isVegetarian: false,
    isPopular: false
  },
  {
    id: "matooke-peanut-boil",
    name: "Matooke in Rich Peanut Boil",
    price: 3000,
    rating: 4.7,
    reviews: 62,
    deliveryTime: "20-30 min",
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=500",
    category: "Stews",
    description: "Whole raw plantains boiled in a silky savory sauce made from finely roasted peanut powder, garden green peas, spring onions, curry leaves, and local vegetable bouillon.",
    chef: {
      name: "Master Chef N. Karisa (NK)",
      avatar: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=200",
      quote: "Our matooke is harvested strictly on the morning of order from neighbor growers in Kirehe."
    },
    isVegetarian: true,
    isPopular: false
  },
  {
    id: "kivu-sambaza-fry",
    name: "Lake Kivu Fried Sambaza",
    price: 4500,
    rating: 4.9,
    reviews: 240,
    deliveryTime: "15-20 min",
    image: "https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?auto=format&fit=crop&q=80&w=500",
    category: "Street Food",
    description: "Crispy fried Lake Kivu sardines (Sambaza), lightly tossed in spiced corn starch, deep-fried to absolute gold, dusted with a local sea-salt blend, and served with a wedge of fresh yellow lime.",
    chef: {
      name: "Chef Joshua",
      avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=200",
      quote: "Sambaza are eaten whole like potato chips. High in mineral oils and absolutely perfect for crunch lovers."
    },
    isVegetarian: false,
    isPopular: true
  },
  {
    id: "spiced-fish-brochette",
    name: "Spiced Fish Brochette",
    price: 4500,
    rating: 4.8,
    reviews: 130,
    deliveryTime: "20-25 min",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=500",
    category: "Grill",
    description: "Premium meaty chunks of lakeside tilapia, lightly marinated in a blend of fresh coriander, lime juice, ground white pepper, and a dash of olive oil, grilled with crisp onion and sweet pepper slices.",
    chef: {
      name: "Master Chef N. Karisa (NK)",
      avatar: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=200",
      quote: "Fish is incredibly delicate on a skewer. We oil the metals diligently to prevent skin tears."
    },
    isVegetarian: false,
    isPopular: false
  },
  {
    id: "rwandan-beef-samosas",
    name: "Rwandan Beef Samosas (3 pcs)",
    price: 1500,
    rating: 4.6,
    reviews: 185,
    deliveryTime: "10-15 min",
    image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&q=80&w=500",
    category: "Street Food",
    description: "Golden, crispy triangular pockets of handmade flaky pastry filled to the brim with grass-fed minced beef cooked with chopped green onions, coriander, garlic cloves, and mild local spices.",
    chef: {
      name: "Chef Joshua",
      avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=200",
      quote: "We roll our pastry dough paper-thin to achieve that classic loud, shattering crunch upon first bite."
    },
    isVegetarian: false,
    isPopular: true
  },
  {
    id: "isata-inyana",
    name: "Isata y'Inyana Stew",
    price: 5000,
    rating: 4.7,
    reviews: 64,
    deliveryTime: "25-30 min",
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&q=80&w=500",
    category: "Stews",
    description: "Spiced local pan-braised beef liver and kidney cubes tossed in red butter, rich onion reductions, garlic leaves, and sweet pepper rings, stewed until intensely savory and dark on flavor.",
    chef: {
      name: "Master Chef N. Karisa (NK)",
      avatar: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=200",
      quote: "Liver retains iron flavors. We balances it using strong white vinegar and generous fresh rosemary seeds."
    },
    isVegetarian: false,
    isPopular: false
  },
  {
    id: "kirehe-avocado-salad",
    name: "Kirehe Jumbo Avocado Salad",
    price: 2000,
    rating: 4.8,
    reviews: 122,
    deliveryTime: "10-15 min",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=500",
    category: "Traditional",
    description: "An incredibly creamy and cooling salad. Big cubes of perfectly ripe, Kirehe jumbo butter avocados, tossed with sweet red onions, cucumber cubes, finely chopped dodo leaves, and passion fruit juice dressing.",
    chef: {
      name: "Chef Joshua",
      avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=200",
      quote: "Rwandan avocados are famous for being buttery and rich. We pair them with natural passion fruit juices instead of basic oil."
    },
    isVegetarian: true,
    isPopular: false
  },
  {
    id: "ibirayi-broth",
    name: "Ibirayi Birimo Umutobe",
    price: 2500,
    rating: 4.7,
    reviews: 58,
    deliveryTime: "15-20 min",
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=500",
    category: "Stews",
    description: "Rwandan whole baby Irish potatoes boiled and simmered patiently in a rich tomato, garlic, raw peanut paste, and local wild herb paste till the broth is completely creamy and velvety.",
    chef: {
      name: "Master Chef N. Karisa (NK)",
      avatar: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=200",
      quote: "These potatoes absorb gravy like a sponge. Patience in boiling is everything here."
    },
    isVegetarian: true,
    isPopular: false
  },
  {
    id: "honey-millet-porridge",
    name: "Rwandan Honey Millet Porridge",
    price: 1500,
    rating: 4.8,
    reviews: 145,
    deliveryTime: "5-10 min",
    image: "https://images.unsplash.com/photo-1517433456452-f9633a875f6f?auto=format&fit=crop&q=80&w=500",
    category: "Beverages",
    description: "Traditional nutritious hot porridge brewed from slow-cooked millet grain flours, whisked with pure organic milk and sweetened with premium, unpasteurized natural forest honey.",
    chef: {
      name: "Chef Joshua",
      avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=200",
      quote: "We get our honey directly from forest beekeepers near the Akagera river plains. Extremely pure!"
    },
    isVegetarian: true,
    isPopular: false
  },
  {
    id: "amandazi-beignets",
    name: "Amandazi Sweet Beignets (4 pcs)",
    price: 1000,
    rating: 4.9,
    reviews: 322,
    deliveryTime: "5-10 min",
    image: "https://images.unsplash.com/photo-1530610476181-d83430b64dcd?auto=format&fit=crop&q=80&w=500",
    category: "Dessert",
    description: "The absolute beloved Rwandan yeast-raised fried dough pastry. Soft, pillowy, scented with crushed cardamom seed powder, deep fried to a rich mahogany. Best paired with local hot black ginger tea.",
    chef: {
      name: "Master Chef N. Karisa (NK)",
      avatar: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=200",
      quote: "We rest the yeast dough for exactly two hours so the centers get airy, puffy, and completely cloud-like."
    },
    isVegetarian: true,
    isPopular: true
  },
  {
    id: "charcoal-whole-chicken",
    name: "Smoked Charcoal Whole Chicken",
    price: 12000,
    rating: 4.9,
    reviews: 92,
    deliveryTime: "40-60 min",
    image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&q=80&w=500",
    category: "Grill",
    description: "A feast for the family! Whole free-range native chicken marinated for 12 hours in lemon mustard sauce, garlic, pili-pili powder, and rosemary, slow roasted onto hot charcoal logs for hours.",
    chef: {
      name: "Chef Joshua",
      avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=200",
      quote: "This is a weekend essential. We grill it using hard Akagera bush firewood to lock in intense woods smells."
    },
    isVegetarian: false,
    isPopular: true
  },
  {
    id: "wild-mushroom-stew",
    name: "Wild Kirehe Mushroom Stew",
    price: 3500,
    rating: 4.7,
    reviews: 55,
    deliveryTime: "20-25 min",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=500",
    category: "Stews",
    description: "A rich savory plant-based stew containing hand-harvested wild mountain mushrooms braised in vegetable oils, sweet leeks, diced tomatoes, fresh spring thyme, garlic, and minor chili seeds.",
    chef: {
      name: "Master Chef N. Karisa (NK)",
      avatar: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=200",
      quote: "These woods mushrooms have an incredibly meaty texture. Combined with fresh leeks, it's a stellar feast."
    },
    isVegetarian: true,
    isPopular: false
  },
  {
    id: "peanut-sweet-potatoes",
    name: "Peanut Sauce & Sweet Potatoes",
    price: 2500,
    rating: 4.7,
    reviews: 49,
    deliveryTime: "15-20 min",
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=500",
    category: "Traditional",
    description: "Steamed, organic sweet potatoes harvested from local soil, drizzled in a rich, velvety, savory ground peanut sauce cooked lightly with tomatoes, white onion rings, and chopped green celery.",
    chef: {
      name: "Master Chef N. Karisa (NK)",
      avatar: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=200",
      quote: "Sweet potato combined with organic groundnuts is an legendary food pairing that fuels active farmers."
    },
    isVegetarian: true,
    isPopular: false
  },
  {
    id: "ginger-lemongrass-soda",
    name: "Ginger Lemongrass Soda (Bottle)",
    price: 1200,
    rating: 4.8,
    reviews: 110,
    deliveryTime: "5-10 min",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=500",
    category: "Beverages",
    description: "Incredibly refreshing local style soda crafted from cold carbonated well-water infused with freshly pressed spicy ginger juices and sweet lemongrass grass stalks extract. Best served dry on ice.",
    chef: {
      name: "Chef Joshua",
      avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=200",
      quote: "We brew this in small batches to maintain maximum crispness and that hot, peppery ginger throat kick."
    },
    isVegetarian: true,
    isPopular: false
  },
  {
    id: "brochette-combo",
    name: "Master Brochette Combo Platter",
    price: 8500,
    rating: 4.9,
    reviews: 167,
    deliveryTime: "25-35 min",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=500",
    category: "Grill",
    description: "The ultimate sharing feast! One prime goat brochette, one tender beef brochette, and one juicy fish brochette, coupled together with high-piles of crispy ibirayi (Rwandan roasted potatoes) and fresh sautéed dodo spinach leaves.",
    chef: {
      name: "Master Chef N. Karisa (NK)",
      avatar: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=200",
      quote: "Why choose when you can savor all three? We arrange this board with a small pinch of our hot akabanga pepper oil."
    },
    isVegetarian: false,
    isPopular: true
  },
  {
    id: "akaringiti-tripe",
    name: "Akaringiti Simmered Tripe Stew",
    price: 3500,
    rating: 4.6,
    reviews: 73,
    deliveryTime: "25-30 min",
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=500",
    category: "Traditional",
    description: "A rich and succulent traditional Kirehe specialty. Carefully cleaned beef-tripe and stomach linings, slow simmered for six hours with red onions, garlic oil, bell peppers, celery powder and wild parsley until melt-in-the-mouth soft.",
    chef: {
      name: "Master Chef N. Karisa (NK)",
      avatar: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=200",
      quote: "Properly cleaned tripe is a blank canvas that drinks up local wood smoke and onion stock like magic."
    },
    isVegetarian: false,
    isPopular: false
  },
  // --- NEW ADDITIONS TO REACH EXACTLY 50 DISHES ---
  {
    id: "inyange-arabic-coffee",
    name: "Inyange Arabica Coffee Brew",
    price: 2000,
    rating: 4.9,
    reviews: 195,
    deliveryTime: "5-10 min",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=500",
    category: "Beverages",
    description: "Rwanda's world-famous Single-Origin Arabica Bourbon coffee, medium-roasted and freshly brewed. Sourced from organic cooperative hillsides in Huye and Kinyami.",
    chef: {
      name: "Chef Joshua",
      avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=200",
      quote: "Our Bourbon beans are naturally sweet with gorgeous citrus acidity, slowly hand-poured to order."
    },
    isVegetarian: true,
    isPopular: true
  },
  {
    id: "inyange-passion-fruit",
    name: "Inyange Fresh Passion Fruit Juice",
    price: 1500,
    rating: 4.8,
    reviews: 162,
    deliveryTime: "5-10 min",
    image: "https://images.unsplash.com/photo-1548967084-2591636c74d6?auto=format&fit=crop&q=80&w=500",
    category: "Beverages",
    description: "Chilled fresh passion fruit juice pressed from local deep-purple passiflora crop. Perfectly sweet, tangy, and bursting with high vitamins.",
    chef: {
      name: "Chef Joshua",
      avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=200",
      quote: "A tropical refreshment direct from our local orchard vines—tangy perfection!"
    },
    isVegetarian: true,
    isPopular: false
  },
  {
    id: "millet-honey-cake",
    name: "Umutsima w’Uburo (Millet Cake)",
    price: 2500,
    rating: 4.7,
    reviews: 68,
    deliveryTime: "15-20 min",
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=500",
    category: "Dessert",
    description: "Rich, dense traditional royal Rwandan millet cake baked with organic Kirehe wild forest honey, local butter, and minor vanilla beans.",
    chef: {
      name: "Master Chef N. Karisa (NK)",
      avatar: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=200",
      quote: "This high-fiber royal dessert was once served strictly in absolute state banquets. Smooth, rich, and naturally sweetened."
    },
    isVegetarian: true,
    isPopular: false
  },
  {
    id: "inyoke-beef-rib",
    name: "Inyoke y'Inka (Charcoal Beef Rib)",
    price: 7500,
    rating: 4.9,
    reviews: 144,
    deliveryTime: "30-45 min",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=500",
    category: "Grill",
    description: "Thick, grass-fed prime local beef short rib marinated in native celery garlic paste, roasted slow over firewood logs until the meat easily pulls from the bone.",
    chef: {
      name: "Chef Joshua",
      avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=200",
      quote: "We slow-bake it in aromatic banana leaf packs first, then sear it on open grills to obtain that beautiful caramelized crust."
    },
    isVegetarian: false,
    isPopular: true
  },
  {
    id: "dodo-spinach-saute",
    name: "Dodo Spinach Sauté",
    price: 1800,
    rating: 4.6,
    reviews: 89,
    deliveryTime: "10-15 min",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=500",
    category: "Traditional",
    description: "Tender, vibrant green Rwandan Amaranth leaves (Dodo) pan-fried with caramelized red onions, garlic oil, dynamic tomatoes, and light native mild spices.",
    chef: {
      name: "Master Chef N. Karisa (NK)",
      avatar: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=200",
      quote: "Simple greens must never be overcooked. We toss them for under three minutes to preserve maximum nutrients."
    },
    isVegetarian: true,
    isPopular: false
  },
  {
    id: "igihandure-soup",
    name: "Igihandure Pea & Pumpkin Soup",
    price: 2500,
    rating: 4.7,
    reviews: 52,
    deliveryTime: "15-20 min",
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=500",
    category: "Stews",
    description: "Comforting, velvety puree soup crafted from local yellow kidney split peas, roasted sweet pumpkin cream, garlic leeks, and mountain coriander notes.",
    chef: {
      name: "Master Chef N. Karisa (NK)",
      avatar: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=200",
      quote: "This soup is exceptionally rich. The golden pumpkin brings out a subtle sweetness that pairs lovely with chapati."
    },
    isVegetarian: true,
    isPopular: false
  },
  {
    id: "ikigage-sorghum-beer",
    name: "Ikigage Sorghum Brew (Rustic Flask)",
    price: 1500,
    rating: 4.6,
    reviews: 79,
    deliveryTime: "5-10 min",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=500",
    category: "Beverages",
    description: "Authentic, naturally sparkling local beer crafted from fermented red sorghum grains and high mountain spring waters. Styled in traditional clay or wooden flask.",
    chef: {
      name: "Master Chef N. Karisa (NK)",
      avatar: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=200",
      quote: "Brewed locally with century-old fermentation techniques. It's refreshing, fizzy, and deeply traditional."
    },
    isVegetarian: true,
    isPopular: false
  },
  {
    id: "akabanga-wings",
    name: "Rwandan Akabanga Pili wings",
    price: 4500,
    rating: 4.8,
    reviews: 172,
    deliveryTime: "20-25 min",
    image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&q=80&w=500",
    category: "Grill",
    description: "Crispy fried local chicken wings tossed in a sweet-spicy sticky reduction of local bee honey, tomato glaze, and iconic Rwandan Akabanga pili-pili chili drops.",
    chef: {
      name: "Chef Joshua",
      avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=200",
      quote: "Beware of the kick! We use only two drops of original Akabanga per portion to strike the absolute best flavor balance."
    },
    isVegetarian: false,
    isPopular: true
  },
  {
    id: "pork-brochette-wedges",
    name: "Pork Brochette with Ibirayi",
    price: 5000,
    rating: 4.8,
    reviews: 135,
    deliveryTime: "20-30 min",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=500",
    category: "Grill",
    description: "Flavor-seared juicy chunks of local Kirehe farm pork, skewered with onions and bell peppers, wood-grilled, and accompanied by hand-roasted crispy potato wedges.",
    chef: {
      name: "Chef Joshua",
      avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=200",
      quote: "A perfect pork brochette contains beautiful ribbons of fat that melt on the hot volcanic coal to self-baste."
    },
    isVegetarian: false,
    isPopular: false
  },
  {
    id: "sweet-potato-fries",
    name: "Spiced Sweet Potato Fries",
    price: 1500,
    rating: 4.7,
    reviews: 110,
    deliveryTime: "10-15 min",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=500",
    category: "Street Food",
    description: "Crispy-edged, sweet and savory local red sweet potatoes, cut in thick batons, deep-fried in fresh oil, and seasoned with a light pinch of mountain rosemary salt.",
    chef: {
      name: "Chef Joshua",
      avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=200",
      quote: "These local red-skinned sweet potatoes yield a gorgeously creamy interior when fried at a hot temperature."
    },
    isVegetarian: true,
    isPopular: false
  },
  {
    id: "sorghum-bread-honey",
    name: "Umutsima w’Amasaka (Sorghum Bread)",
    price: 1800,
    rating: 4.5,
    reviews: 43,
    deliveryTime: "15-20 min",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=500",
    category: "Dessert",
    description: "Dense, earthy traditional bread whipped from high artisan dark sorghum and whole wheats, baked in slow wood oven. Served with sweet honey and fresh farm butter blocks.",
    chef: {
      name: "Master Chef N. Karisa (NK)",
      avatar: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=200",
      quote: "Sorghum bread possesses a wonderful sour fermentation note that complements morning coffee beautifully."
    },
    isVegetarian: true,
    isPopular: false
  },
  {
    id: "igoma-bananas",
    name: "Igoma (Mashed Green Bananas)",
    price: 2500,
    rating: 4.6,
    reviews: 61,
    deliveryTime: "20-25 min",
    image: "https://images.unsplash.com/photo-1566393028639-d108a42c46a7?auto=format&fit=crop&q=80&w=500",
    category: "Traditional",
    description: "Savory mountain green bananas (Ibitoki), slow boiled and mashed together with rich, lightly roasted peanut butter puree, red onions, sunflower oils, and fresh salt.",
    chef: {
      name: "Master Chef N. Karisa (NK)",
      avatar: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=200",
      quote: "An authentic comfort food that packs enormous iron levels. Extremely satisfying!"
    },
    isVegetarian: true,
    isPopular: false
  },
  {
    id: "pan-kivu-fillet",
    name: "Lake Kivu Fillet in Onion Gravy",
    price: 7000,
    rating: 4.8,
    reviews: 121,
    deliveryTime: "25-30 min",
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=500",
    category: "Stews",
    description: "Succulent boneless fillet of fresh Kivu tilapia, pan-fried and doused in a reduced, sweet caramelized yellow onion, tomato paste, garlic, and thyme reduction.",
    chef: {
      name: "Chef Joshua",
      avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=200",
      quote: "We use local butter to pan-sear the skin to gold, making sure the flesh stays incredibly flaky and moist."
    },
    isVegetarian: false,
    isPopular: true
  },
  {
    id: "coffee-glazed-cake",
    name: "Rwandan Coffee Glazed Cake",
    price: 2200,
    rating: 4.8,
    reviews: 149,
    deliveryTime: "10-15 min",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=500",
    category: "Dessert",
    description: "Splendidly light, fluffy sponge cake infused with dark espresso extracted from select Arabica beans, topped with a creamy coffee glaze.",
    chef: {
      name: "Chef Joshua",
      avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=200",
      quote: "Pairing Huye mountains coffee extract inside yeast sponge cake brings out wonderful earthy vanilla accents."
    },
    isVegetarian: true,
    isPopular: true
  },
  {
    id: "ibitoki-goat-stew",
    name: "Ibitoki & Goat Meat Stew",
    price: 5500,
    rating: 4.8,
    reviews: 112,
    deliveryTime: "25-35 min",
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&q=80&w=500",
    category: "Stews",
    description: "A rich, slow-simmered culinary marriage of green cooking bananas and chunks of fresh goat meat, thick gravy, and local sweet leeks.",
    chef: {
      name: "Master Chef N. Karisa (NK)",
      avatar: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=200",
      quote: "The banana starch thickens the goat juices natively over three hours of careful simmering."
    },
    isVegetarian: false,
    isPopular: false
  },
  {
    id: "roasted-maize-cobs",
    name: "Street-Side Roasted Maize Cob",
    price: 800,
    rating: 4.5,
    reviews: 205,
    deliveryTime: "10-15 min",
    image: "https://images.unsplash.com/photo-1551782450-17144efb9c50?auto=format&fit=crop&q=80&w=500",
    category: "Street Food",
    description: "Authentic local white field sweetcorn cob, roasted slowly over smoking red-charcoal grids, lightly rubbed with raw lemon halves and chili salts.",
    chef: {
      name: "Chef Joshua",
      avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=200",
      quote: "It's the ultimate rural memory. We pick dense cobs so every grain has that perfect chew and char."
    },
    isVegetarian: true,
    isPopular: false
  },
  {
    id: "sorghum-ginger-porridge",
    name: "Sorghum & Tangawizi Porridge",
    price: 1000,
    rating: 4.7,
    reviews: 84,
    deliveryTime: "5-10 min",
    image: "https://images.unsplash.com/photo-1517433456452-f9633a875f6f?auto=format&fit=crop&q=80&w=500",
    category: "Beverages",
    description: "Sustaining, warm red grains porridge brewed with native sorghum and whole milks, heavily spiked with punchy crushed ginger roots (Tangawizi).",
    chef: {
      name: "Master Chef N. Karisa (NK)",
      avatar: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=200",
      quote: "It's what we serve in the early cold Rwandan mornings—absolute strength and heat in a clay cup."
    },
    isVegetarian: true,
    isPopular: false
  },
  {
    id: "cassava-beignets",
    name: "Sweet Cassava Fritters (5 pcs)",
    price: 1500,
    rating: 4.6,
    reviews: 95,
    deliveryTime: "10-15 min",
    image: "https://images.unsplash.com/photo-1530610476181-d83430b64dcd?auto=format&fit=crop&q=80&w=500",
    category: "Dessert",
    description: "Sweet, crispy deep-fried balls blended from finely sifted high-quality cassava flour, mashed ripe banana puree, and local brown sugar.",
    chef: {
      name: "Chef Joshua",
      avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=200",
      quote: "Frying cassava flour gives a unique chewy structure—outer crunch with a lovely glutinous center."
    },
    isVegetarian: true,
    isPopular: false
  },
  {
    id: "agatogo-smoked-tilapia",
    name: "Agatogo with Smoked Tilapia",
    price: 4500,
    rating: 4.9,
    reviews: 139,
    deliveryTime: "20-30 min",
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=500",
    category: "Traditional",
    description: "Hearty green bananas (Ibitoki) slow-simmered with flakes of smoke-cured Lake Kivu Tilapia, tomatoes, rich peanut paste oil, and chopped dodo leaves.",
    chef: {
      name: "Master Chef N. Karisa (NK)",
      avatar: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=200",
      quote: "Smoked fish infuses an incredible woodsy umami depth into the sweet banana broth. Pure magic!"
    },
    isVegetarian: false,
    isPopular: true
  },
  {
    id: "ikivuguto-milk",
    name: "Ikivuguto Curdled Sour Milk",
    price: 1000,
    rating: 4.9,
    reviews: 218,
    deliveryTime: "5-10 min",
    image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&q=80&w=500",
    category: "Beverages",
    description: "Traditional thick, rich curdled sour milk, cold churned under hygienic standards. Smooth, incredibly refreshing, and served in a classic custom wooden Gishiyimbo calabash.",
    chef: {
      name: "Master Chef N. Karisa (NK)",
      avatar: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=200",
      quote: "Ikivuguto represents the ultimate Rwandan welcome. It cools the body and aids digestion perfectly after heavy meals."
    },
    isVegetarian: true,
    isPopular: true
  }
];

export const FOODS_DATA: FoodItem[] = RAW_FOODS_DATA.map(item => {
  if (!item.chef || item.chef.name === "Chef Joshua" || item.chef.name?.includes("Joshua")) {
    return {
      ...item,
      chef: {
        name: "Master Chef N. Karisa (NK)",
        avatar: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=200",
        quote: item.chef?.quote || "Traditional cooking connects us to the heart of Rwanda."
      }
    };
  }
  return item;
});
