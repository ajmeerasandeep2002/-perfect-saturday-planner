
import type { ActivityOption, FoodOption, Coordinates } from '../types/planner'

type ActivityData = Omit<ActivityOption, 'coordinates'>
type FoodData = Omit<FoodOption, 'coordinates'>

const activityData: ActivityData[] = [
  // ==================== BANGALORE ====================
  {
    id: 'blr1',
    name: 'Cubbon Park Walk',
    city: 'Bangalore',
    category: 'Nature',
    cost: 0,
    durationMinutes: 60,
    interests: ['Nature', 'Walking', 'Relaxation'],
    moods: ['Relaxed', 'Tired but Fun', 'Productive'],
    crowdLevel: 'medium',
    description: 'Enjoy a refreshing walk surrounded by greenery in the city centre.',
  },
  {
    id: 'blr2',
    name: 'Indiranagar Music Cafe',
    city: 'Bangalore',
    category: 'Music',
    cost: 350,
    durationMinutes: 75,
    interests: ['Music', 'Food', 'Social'],
    moods: ['Social', 'Adventurous', 'Tired but Fun'],
    crowdLevel: 'medium',
    description: 'Enjoy music and a relaxed cafe atmosphere.',
  },
  {
  
    id: 'blr3',
    name: 'Art and Culture Visit',
    city: 'Bangalore',
    category: 'Art',
    cost: 200,
    durationMinutes: 60,
    interests: ['Art', 'Culture'],
    moods: ['Relaxed', 'Productive'],
    crowdLevel: 'low',
    description: 'Explore local art, creative exhibits and cultural displays.',
  },

  {
    id: 'blr4',
    name: 'Lalbagh Botanical Garden',
    city: 'Bangalore',
    category: 'Nature',
    cost: 50,
    durationMinutes: 75,
    interests: ['Nature', 'Walking', 'Relaxation'],
    moods: ['Relaxed', 'Productive', 'Tired but Fun'],
    crowdLevel: 'medium',
    description: 'Explore botanical collections and peaceful garden paths.',
  },
  {
    id: 'blr5',
    name: 'Commercial Street Shopping',
    city: 'Bangalore',
    category: 'Shopping',
    cost: 2500,
    durationMinutes: 90,
    interests: ['Shopping', 'Walking'],
    moods: ['Adventurous', 'Social', 'Tired but Fun'],
    crowdLevel: 'high',
    description: 'Explore a popular shopping district with clothing and accessories. Estimated shopping spend.',
  },
  {
  
    id: 'blr6',
    name: 'Visvesvaraya Science Museum',
    city: 'Bangalore',
    category: 'Culture',
    cost: 150,
    durationMinutes: 90,
    interests: ['Culture', 'Adventure'],
    moods: ['Curious', 'Productive', 'Adventurous'],
    crowdLevel: 'medium',
    description: 'Explore interactive science and technology exhibits.',
    },

  {
    id: 'blr7',
    name: 'Bowling and Games',
    city: 'Bangalore',
    category: 'Adventure',
    cost: 500,
    durationMinutes: 75,
    interests: ['Adventure', 'Social'],
    moods: ['Adventurous', 'Social', 'Tired but Fun'],
    crowdLevel: 'medium',
    description: 'Enjoy a casual bowling and indoor games session.',
  },

  {
    id: 'blr8',
    name: 'Bookstore and Reading Cafe',
    city: 'Bangalore',
    category: 'Relaxation',
    cost: 250,
    durationMinutes: 60,
    interests: ['Relaxation'],
    moods: ['Relaxed', 'Productive'],
    crowdLevel: 'low',
    description: 'Spend some quiet time browsing books and enjoying a cafe.',
  },

  {
    id: 'blr9',
    name: 'Phoenix Marketcity Visit',
    city: 'Bangalore',
    category: 'Shopping',
    cost: 3000,
    durationMinutes: 120,
    interests: ['Shopping', 'Movies', 'Food', 'Social'],
    moods: ['Social', 'Adventurous', 'Tired but Fun'],
    crowdLevel: 'high',
    description: 'Explore shopping, entertainment and leisure options. Estimated shopping spend.',
  },
  {
    id: 'blr10',
    name: 'Escape Room Experience',
    city: 'Bangalore',
    category: 'Adventure',
    cost: 700,
    durationMinutes: 60,
    interests: ['Adventure', 'Social'],
    moods: ['Adventurous', 'Social'],
    crowdLevel: 'low',
    description: 'Solve puzzles and challenges in a team-based escape room.',
  },

  // ==================== HYDERABAD ====================
  {
    id: 'hyd1',
    name: 'KBR Park Walk',
    city: 'Hyderabad',
    category: 'Nature',
    cost: 50,
    durationMinutes: 60,
    interests: ['Nature', 'Walking', 'Relaxation'],
    moods: ['Relaxed', 'Tired but Fun'],
    crowdLevel: 'medium',
    description: 'Spend time walking through a green urban park.',
  },
 
    {
    id: 'hyd2',
    name: 'Hussain Sagar Visit',
    city: 'Hyderabad',
    category: 'Nature',
    cost: 100,
    durationMinutes: 75,
    interests: ['Nature', 'Walking', 'Relaxation'],
    moods: ['Relaxed', 'Adventurous', 'Social'],
    crowdLevel: 'high',
    description: 'Enjoy a lakeside walk and views around Hussain Sagar.',
    },

  {
    id: 'hyd3',
    name: 'Creative Art Studio',
    city: 'Hyderabad',
    category: 'Art',
    cost: 300,
    durationMinutes: 60,
    interests: ['Art', 'Relaxation'],
    moods: ['Relaxed', 'Productive'],
    crowdLevel: 'low',
    description: 'Try a creative activity in a calm setting.',
  },
  {
    id: 'hyd4',
    name: 'Live Music Cafe',
    city: 'Hyderabad',
    category: 'Music',
    cost: 350,
    durationMinutes: 75,
    interests: ['Music', 'Food'],
    moods: ['Relaxed', 'Social', 'Tired but Fun'],
    crowdLevel: 'low',
    description: 'Enjoy a relaxed cafe experience with live music.',
  },
  {
    id: 'hyd5',
    name: 'Botanical Garden Walk',
    city: 'Hyderabad',
    category: 'Nature',
    cost: 50,
    durationMinutes: 60,
    interests: ['Nature', 'Walking', 'Relaxation'],
    moods: ['Relaxed', 'Tired but Fun', 'Productive'],
    crowdLevel: 'low',
    description: 'Spend some quiet time walking among greenery.',
  },

    {
    id: 'hyd6',
    name: 'Local Food Experience',
    city: 'Hyderabad',
    category: 'Food',
    cost: 300,
    durationMinutes: 60,
    interests: ['Food'],
    moods: ['Relaxed', 'Adventurous', 'Social'],
    crowdLevel: 'low',
    description: 'Explore local food options in a relaxed setting.',
    },

  {
    id: 'hyd7',
    name: 'Laad Bazaar Shopping',
    city: 'Hyderabad',
    category: 'Shopping',
    cost: 2000,
    durationMinutes: 90,
    interests: ['Shopping', 'Walking', 'Art'],
    moods: ['Adventurous', 'Social'],
    crowdLevel: 'high',
    description: 'Explore traditional bangles, accessories and local handicrafts. Estimated shopping spend.',
  },

  {
    id: 'hyd8',
    name: 'Salar Jung Museum Visit',
    city: 'Hyderabad',
    category: 'Art',
    cost: 100,
    durationMinutes: 90,
    interests: ['Art', 'Culture'],
    moods: ['Relaxed', 'Productive', 'Curious'],
    crowdLevel: 'medium',
    description: 'Discover art, antiques and historical collections.',
  },

  {
    id: 'hyd9',
    name: 'Indoor Adventure Games',
    city: 'Hyderabad',
    category: 'Adventure',
    cost: 600,
    durationMinutes: 75,
    interests: ['Adventure', 'Social'],
    moods: ['Adventurous', 'Social', 'Tired but Fun'],
    crowdLevel: 'medium',
    description: 'Enjoy indoor games and interactive activities.',
  },
  {
    id: 'hyd10',
    name: 'Inorbit Mall Visit',
    city: 'Hyderabad',
    category: 'Shopping',
    cost: 3000,
    durationMinutes: 120,
    interests: ['Shopping', 'Movies', 'Food', 'Social'],
    moods: ['Social', 'Adventurous', 'Tired but Fun'],
    crowdLevel: 'high',
    description: 'Explore shopping, entertainment and leisure options. Estimated shopping spend.',
  },

  // ==================== CHENNAI ====================
  {
    id: 'maa1',
    name: 'Besant Nagar Beach Walk',
    city: 'Chennai',
    category: 'Nature',
    cost: 0,
    durationMinutes: 60,
    interests: ['Nature', 'Walking', 'Relaxation'],
    moods: ['Relaxed', 'Tired but Fun'],
    crowdLevel: 'high',
    description: 'Enjoy a refreshing walk along the beach.',
  },

    {
    id: 'maa2',
    name: 'Music and Cultural Experience',
    city: 'Chennai',
    category: 'Music',
    cost: 300,
    durationMinutes: 75,
    interests: ['Music', 'Culture'],
    moods: ['Relaxed', 'Social', 'Productive'],
    crowdLevel: 'low',
    description: 'Explore local music and cultural performances.',
    },


  {
    id: 'maa3',
    name: 'Local Art Gallery',
    city: 'Chennai',
    category: 'Art',
    cost: 150,
    durationMinutes: 60,
    interests: ['Art'],
    moods: ['Relaxed', 'Productive'],
    crowdLevel: 'low',
    description: 'Discover local artwork and exhibitions.',
  },

  {
    id: 'maa4',
    name: 'Semmozhi Poonga Garden',
    city: 'Chennai',
    category: 'Nature',
    cost: 50,
    durationMinutes: 60,
    interests: ['Nature', 'Walking', 'Relaxation'],
    moods: ['Relaxed', 'Productive'],
    crowdLevel: 'low',
    description: 'Enjoy a peaceful walk through landscaped gardens.',
  },
  {
    id: 'maa5',
    name: 'T Nagar Shopping',
    city: 'Chennai',
    category: 'Shopping',
    cost: 3000,
    durationMinutes: 120,
    interests: ['Shopping', 'Walking'],
    moods: ['Adventurous', 'Social'],
    crowdLevel: 'high',
    description: 'Explore clothing, jewellery and traditional shopping stores. Estimated shopping spend.',
  },

  {
    id: 'maa6',
    name: 'DakshinaChitra Cultural Visit',
    city: 'Chennai',
    category: 'Culture',
    cost: 250,
    durationMinutes: 120,
    interests: ['Culture', 'Art'],
    moods: ['Curious', 'Productive', 'Relaxed'],
    crowdLevel: 'medium',
    description: 'Explore South Indian heritage, crafts and traditional architecture.',
  },

  {
    id: 'maa7',
    name: 'Bowling and Indoor Games',
    city: 'Chennai',
    category: 'Adventure',
    cost: 500,
    durationMinutes: 75,
    interests: ['Adventure', 'Social'],
    moods: ['Adventurous', 'Social', 'Tired but Fun'],
    crowdLevel: 'medium',
    description: 'Enjoy a fun indoor games session with friends.',
  },

  {
    id: 'maa8',
    name: 'Book Cafe Experience',
    city: 'Chennai',
    category: 'Relaxation',
    cost: 250,
    durationMinutes: 60,
    interests: ['Relaxation'],
    moods: ['Relaxed', 'Productive'],
    crowdLevel: 'low',
    description: 'Relax with a book and refreshments in a quiet cafe.',
  },

  {
    id: 'maa9',
    name: 'Express Avenue Mall Visit',
    city: 'Chennai',
    category: 'Shopping',
    cost: 3000,
    durationMinutes: 120,
    interests: ['Shopping', 'Movies', 'Food', 'Social'],
    moods: ['Social', 'Adventurous', 'Tired but Fun'],
    crowdLevel: 'high',
    description: 'Explore shopping, entertainment and leisure options. Estimated shopping spend.',
  },

  {
    id: 'maa10',
    name: 'Marina Beach Exploration',
    city: 'Chennai',
    category: 'Nature',
    cost: 0,
    durationMinutes: 75,
    interests: ['Nature', 'Walking', 'Relaxation'],
    moods: ['Adventurous', 'Relaxed', 'Tired but Fun'],
    crowdLevel: 'high',
    description: 'Explore the famous waterfront and enjoy a refreshing beach walk.',
  },


  // ==================== NEW DELHI ====================
  {
    id: 'del1',
    name: 'Lodhi Garden Walk',
    city: 'New Delhi',
    category: 'Nature',
    cost: 0,
    durationMinutes: 60,
    interests: ['Nature', 'Walking', 'Relaxation'],
    moods: ['Relaxed', 'Productive', 'Tired but Fun'],
    crowdLevel: 'medium',
    description: 'Enjoy green spaces, gardens and historic tombs.',
  },

  {
    id: 'del2',
    name: 'India Gate Visit',
    city: 'New Delhi',
    category: 'Culture',
    cost: 0,
    durationMinutes: 60,
    interests: ['Culture', 'Walking', 'Nature'],
    moods: ['Relaxed', 'Adventurous', 'Social'],
    crowdLevel: 'high',
    description: 'Explore the iconic war memorial and its surrounding lawns.',
  },

  {
    id: 'del3',
    name: 'Dilli Haat Shopping',
    city: 'New Delhi',
    category: 'Shopping',
    cost: 2500,
    durationMinutes: 90,
    interests: ['Shopping', 'Art', 'Food', 'Walking'],
    moods: ['Adventurous', 'Social'],
    crowdLevel: 'medium',
    description: 'Browse regional handicrafts, textiles and artisan products. Estimated shopping spend.',
  },

  {
    id: 'del4',
    name: 'National Gallery of Modern Art',
    city: 'New Delhi',
    category: 'Art',
    cost: 200,
    durationMinutes: 90,
    interests: ['Art', 'Culture'],
    moods: ['Relaxed', 'Productive', 'Curious'],
    crowdLevel: 'low',
    description: 'Explore modern and contemporary Indian artwork.',
  },

  {
    id: 'del5',
    name: 'Connaught Place Exploration',
    city: 'New Delhi',
    category: 'Shopping',
    cost: 2500,
    durationMinutes: 90,
    interests: ['Shopping', 'Walking', 'Food', 'Social'],
    moods: ['Adventurous', 'Social', 'Tired but Fun'],
    crowdLevel: 'high',
    description: 'Explore shops, restaurants and lively streets. Estimated shopping spend.',
  },
 
  {
    id: 'del6',
    name: 'Humayun Tomb Visit',
    city: 'New Delhi',
    category: 'Culture',
    cost: 100,
    durationMinutes: 90,
    interests: ['Culture', 'Art', 'Walking'],
    moods: ['Relaxed', 'Productive', 'Curious'],
    crowdLevel: 'medium',
    description: 'Discover Mughal architecture, historic design and landscaped gardens.',
  },

  {
    id: 'del7',
    name: 'Adventure and Escape Games',
    city: 'New Delhi',
    category: 'Adventure',
    cost: 700,
    durationMinutes: 75,
    interests: ['Adventure', 'Social'],
    moods: ['Adventurous', 'Social', 'Tired but Fun'],
    crowdLevel: 'medium',
    description: 'Take on puzzles and team challenges in an indoor activity.',
  },

  {
    id: 'del8',
    name: 'Book Cafe Experience',
    city: 'New Delhi',
    category: 'Relaxation',
    cost: 300,
    durationMinutes: 60,
    interests: ['Relaxation'],
    moods: ['Relaxed', 'Productive'],
    crowdLevel: 'low',
    description: 'Enjoy a quiet reading break with refreshments.',
  },

  {
    id: 'del9',
    name: 'Select Citywalk Mall Visit',
    city: 'New Delhi',
    category: 'Shopping',
    cost: 3500,
    durationMinutes: 120,
    interests: ['Shopping', 'Movies', 'Food', 'Social'],
    moods: ['Social', 'Adventurous', 'Tired but Fun'],
    crowdLevel: 'high',
    description: 'Explore retail stores, entertainment and dining. Estimated shopping spend.',
  },

  {
    id: 'del10',
    name: 'National Rail Museum',
    city: 'New Delhi',
    category: 'Culture',
    cost: 100,
    durationMinutes: 90,
    interests: ['Culture'],
    moods: ['Curious', 'Productive', 'Tired but Fun'],
    crowdLevel: 'medium',
    description: 'Explore the history of Indian railways and historic locomotives.',
  },
]

