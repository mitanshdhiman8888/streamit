import { Show } from '../types';
import { sampleShows } from './sampleData';

// Simulate API calls with mock data
export const fetchShows = async (): Promise<Show[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return sampleShows;
};

export const getShow = async (showId: string): Promise<Show> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const show = sampleShows.find(show => show.id === showId);
  if (!show) {
    throw new Error(`Show not found: ${showId}`);
  }
  
  return show;
};