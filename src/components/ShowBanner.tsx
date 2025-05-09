import React from 'react';
import { Play, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ShowBannerProps {
  showId: string;
  title: string;
  description: string;
  bannerImage: string;
  seasonId: string;
  episodeId: string;
  moreInfoUrl?: string;
}

const ShowBanner: React.FC<ShowBannerProps> = ({ 
  showId, 
  title, 
  description,
  bannerImage,
  seasonId,
  episodeId,
  moreInfoUrl = "https://www.imdb.com/title/tt5753856/", 
}) => {
  return (
    <div className="relative w-full aspect-[21/9] md:aspect-[25/9] lg:aspect-[3/1] overflow-hidden rounded-xl">
      {/* Background image with gradient overlay */}
      <div className="absolute inset-0">
        <img 
          src={bannerImage} 
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/70 to-transparent"></div>
      </div>
      
      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-12 lg:p-16">
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
            {title}
          </h1>
          <p className="text-gray-300 mb-6 line-clamp-3 text-sm md:text-base">
            {description}
          </p>
          
          <div className="flex space-x-4">
            <Link 
              to={`/watch/${showId}/${seasonId}/${episodeId}`}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md flex items-center transition-colors"
            >
              <Play size={20} className="mr-2" />
              Play
            </Link>
            <a
              href={moreInfoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-800/80 hover:bg-gray-700 text-white px-6 py-3 rounded-md flex items-center transition-colors"
            >
              <Info size={20} className="mr-2" />
              More Info
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowBanner;