const foodData: FoodData[] = [
  // ==================== BANGALORE ====================
  {
    id: 'bf1',
    name: 'South Indian Breakfast Cafe',
    city: 'Bangalore',
    cost: 180,
    durationMinutes: 45,
    vegetarian: true,
    crowdLevel: 'medium',
    description: 'Idli, dosa and filter coffee.',
  },
  {
    id: 'bf2',
    name: 'Vegetarian Food Court',
    city: 'Bangalore',
    cost: 250,
    durationMinutes: 45,
    vegetarian: true,
    crowdLevel: 'low',
    description: 'A simple vegetarian meal.',
  },
  {
    id: 'bf3',
    name: 'Local Chicken Restaurant',
    city: 'Bangalore',
    cost: 350,
    durationMinutes: 50,
    vegetarian: false,
    crowdLevel: 'low',
    description: 'A casual meal with chicken and rice options.',
  },
  {
    id: 'bf4',
    name: 'Casual Non-Veg Dining',
    city: 'Bangalore',
    cost: 450,
    durationMinutes: 55,
    vegetarian: false,
    crowdLevel: 'medium',
    description: 'A relaxed non-vegetarian dining option.',
  },
  {
    id: 'bf5',
    name: 'Bangalore Cafe Brunch',
    city: 'Bangalore',
    cost: 400,
    durationMinutes: 60,
    vegetarian: true,
    crowdLevel: 'low',
    description: 'A relaxed brunch with vegetarian cafe dishes.',
  },

  // ==================== HYDERABAD ====================
  {
    id: 'hf1',
    name: 'Vegetarian Tiffin Centre',
    city: 'Hyderabad',
    cost: 150,
    durationMinutes: 40,
    vegetarian: true,
    crowdLevel: 'medium',
    description: 'Traditional South Indian tiffins.',
  },
  {
    id: 'hf2',
    name: 'Casual Veg Restaurant',
    city: 'Hyderabad',
    cost: 250,
    durationMinutes: 50,
    vegetarian: true,
    crowdLevel: 'low',
    description: 'A relaxed vegetarian dining option.',
  },
  {
    id: 'hf3',
    name: 'Hyderabadi Biryani Restaurant',
    city: 'Hyderabad',
    cost: 350,
    durationMinutes: 50,
    vegetarian: false,
    crowdLevel: 'medium',
    description: 'A local-style biryani meal.',
  },
  {
    id: 'hf4',
    name: 'Casual Chicken Dining',
    city: 'Hyderabad',
    cost: 450,
    durationMinutes: 55,
    vegetarian: false,
    crowdLevel: 'low',
    description: 'A relaxed non-vegetarian dining option.',
  },
  {
    id: 'hf5',
    name: 'Quick Chicken Meal',
    city: 'Hyderabad',
    cost: 350,
    durationMinutes: 45,
    vegetarian: false,
    crowdLevel: 'low',
    description: 'A quick and relaxed non-vegetarian meal.',
  },

  // ==================== CHENNAI ====================
  {
    id: 'cf1',
    name: 'Traditional Tiffin Cafe',
    city: 'Chennai',
    cost: 180,
    durationMinutes: 45,
    vegetarian: true,
    crowdLevel: 'medium',
    description: 'Fresh idli, dosa and South Indian meals.',
  },
  {
    id: 'cf2',
    name: 'Vegetarian Casual Dining',
    city: 'Chennai',
    cost: 280,
    durationMinutes: 50,
    vegetarian: true,
    crowdLevel: 'low',
    description: 'A comfortable vegetarian dining experience.',
  },
  {
    id: 'cf3',
    name: 'Local Seafood Restaurant',
    city: 'Chennai',
    cost: 400,
    durationMinutes: 50,
    vegetarian: false,
    crowdLevel: 'medium',
    description: 'A casual seafood dining experience.',
  },
  {
    id: 'cf4',
    name: 'Chicken Meals Restaurant',
    city: 'Chennai',
    cost: 350,
    durationMinutes: 50,
    vegetarian: false,
    crowdLevel: 'low',
    description: 'A simple non-vegetarian meal.',
  },
  {
    id: 'cf5',
    name: 'Chennai Cafe Brunch',
    city: 'Chennai',
    cost: 400,
    durationMinutes: 60,
    vegetarian: true,
    crowdLevel: 'low',
    description: 'A relaxed cafe brunch with vegetarian options.',
  },

  // ==================== NEW DELHI ====================
  {
    id: 'df1',
    name: 'North Indian Vegetarian Restaurant',
    city: 'New Delhi',
    cost: 300,
    durationMinutes: 50,
    vegetarian: true,
    crowdLevel: 'medium',
    description: 'Enjoy a North Indian vegetarian meal.',
  },
  {
    id: 'df2',
    name: 'Delhi Street Food Experience',
    city: 'New Delhi',
    cost: 250,
    durationMinutes: 50,
    vegetarian: true,
    crowdLevel: 'high',
    description: 'Try popular vegetarian street food and local snacks.',
  },
  {
    id: 'df3',
    name: 'Mughlai Dining Experience',
    city: 'New Delhi',
    cost: 500,
    durationMinutes: 60,
    vegetarian: false,
    crowdLevel: 'medium',
    description: 'Enjoy a traditional-style Mughlai meal.',
  },
  {
    id: 'df4',
    name: 'Casual Chicken Restaurant',
    city: 'New Delhi',
    cost: 400,
    durationMinutes: 50,
    vegetarian: false,
    crowdLevel: 'low',
    description: 'A casual non-vegetarian meal with chicken options.',
  },
  {
    id: 'df5',
    name: 'Delhi Cafe Brunch',
    city: 'New Delhi',
    cost: 450,
    durationMinutes: 60,
    vegetarian: true,
    crowdLevel: 'low',
    description: 'A relaxed cafe brunch with vegetarian dishes.',
  },
]


