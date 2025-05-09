import React, { useRef, useState, useEffect } from 'react';
import Controls from './Controls';
import Subtitles from './Subtitles';
import { useSavedProgress } from '../../hooks/useSavedProgress';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';

interface VideoPlayerProps {
  src: string;
  title: string;
  subtitles?: string;
  showId: string;
  seasonId: string;
  episodeId: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  src, 
  title, 
  subtitles, 
  showId, 
  seasonId, 
  episodeId 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [subtitleEnabled, setSubtitleEnabled] = useState(true);
  const [quality, setQuality] = useState('auto');
  const [showSettings, setShowSettings] = useState(false);
  const [selectedAudioTrack, setSelectedAudioTrack] = useState('');
  
  const { savedTime, saveProgress } = useSavedProgress(showId, seasonId, episodeId);
  const audioTracks = {
    en: 'English',
    es: 'Spanish',
    fr: 'French'
  }
  
  useOnClickOutside(playerRef, () => {
    setShowSettings(false);
  });

  // Set up video event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      // Save progress every 5 seconds
      if (Math.floor(video.currentTime) % 5 === 0) {
        saveProgress(video.currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoading(false);
      
      // Resume from saved position if available
      if (savedTime > 0) {
        // Don't resume if we're near the end
        if (savedTime < video.duration - 30) {
          video.currentTime = savedTime;
        }
      }
    };
    
    const handleAudioTrackChange = (trackKey: string) => {
      setSelectedAudioTrack(trackKey);
      // In a real implementation, you would switch audio tracks here
      console.log('Switched to audio track:', trackKey);
    };


    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      // Clear saved progress when video ends
      saveProgress(0);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);
    
    // Initial volume setup
    video.volume = volume;

    // Hide controls after 3 seconds of inactivity
    const controlsTimer = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
      clearTimeout(controlsTimer);
    };
  }, [isPlaying, savedTime, saveProgress]);

  // Toggle play/pause
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play()
        .catch(error => {
          console.error('Error playing video:', error);
        });
      setIsPlaying(true);
    }
  };

  // Handle user interaction to show controls
  const handleMouseMove = () => {
    setShowControls(true);
    
    // Hide controls after 3 seconds if playing
    if (isPlaying) {
      const timer = setTimeout(() => {
        setShowControls(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  };

  // Skip forward/backward
  const handleSkip = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    
    const newTime = Math.max(0, Math.min(video.currentTime + seconds, video.duration));
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Handle seek on progress bar
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    
    const newTime = parseFloat(e.target.value);
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    video.volume = newVolume;
    
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  // Toggle mute
  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (isMuted) {
      video.volume = volume || 0.5;
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    const player = playerRef.current;
    if (!player) return;
    
    if (!document.fullscreenElement) {
      player.requestFullscreen().then(() => {
        setFullscreen(true);
      }).catch(err => {
        console.error('Error attempting to enable fullscreen:', err.message);
      });
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  // Change playback rate
  const changePlaybackRate = (rate: number) => {
    const video = videoRef.current;
    if (!video) return;
    
    video.playbackRate = rate;
    setPlaybackRate(rate);
    setShowSettings(false);
  };

  // Toggle subtitles
  const toggleSubtitles = () => {
    setSubtitleEnabled(!subtitleEnabled);
  };

  // Change video quality (simulated)
  const changeQuality = (newQuality: string) => {
    setQuality(newQuality);
    setShowSettings(false);
    // In a real implementation, this would switch video sources
  };

  return (
    <div 
      ref={playerRef}
      className="relative w-full aspect-video bg-black rounded-lg overflow-hidden group"
      onMouseMove={handleMouseMove}
      onClick={() => showSettings && setShowSettings(false)}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-contain"
        onClick={togglePlay}
        playsInline
      ></video>
      
      {subtitles && subtitleEnabled && (
        <Subtitles subtitleUrl={subtitles} currentTime={currentTime} />
      )}
      
      <Controls 
          isPlaying={isPlaying}
          duration={duration}
          currentTime={currentTime}
          volume={volume}
          isMuted={isMuted}
          fullscreen={fullscreen}
          playbackRate={playbackRate}
          showControls={showControls}
          subtitleEnabled={subtitleEnabled}
          quality={quality}
          showSettings={showSettings}
          onTogglePlay={togglePlay}
          onSeek={handleSeek}
          onSkip={handleSkip}
          onVolumeChange={handleVolumeChange}
          onToggleMute={toggleMute}
          onToggleFullscreen={toggleFullscreen}
          onChangePlaybackRate={changePlaybackRate}
          onToggleSubtitles={toggleSubtitles}
          onChangeQuality={changeQuality}
          onToggleSettings={() => setShowSettings(!showSettings)}
          title={title}
          audioTracks={audioTracks} 
          selectedAudioTrack={selectedAudioTrack} 
          onAudioTrackChange={handleAudioTrackChange} 
      />
    </div>
  );
};

export default VideoPlayer;
