export interface Show {
    id: string;
    title: string;
    description: string;
    poster: string;
    bannerImage: string;
    releaseYear: string;
    rating: string;
    genres: string[];
    seasons: Season[];
  }
  
  export interface Season {
    id: string;
    title: string;
    episodes: Episode[];
  }
  
  export interface Episode {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    videoUrl: string;
    subtitles?: string;
    duration: number;
  }