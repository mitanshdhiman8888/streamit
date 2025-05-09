import React from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import { useSavedProgress } from '../hooks/useSavedProgress';

interface Show {
  id: string;
  title: string;
  seasons: Season[];
}

interface Season {
  id: string;
  title: string;
  episodes: Episode[];
}

interface Episode {
  id: string;
  title: string;
  thumbnail: string;
  duration: number;
}

interface ContinueWatchingProps {
  shows: Show[];
}

const ContinueWatching: React.FC<ContinueWatchingProps> = ({ shows }) => {
  // Get all shows with saved progress
  const inProgress = shows.flatMap(show => {
    return show.seasons.flatMap(season => {
      return season.episodes.map(episode => {
        const { savedTime } = useSavedProgress(show.id, season.id, episode.id);
        if (savedTime > 0) {
          const progress = savedTime / episode.duration;
          // Only show if less than 95% complete
          if (progress < 0.95) {
            return {
              showId: show.id,
              showTitle: show.title,
              seasonId: season.id,
              episodeId: episode.id,
              episodeTitle: episode.title,
              thumbnail: episode.thumbnail,
              progress,
              duration: episode.duration,
            };
          }
        }
        return null;
      }).filter(Boolean);
    });
  });

  if (inProgress.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Continue Watching</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {inProgress.map((item, index) => {
          // item will never be null here because of .filter(Boolean) earlier
          if (!item) return null;  // Just in case

          return (
            <div key={index} className="bg-gray-800 rounded-lg overflow-hidden hover:scale-[1.03] transition-transform">
              <Link to={`/watch/${item.showId}/${item.seasonId}/${item.episodeId}`}>
                <div className="relative">
                  <img 
                    src={item.thumbnail} 
                    alt={item.episodeTitle}
                    className="w-full aspect-video object-cover"
                  />
                  
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
                    <Play size={48} className="text-white" />
                  </div>
                  
                  {/* Progress bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-600">
                    <div 
                      className="h-full bg-red-600"
                      style={{ width: `${item.progress * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="p-3">
                  <h3 className="font-medium truncate">{item.showTitle}</h3>
                  <p className="text-sm text-gray-400 truncate">
                    {item.episodeTitle}
                  </p>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContinueWatching;
