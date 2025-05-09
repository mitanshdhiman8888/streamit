import React, { useRef, useState, useEffect } from 'react';
import Controls from './Controls';
import Subtitles from './Subtitles';
import { useSavedProgress } from '../../hooks/useSavedProgress';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import { getEnglishAudioUrl } from '../../data/sampleData';

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
  const audioRef = useRef<HTMLAudioElement>(null);
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
  const [selectedAudioTrack, setSelectedAudioTrack] = useState('default');

  const { savedTime, saveProgress } = useSavedProgress(showId, seasonId, episodeId);

  const audioTracks = {
    default: 'Original',
    en: 'English',
  };

  const englishAudioUrl = getEnglishAudioUrl(showId, seasonId, episodeId);

  useOnClickOutside(playerRef, () => {
    setShowSettings(false);
  });

  useEffect(() => {
    const video = videoRef.current;
    const audio = audioRef.current;

    if (!video || !audio || selectedAudioTrack !== 'en') return;

    const syncAudio = () => {
      if (Math.abs(audio.currentTime - video.currentTime) > 0.3) {
        audio.currentTime = video.currentTime;
      }
    };

    const handlePlay = () => {
      audio.currentTime = video.currentTime;
      audio.play().catch((err) => console.error('Audio play failed:', err));
    };

    const handlePause = () => audio.pause();
    const handleSeek = () => { audio.currentTime = video.currentTime; };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('seeked', handleSeek);
    video.addEventListener('timeupdate', syncAudio);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('seeked', handleSeek);
      video.removeEventListener('timeupdate', syncAudio);
    };
  }, [selectedAudioTrack, episodeId]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [episodeId]);

  const handleAudioTrackChange = (trackKey: string) => {
    setSelectedAudioTrack(trackKey);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      if (Math.floor(video.currentTime) % 5 === 0) {
        saveProgress(video.currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoading(false);
      if (savedTime > 0 && savedTime < video.duration - 30) {
        video.currentTime = savedTime;
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      saveProgress(0);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);
    video.volume = volume;

    const controlsTimer = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
      clearTimeout(controlsTimer);
    };
  }, [isPlaying, savedTime, saveProgress]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play().catch((error) => console.error('Play error:', error));
      setIsPlaying(true);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (isPlaying) {
      const timer = setTimeout(() => setShowControls(false), 3000);
      return () => clearTimeout(timer);
    }
  };

  const handleSkip = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    const newTime = Math.max(0, Math.min(video.currentTime + seconds, video.duration));
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const newTime = parseFloat(e.target.value);
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    video.volume = newVolume;
    setIsMuted(newVolume === 0);
  };

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

  const toggleFullscreen = () => {
    const player = playerRef.current;
    if (!player) return;
    if (!document.fullscreenElement) {
      player.requestFullscreen().then(() => setFullscreen(true)).catch(console.error);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  const changePlaybackRate = (rate: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = rate;
    setPlaybackRate(rate);
    setShowSettings(false);
  };

  const toggleSubtitles = () => {
    setSubtitleEnabled(!subtitleEnabled);
  };

  const changeQuality = (newQuality: string) => {
    setQuality(newQuality);
    setShowSettings(false);
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
        muted={selectedAudioTrack === 'en'}
      ></video>

      {selectedAudioTrack === 'en' && englishAudioUrl && (
        <audio ref={audioRef} src={englishAudioUrl} preload="auto" hidden />
      )}

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
