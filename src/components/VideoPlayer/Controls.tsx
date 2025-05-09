import React from 'react';
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, Volume1, VolumeX, 
  Maximize, Minimize, Settings, Subtitles, ChevronLeft
} from 'lucide-react';
import { formatTime } from '../../utils/formatTime';

interface ControlsProps {
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  volume: number;
  isMuted: boolean;
  fullscreen: boolean;
  playbackRate: number;
  showControls: boolean;
  subtitleEnabled: boolean;
  quality: string;
  showSettings: boolean;
  title: string;
  onTogglePlay: () => void;
  onSeek: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSkip: (seconds: number) => void;
  onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleMute: () => void;
  onToggleFullscreen: () => void;
  onChangePlaybackRate: (rate: number) => void;
  onToggleSubtitles: () => void;
  onChangeQuality: (quality: string) => void;
  onToggleSettings: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  isPlaying,
  duration,
  currentTime,
  volume,
  isMuted,
  fullscreen,
  playbackRate,
  showControls,
  subtitleEnabled,
  quality,
  showSettings,
  title,
  onTogglePlay,
  onSeek,
  onSkip,
  onVolumeChange,
  onToggleMute,
  onToggleFullscreen,
  onChangePlaybackRate,
  onToggleSubtitles,
  onChangeQuality,
  onToggleSettings
}) => {
  // Calculate progress percentage
  const progress = duration ? (currentTime / duration) * 100 : 0;
  
  // Volume icon based on current volume
  const VolumeIcon = isMuted || volume === 0 
    ? VolumeX 
    : volume < 0.5 
      ? Volume1 
      : Volume2;

  return (
    <div 
      className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 ${
        showControls ? 'opacity-100' : 'opacity-0'
      } flex flex-col justify-between p-4`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Top controls */}
      <div className="flex items-center space-x-2">
        <button 
          className="p-2 hover:bg-white/20 rounded-full transition-colors"
          onClick={() => window.history.back()}
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="font-medium truncate">{title}</h2>
      </div>
      
      {/* Center controls */}
      <div className="flex items-center justify-center space-x-8">
        <button 
          className="p-3 hover:bg-white/20 rounded-full transition-colors"
          onClick={() => onSkip(-10)}
          aria-label="Skip backwards 10 seconds"
        >
          <SkipBack size={24} />
        </button>
        
        <button 
          className="p-4 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
          onClick={onTogglePlay}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={32} /> : <Play size={32} />}
        </button>
        
        <button 
          className="p-3 hover:bg-white/20 rounded-full transition-colors"
          onClick={() => onSkip(10)}
          aria-label="Skip forward 10 seconds"
        >
          <SkipForward size={24} />
        </button>
      </div>
      
      {/* Bottom controls */}
      <div className="space-y-2">
        {/* Progress bar */}
        <div className="flex items-center space-x-2">
          <span className="text-xs">{formatTime(currentTime)}</span>
          <div className="relative flex-1 h-1 bg-white/30 rounded cursor-pointer group">
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={onSeek}
              className="absolute w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div 
              className="absolute h-full bg-red-600 rounded"
              style={{ width: `${progress}%` }}
            ></div>
            <div 
              className="absolute h-3 w-3 bg-red-600 rounded-full -mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ left: `${progress}%`, transform: 'translateX(-50%)' }}
            ></div>
          </div>
          <span className="text-xs">{formatTime(duration)}</span>
        </div>
        
        {/* Action buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              className="hover:text-red-500 transition-colors"
              onClick={onTogglePlay}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            
            <div className="group relative flex items-center">
              <button 
                className="hover:text-red-500 transition-colors mr-2"
                onClick={onToggleMute}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                <VolumeIcon size={20} />
              </button>
              
              <div className="w-0 overflow-hidden group-hover:w-24 transition-all duration-300">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={onVolumeChange}
                  className="w-full h-1 bg-white/30 appearance-none rounded cursor-pointer"
                  aria-label="Volume"
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              className={`hover:text-red-500 transition-colors ${subtitleEnabled ? 'text-red-500' : ''}`}
              onClick={onToggleSubtitles}
              aria-label={subtitleEnabled ? 'Disable subtitles' : 'Enable subtitles'}
            >
              <Subtitles size={20} />
            </button>
            
            <div className="relative">
              <button 
                className={`hover:text-red-500 transition-colors ${showSettings ? 'text-red-500' : ''}`}
                onClick={onToggleSettings}
                aria-label="Settings"
              >
                <Settings size={20} />
              </button>
              
              {showSettings && (
                <div className="absolute bottom-full right-0 mb-2 w-48 bg-gray-800 rounded-md shadow-lg overflow-hidden">
                  <div className="p-2 text-sm font-medium border-b border-gray-700">
                    Settings
                  </div>
                  
                  <div className="p-2 border-b border-gray-700">
                    <p className="text-xs mb-1">Playback Speed</p>
                    <div className="grid grid-cols-4 gap-1">
                      {[0.5, 1, 1.5, 2].map(rate => (
                        <button
                          key={rate}
                          className={`text-xs p-1 rounded ${playbackRate === rate ? 'bg-red-600' : 'hover:bg-gray-700'}`}
                          onClick={() => onChangePlaybackRate(rate)}
                        >
                          {rate}x
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="p-2">
                    <p className="text-xs mb-1">Quality</p>
                    <div className="space-y-1">
                      {['auto', '1080p', '720p', '480p'].map(q => (
                        <button
                          key={q}
                          className={`text-xs p-1 w-full text-left rounded ${quality === q ? 'bg-red-600' : 'hover:bg-gray-700'}`}
                          onClick={() => onChangeQuality(q)}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <button 
              className="hover:text-red-500 transition-colors"
              onClick={onToggleFullscreen}
              aria-label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {fullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Controls;