import { useState, useEffect } from 'react';

export const useSavedProgress = (showId: string, seasonId: string, episodeId: string) => {
  const [savedTime, setSavedTime] = useState(0);
  
  // Generate a unique key for this episode
  const progressKey = `streamflix-progress-${showId}-${seasonId}-${episodeId}`;
  
  // Load saved progress on mount
  useEffect(() => {
    const loadProgress = () => {
      try {
        const savedProgress = localStorage.getItem(progressKey);
        if (savedProgress) {
          const progress = parseFloat(savedProgress);
          setSavedTime(progress);
        }
      } catch (error) {
        console.error('Error loading saved progress:', error);
      }
    };
    
    loadProgress();
  }, [progressKey]);
  
  // Save progress
  const saveProgress = (time: number) => {
    try {
      localStorage.setItem(progressKey, time.toString());
      setSavedTime(time);
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };
  
  return { savedTime, saveProgress };
};