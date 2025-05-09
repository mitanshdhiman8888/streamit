import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface Season {
  id: string;
  title: string;
}

interface SeasonSelectorProps {
  seasons: Season[];
  currentSeason: string;
  onSelectSeason: (seasonId: string) => void;
}

const SeasonSelector: React.FC<SeasonSelectorProps> = ({ 
  seasons, 
  currentSeason, 
  onSelectSeason 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const currentSeasonTitle = seasons.find(s => s.id === currentSeason)?.title || '';

  return (
    <div className="relative">
      <button
        className="flex items-center justify-between w-full px-4 py-2 text-left bg-gray-800 hover:bg-gray-700 rounded-md transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{currentSeasonTitle}</span>
        <ChevronDown 
          size={20} 
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-gray-800 rounded-md shadow-lg max-h-60 overflow-auto">
          {seasons.map(season => (
            <button
              key={season.id}
              className={`block w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors ${
                season.id === currentSeason ? 'bg-gray-700' : ''
              }`}
              onClick={() => {
                onSelectSeason(season.id);
                setIsOpen(false);
              }}
            >
              {season.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SeasonSelector;