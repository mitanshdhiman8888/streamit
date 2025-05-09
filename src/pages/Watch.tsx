import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer';
import SeasonSelector from '../components/SeasonSelector';
import EpisodeList from '../components/EpisodeList';
import { getShow } from '../data/api';
import { Show, Season, Episode } from '../types';

const Watch: React.FC = () => {
  const { showId = '', seasonId = '', episodeId = '' } = useParams<{
    showId: string;
    seasonId: string;
    episodeId: string;
  }>();
  
  const [show, setShow] = useState<Show | null>(null);
  const [currentSeason, setCurrentSeason] = useState<Season | null>(null);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadShow = async () => {
      setIsLoading(true);
      try {
        if (showId) {
          const showData = await getShow(showId);
          setShow(showData);
          
          // Find current season
          const season = showData.seasons.find(s => s.id === seasonId) || showData.seasons[0];
          setCurrentSeason(season);
          
          // Find current episode
          const episode = season.episodes.find(e => e.id === episodeId) || season.episodes[0];
          setCurrentEpisode(episode);
        }
      } catch (error) {
        console.error('Error loading show:', error);
      }
      setIsLoading(false);
    };
    
    loadShow();
  }, [showId, seasonId, episodeId]);

  const handleSelectSeason = (selectedSeasonId: string) => {
    if (!show) return;
    
    const season = show.seasons.find(s => s.id === selectedSeasonId);
    if (season) {
      setCurrentSeason(season);
      // Reset to first episode of season
      setCurrentEpisode(season.episodes[0]);
    }
  };

  if (isLoading || !show || !currentSeason || !currentEpisode) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-12">
      <div className="mb-8">
        <VideoPlayer 
          src={currentEpisode.videoUrl}
          title={`${show.title} - ${currentEpisode.title}`}
          subtitles={currentEpisode.subtitles}
          showId={showId}
          seasonId={currentSeason.id}
          episodeId={currentEpisode.id}
        />
      </div>
      
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center mb-4 space-y-4 md:space-y-0 md:space-x-4">
          <h1 className="text-2xl font-bold flex-1">{show.title}</h1>
          <div className="w-full md:w-48">
            <SeasonSelector 
              seasons={show.seasons}
              currentSeason={currentSeason.id}
              onSelectSeason={handleSelectSeason}
            />
          </div>
        </div>
        
        <div className="p-6 bg-gray-800/50 rounded-lg">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">{currentEpisode.title}</h2>
            <p className="text-gray-300">{currentEpisode.description}</p>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-gray-700 px-2 py-1 rounded text-sm">{show.releaseYear}</span>
            <span className="bg-gray-700 px-2 py-1 rounded text-sm">{show.rating}</span>
            {show.genres.map(genre => (
              <span key={genre} className="bg-gray-700 px-2 py-1 rounded text-sm">{genre}</span>
            ))}
          </div>
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-bold mb-4">Episodes</h2>
        <EpisodeList 
          episodes={currentSeason.episodes}
          showId={showId}
          seasonId={currentSeason.id}
          currentEpisodeId={currentEpisode.id}
        />
      </div>
    </div>
  );
};

export default Watch;