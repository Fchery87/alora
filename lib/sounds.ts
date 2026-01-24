export interface Sound {
  id: string;
  name: string;
  category: "white" | "pink" | "nature" | "womb" | "ambient";
  duration: number;
  description: string;
  icon: string;
}

export const SOUNDS: Sound[] = [
  {
    id: "white-1",
    name: "White Noise",
    category: "white",
    duration: 0,
    description: "Classic white noise for blocking distractions",
    icon: "waveform",
  },
  {
    id: "white-2",
    name: "Fan Sound",
    category: "white",
    duration: 0,
    description: "Gentle fan whirring",
    icon: "leaf",
  },
  {
    id: "pink-1",
    name: "Pink Noise",
    category: "pink",
    duration: 0,
    description: "Softer, deeper than white noise",
    icon: "water",
  },
  {
    id: "pink-2",
    name: "Brown Noise",
    category: "pink",
    duration: 0,
    description: "Deep, rumbling relaxation",
    icon: "musical-note",
  },
  {
    id: "womb-1",
    name: "Womb Sounds",
    category: "womb",
    duration: 0,
    description: "Calming womb-like sounds",
    icon: "heart",
  },
  {
    id: "womb-2",
    name: "Heartbeat",
    category: "womb",
    duration: 0,
    description: "Gentle heartbeat rhythm",
    icon: "pulse",
  },
  {
    id: "nature-1",
    name: "Rain",
    category: "nature",
    duration: 0,
    description: "Gentle rain sounds",
    icon: "rainy",
  },
  {
    id: "nature-2",
    name: "Ocean Waves",
    category: "nature",
    duration: 0,
    description: "Calming ocean waves",
    icon: "waves",
  },
  {
    id: "nature-3",
    name: "Forest",
    category: "nature",
    duration: 0,
    description: "Peaceful forest ambience",
    icon: "flower",
  },
  {
    id: "nature-4",
    name: "Thunderstorm",
    category: "nature",
    duration: 0,
    description: "Distant thunderstorm",
    icon: "thunderstorm",
  },
  {
    id: "ambient-1",
    name: "Lullaby",
    category: "ambient",
    duration: 0,
    description: "Gentle lullaby music",
    icon: "musical-notes",
  },
  {
    id: "ambient-2",
    name: "Shushing",
    category: "ambient",
    duration: 0,
    description: "Classic shushing sounds",
    icon: "mic",
  },
];

export const SOUND_CATEGORIES = [
  { id: "all", label: "All", icon: "library" },
  { id: "white", label: "White", icon: "waveform" },
  { id: "pink", label: "Deep", icon: "water" },
  { id: "womb", label: "Womb", icon: "heart" },
  { id: "nature", label: "Nature", icon: "leaf" },
  { id: "ambient", label: "Ambient", icon: "musical-note" },
] as const;

export function getSoundsByCategory(category: string): Sound[] {
  if (category === "all") return SOUNDS;
  return SOUNDS.filter((s) => s.category === category);
}
