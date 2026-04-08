export type VisitStatus = 'liked' | 'disliked' | null;

export interface Location {
  id: string | number;
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
  userRatingsTotal?: number;
  weekdayText?: string[];
  googlePlaceId?: string;
  visitStatus?: VisitStatus;
  isSaved?: boolean;
}

export const MOCK_LOCATIONS: Location[] = [
  {
    id: 1,
    name: 'Києво-Печерська Лавра',
    distance: '2.1 км',
    rating: 4.8,
    image: 'https://hromadske.radio/_next/image?url=https%3A%2F%2Fstatic.hromadske.radio%2F2023%2F01%2Flavra.jpg&w=1366&q=75',
    vibes: ['Explore', 'Special'],
    icon: '✨',
    coords: [50.4346, 30.5574],
    reviewUrl: 'https://www.google.com/maps/search/?api=1&query=Києво-Печерська+Лавра',
    description: 'Об\'єкт всесвітньої спадщини ЮНЕСКО та один із найбільш значущих православних монастирів у Східній Європі. Заснована у 1051 році, вона відома своєю розгалуженою мережею підземних печер.',
    address: 'вул. Лаврська, 15, Київ',
    hours: '09:00 — 18:00',
    userRatingsTotal: 1250,
    googlePlaceId: 'ChIJffjBqUivEmsRRruygYugQnU'
  },
  {
    id: 2,
    name: 'Сквот 17б',
    distance: '0.5 км',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1551033406-611cf9a28f67?q=80&w=800&auto=format&fit=crop',
    vibes: ['Cozy', 'Social', 'Special'],
    icon: '☕',
    coords: [50.4417, 30.5153],
    reviewUrl: 'https://www.google.com/maps/search/?api=1&query=Сквот+17б',
    description: 'Унікальний культурний простір та бар, захований у затишному дворику. Розпочавши свій шлях як справжній сквот, він перетворився на улюблений центр спільноти, відомий своєю богемною атмосферою, муралами та літньою терасою.',
    address: 'вул. Терещенківська, 17Б, Київ',
    hours: '11:00 — 22:00',
    userRatingsTotal: 840,
    googlePlaceId: 'ChIJhffeemdl6IgRcSa52Oq9sB8'
  },
  {
    id: 3,
    name: 'Zigzag',
    distance: '0.8 км',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=800&auto=format&fit=crop',
    vibes: ['Social', 'Cozy'],
    icon: '🍸',
    coords: [50.4514, 30.5123],
    reviewUrl: 'https://www.google.com/maps/search/?api=1&query=Zigzag+Київ',
    description: 'Трендове, атмосферне кафе на історичній вулиці Рейтарській. Відоме своїм інтер\'єром у стилі модерн середини століття, м\'яким джазом та вечорами при свічках. У меню — європейська кухня та авторські коктейлі.',
    address: 'вул. Рейтарська, 13, Київ',
    hours: '09:00 — 22:00',
    userRatingsTotal: 1100,
    googlePlaceId: 'ChIJ_6WJ_RKs823puRempCgO-FE'
  },
  {
    id: 4,
    name: 'The Blue Cup Coffee Shop',
    distance: '0.3 км',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800&auto=format&fit=crop',
    vibes: ['ToGo', 'Cozy'],
    icon: '☕',
    coords: [50.4465, 30.5195],
    reviewUrl: 'https://www.google.com/maps/search/?api=1&query=The+Blue+Cup+Coffee+Shop',
    description: 'Затишна та соціально відповідальна кав\'ярня. Унікальний інтер\'єр з ілюстраціями зникаючих тварин Червоної книги України. Спеціалізується на якісній каві, сніданках протягом усього дня та різноманітних десертах.',
    address: 'вул. Євгена Чикаленка, 5, Київ',
    hours: '08:00 — 21:00',
    userRatingsTotal: 950,
    googlePlaceId: 'ChIJYQav-TCWhgVybgCPnQwJu5M'
  },
  {
    id: 5,
    name: 'Національний Ботанічний Сад',
    distance: '3.5 км',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=800&auto=format&fit=crop',
    vibes: ['Nature', 'Active'],
    icon: '🌿',
    coords: [50.4131, 30.5638],
    reviewUrl: 'https://www.google.com/maps/search/?api=1&query=Ботанічний+сад+імені+Гришка',
    description: 'Один із найбільших ботанічних садів Європи, що займає 130 гектарів на Печерських пагорбах. Найбільш відомий своєю колекцією бузку та захоплюючими панорамними видами на Дніпро та Видубицький монастир.',
    address: 'вул. Тимірязєвська, 1, Київ',
    hours: '08:30 — 21:00',
    userRatingsTotal: 3400,
    googlePlaceId: 'ChIJ_3iezoHqhn27nmNU_RktEGt'
  }
];
