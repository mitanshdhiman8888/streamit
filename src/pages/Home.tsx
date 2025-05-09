import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import ShowBanner from '../components/ShowBanner';
import ContinueWatching from '../components/ContinueWatching';
import { fetchShows } from '../data/api';
import { Show } from '../types';

const Home: React.FC = () => {
  const [shows, setShows] = useState<Show[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadShows = async () => {
      try {
        const data = await fetchShows();
        setShows(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading shows:', error);
        setIsLoading(false);
      }
    };
    
    loadShows();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const show = shows[0]; // We only have one show now
  const firstSeasonId = show?.seasons[0]?.id || '';
  const firstEpisodeId = show?.seasons[0]?.episodes[0]?.id || '';

  return (
    <div className="pt-16 space-y-8">
      {show && (
        <>
          <ShowBanner 
            showId={show.id}
            title={show.title}
            description={show.description}
            bannerImage={show.bannerImage}
            seasonId={firstSeasonId}
            episodeId={firstEpisodeId}
          />
          
          <ContinueWatching shows={[show]} />
          
          <div>
            <h2 className="text-2xl font-bold mb-6">About {show.title}</h2>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3">
                  <img 
                    src={show.poster} 
                    alt={show.title}
                    className="w-full rounded-lg shadow-xl"
                  />
                </div>
                <div className="md:w-2/3">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-gray-700 px-3 py-1 rounded-full text-sm">
                      {show.releaseYear}
                    </span>
                    <span className="bg-gray-700 px-3 py-1 rounded-full text-sm">
                      {show.rating}
                    </span>
                    {show.genres.map(genre => (
                      <span 
                        key={genre} 
                        className="bg-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                  
                  <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                    {show.description}
                  </p>
                  
                  <div className="flex gap-4">
                    <Link 
                      to={`/watch/${show.id}/${firstSeasonId}/${firstEpisodeId}`}
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex items-center transition-colors"
                    >
                      <Play size={20} className="mr-2" />
                      Watch Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;