import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Clock } from 'lucide-react';
import { formatTime } from '../utils/formatTime';

interface Episode {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: number;
  progress?: number;
}

interface EpisodeListProps {
  episodes: Episode[];
  showId: string;
  seasonId: string;
  currentEpisodeId?: string;
}

const EpisodeList: React.FC<EpisodeListProps> = ({ 
  episodes, 
  showId, 
  seasonId, 
  currentEpisodeId 
}) => {
  return (
    <div className="space-y-6">
      {episodes.map((episode, index) => {
        const isCurrentEpisode = episode.id === currentEpisodeId;
        const progressPercent = episode.progress ? (episode.progress * 100) : 0;
        
        return (
          <div 
            key={episode.id}
            className={`bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden transition-all hover:scale-[1.02] ${
              isCurrentEpisode ? 'ring-2 ring-red-600' : ''
            }`}
          >
            <Link
              to={`/watch/${showId}/${seasonId}/${episode.id}`}
              className="flex flex-col md:flex-row"
            >
              {/* Episode Number and Thumbnail */}
              <div className="relative md:w-80 h-48 md:h-44">
                <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm px-4 py-2 rounded-full text-lg font-bold">
                  {(index + 1).toString().padStart(2, '0')}
                </div>
                <img 
                  src={episode.thumbnail} 
                  alt={episode.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
                  <Play size={48} className="text-white" />
                </div>
                
                {/* Progress bar */}
                {progressPercent > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-600">
                    <div 
                      className="h-full bg-red-600"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                )}
              </div>
              
              {/* Episode Info */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-xl font-bold">{episode.title}</h3>
                  <div className="flex items-center text-gray-400 whitespace-nowrap">
                    <Clock size={16} className="mr-1" />
                    {formatTime(episode.duration)}
                  </div>
                </div>
                
                <p className="text-gray-300 mt-3 line-clamp-3 flex-1">
                  {episode.description}
                </p>
                
                {/* Watch Status */}
                <div className="mt-4">
                  {progressPercent > 0 && progressPercent < 95 && (
                    <div className="flex items-center text-red-500">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                      Continue watching
                    </div>
                  )}
                  
                  {progressPercent >= 95 && (
                    <div className="flex items-center text-green-500">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Watched
                    </div>
                  )}
                  
                  {progressPercent === 0 && (
                    <div className="flex items-center text-gray-400">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                      Not watched
                    </div>
                  )}
                </div>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default EpisodeList;