// Approximate coordinates for all supported activities.
// These are illustrative location estimates, not live GPS data.

const activityCoordinates: Record<string, Coordinates> = {
  // Bangalore
  blr1: { latitude: 12.9763, longitude: 77.5929 }, // Cubbon Park
  blr2: { latitude: 12.9784, longitude: 77.6408 }, // Indiranagar
  blr3: { latitude: 12.9845, longitude: 77.5969 }, // Central Bangalore
  blr4: { latitude: 12.9507, longitude: 77.5848 }, // Lalbagh
  blr5: { latitude: 12.9817, longitude: 77.6081 }, // Commercial Street
  blr6: { latitude: 12.9753, longitude: 77.5963 }, // Science Museum
  blr7: { latitude: 12.9345, longitude: 77.6113 }, // Koramangala
  blr8: { latitude: 12.9719, longitude: 77.6412 }, // Indiranagar
  blr9: { latitude: 12.9975, longitude: 77.6968 }, // Phoenix Marketcity
  blr10: { latitude: 12.9352, longitude: 77.6145 }, // Koramangala

  // Hyderabad
  hyd1: { latitude: 17.4239, longitude: 78.4155 }, // KBR Park
  hyd2: { latitude: 17.4239, longitude: 78.4738 }, // Hussain Sagar
  hyd3: { latitude: 17.4156, longitude: 78.4483 }, // Banjara Hills
  hyd4: { latitude: 17.4300, longitude: 78.4070 }, // Jubilee Hills
  hyd5: { latitude: 17.4595, longitude: 78.3639 }, // Botanical Garden
  hyd6: { latitude: 17.4401, longitude: 78.3489 }, // Gachibowli
  hyd7: { latitude: 17.3616, longitude: 78.4747 }, // Laad Bazaar
  hyd8: { latitude: 17.3713, longitude: 78.4804 }, // Salar Jung Museum
  hyd9: { latitude: 17.4401, longitude: 78.3489 }, // Gachibowli
  hyd10: { latitude: 17.4344, longitude: 78.3863 }, // Inorbit Mall

  // Chennai
  maa1: { latitude: 12.9997, longitude: 80.2707 }, // Besant Nagar
  maa2: { latitude: 13.0338, longitude: 80.2676 }, // Mylapore
  maa3: { latitude: 13.0732, longitude: 80.2609 }, // Egmore
  maa4: { latitude: 13.0448, longitude: 80.2497 }, // Semmozhi Poonga
  maa5: { latitude: 13.0418, longitude: 80.2341 }, // T Nagar
  maa6: { latitude: 12.8231, longitude: 80.2310 }, // DakshinaChitra
  maa7: { latitude: 12.9759, longitude: 80.2212 }, // Velachery
  maa8: { latitude: 13.0067, longitude: 80.2570 }, // Adyar
  maa9: { latitude: 13.0587, longitude: 80.2642 }, // Express Avenue
  maa10: { latitude: 13.0500, longitude: 80.2824 }, // Marina Beach

  // New Delhi
  del1: { latitude: 28.5933, longitude: 77.2197 }, // Lodhi Garden
  del2: { latitude: 28.6129, longitude: 77.2295 }, // India Gate
  del3: { latitude: 28.5744, longitude: 77.2077 }, // Dilli Haat
  del4: { latitude: 28.6094, longitude: 77.2345 }, // NGMA
  del5: { latitude: 28.6315, longitude: 77.2167 }, // Connaught Place
  del6: { latitude: 28.5933, longitude: 77.2507 }, // Humayun's Tomb
  del7: { latitude: 28.5278, longitude: 77.2190 }, // Saket
  del8: { latitude: 28.6001, longitude: 77.2270 }, // Khan Market
  del9: { latitude: 28.5286, longitude: 77.2194 }, // Select Citywalk
  del10: { latitude: 28.5858, longitude: 77.1809 }, // National Rail Museum
}

