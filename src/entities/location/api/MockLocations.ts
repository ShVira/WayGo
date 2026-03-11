export interface Location {
  id: number;
  name: string;
  distance: string;
  rating: number;
  image: string;
  vibes: string[];
  icon: string;
  coords: [number, number];
  reviewUrl: string;
  description: string;
  address: string;
  hours: string;
  googlePlaceId?: string;
}

export const MOCK_LOCATIONS: Location[] = [
  {
    id: 1,
    name: 'Kyiv Pechersk Lavra',
    distance: '2.1 km',
    rating: 4.8,
    image: 'https://hromadske.radio/_next/image?url=https%3A%2F%2Fstatic.hromadske.radio%2F2023%2F01%2Flavra.jpg&w=1366&q=75',
    vibes: ['Explore', 'Special'],
    icon: '✨',
    coords: [50.4346, 30.5574],
    reviewUrl: 'https://www.google.com/maps/search/?api=1&query=Kyiv+Pechersk+Lavra+Lavrska+St+15',
    description: 'A UNESCO World Heritage site and one of the most significant Orthodox Christian monasteries in Eastern Europe. Founded in 1051, it is famous for its extensive network of underground caves where the mummified remains of monks and saints are preserved.',
    address: 'Lavrska St, 15, Kyiv',
    hours: '09:00 — 18:00 (Daily)',
    googlePlaceId: 'ChIJffjBqUivEmsRRruygYugQnU'
  },
  {
    id: 2,
    name: 'Squat 17b',
    distance: '0.5 km',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800&auto=format&fit=crop', // Stylish cafe interior
    vibes: ['Cozy', 'Social', 'Special'],
    icon: '☕',
    coords: [50.4417, 30.5153],
    reviewUrl: 'https://www.google.com/maps/search/?api=1&query=Squat+17b+Tereshchenkivska+St+17B',
    description: 'A unique cultural space and bar tucked away in a hidden courtyard. Originally starting as an actual squat, it has evolved into a beloved community hub known for its bohemian atmosphere, murals, and summer terrace.',
    address: 'Tereshchenkivska St, 17B, Kyiv',
    hours: '11:00 — 22:00 (Daily)',
    googlePlaceId: 'ChIJhffeemdl6IgRcSa52Oq9sB8'
  },
  {
    id: 3,
    name: 'Zigzag',
    distance: '0.8 km',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=800&auto=format&fit=crop', // European cafe vibe
    vibes: ['Social', 'Cozy'],
    icon: '🍸',
    coords: [50.4514, 30.5123],
    reviewUrl: 'https://www.google.com/maps/search/?api=1&query=Zigzag+Reitarska+St+13',
    description: 'A trendy, atmospheric café located on the historic Reitarska Street. Known for its mid-century modern interior, soft jazz music, and candlelit evenings. The menu focuses on high-quality European comfort food and sophisticated cocktails.',
    address: 'Reitarska St, 13, Kyiv',
    hours: '09:00 — 22:00 (Daily)',
    googlePlaceId: 'ChIJ_6WJ_RKs823puRempCgO-FE'
  },
  {
    id: 4,
    name: 'The Blue Cup Coffee Shop',
    distance: '0.3 km',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800&auto=format&fit=crop', // Cozy blue theme coffee shop
    vibes: ['ToGo', 'Cozy'],
    icon: '☕',
    coords: [50.4465, 30.5195],
    reviewUrl: 'https://www.google.com/maps/search/?api=1&query=The+Blue+Cup+coffee+shop+Yevhena+Chykalenka+St+5',
    description: 'A cozy and socially conscious coffee shop. It features illustrations of endangered animals and plants from the Red Book of Ukraine. The shop specializes in high-quality coffee, all-day breakfasts, and a wide variety of desserts.',
    address: 'Yevhena Chykalenka St, 5, Kyiv',
    hours: '08:00 — 21:00 (Daily)',
    googlePlaceId: 'ChIJYQav-TCWhgVybgCPnQwJu5M'
  },
  {
    id: 5,
    name: 'National Botanical Garden',
    distance: '3.5 km',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=800&auto=format&fit=crop', // Botanical garden lush view
    vibes: ['Nature', 'Active'],
    icon: '🌿',
    coords: [50.4131, 30.5638],
    reviewUrl: 'https://www.google.com/maps/search/?api=1&query=M.M.+Gryshko+National+Botanical+Garden+Tymiryazevska+St+1',
    description: 'One of the largest botanical gardens in Europe, spanning 130 hectares on the Pechersk hills. It is most famous for its massive lilac collection and breathtaking panoramic views of the Dnipro River and the Vydubychi Monastery.',
    address: 'Tymiryazevska St, 1, Kyiv',
    hours: '08:30 — 21:00 (Daily)',
    googlePlaceId: 'ChIJ_3iezoHqhn27nmNU_RktEGt'
  }
];
