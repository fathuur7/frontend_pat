export interface Video {
  id: string;
  src: string;
  alt: string;
  duration: string;
  title: string;
}

export interface Episode {
  id: string;
  episodeNumber: number;
  title: string;
  duration: string;
  thumbnail: string;
  alt: string;
}

export interface VideoDetail extends Video {
  seriesTitle: string;
  episodeNumber: number;
  description: string;
  tags: string[];
  rating: number;
  reviewCount: string;   // e.g. "2.1k"
  episodes: Episode[];
}

export interface Category {
  bg: string;         // tailwind bg class, e.g. "bg-comic-red"
  icon: string;       // Material Symbol name
  iconColor: string;  // tailwind text class for the icon inside the white box
  titleColor: string; // tailwind text class for the heading
  descColor: string;  // tailwind text class for the description
  title: string;
  description: string;
}