// Approximate restaurant/food-stop locations.

const foodCoordinates: Record<string, Coordinates> = {
  // Bangalore
  bf1: { latitude: 12.9763, longitude: 77.6033 },
  bf2: { latitude: 12.9719, longitude: 77.6412 },
  bf3: { latitude: 12.9345, longitude: 77.6113 },
  bf4: { latitude: 12.9975, longitude: 77.6968 },
  bf5: { latitude: 12.9784, longitude: 77.6408 },

  // Hyderabad
  hf1: { latitude: 17.4239, longitude: 78.4155 },
  hf2: { latitude: 17.4156, longitude: 78.4483 },
  hf3: { latitude: 17.4300, longitude: 78.4070 },
  hf4: { latitude: 17.4401, longitude: 78.3489 },
  hf5: { latitude: 17.3713, longitude: 78.4804 },

  // Chennai
  cf1: { latitude: 13.0338, longitude: 80.2676 },
  cf2: { latitude: 13.0418, longitude: 80.2341 },
  cf3: { latitude: 12.9997, longitude: 80.2707 },
  cf4: { latitude: 12.9759, longitude: 80.2212 },
  cf5: { latitude: 13.0067, longitude: 80.2570 },

  // New Delhi
  df1: { latitude: 28.6315, longitude: 77.2167 },
  df2: { latitude: 28.5744, longitude: 77.2077 },
  df3: { latitude: 28.6001, longitude: 77.2270 },
  df4: { latitude: 28.5286, longitude: 77.2194 },
  df5: { latitude: 28.5933, longitude: 77.2197 },
}

// Attach coordinates while exporting the final typed datasets.

export const activities: ActivityOption[] = activityData.map((activity) => {
  const coordinates = activityCoordinates[activity.id]

  if (!coordinates) {
    throw new Error(`Missing coordinates for activity: ${activity.id}`)
  }

  return { ...activity, coordinates }
})

export const foodOptions: FoodOption[] = foodData.map((food) => {
  const coordinates = foodCoordinates[food.id]

  if (!coordinates) {
    throw new Error(`Missing coordinates for food option: ${food.id}`)
  }

  return { ...food, coordinates }
})

