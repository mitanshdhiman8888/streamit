import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Play } from 'lucide-react';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isWatchPage = location.pathname.includes('/watch');

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled || isWatchPage ? 'bg-gray-900/95 backdrop-blur-sm shadow-lg' : 'bg-gradient-to-b from-gray-900 to-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <Play className="text-red-600 mr-2" size={24} />
          <span className="font-bold text-xl">StreamFlix</span>
        </Link>
        

      </div>
    </header>
  );
};

export default Header;