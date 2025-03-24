import type { Verse } from './data';
import moodsJson from '@/assets/data/moods.json';

// Re-export the static moods data
export const moods = moodsJson;

export interface Mood {
  id: string;
  label: string;
  description: string;
  icon: string;
}

export interface MoodData {
  moods: Array<{
    name: string;
    description: string;
    verses: Array<{
      chapter: number;
      verse: number;
      theme: string;
    }>;
  }>;
}

// Load and validate moods data
export const loadMoodsData = async (): Promise<MoodData | null> => {
  try {
    const response = await fetch('/assets/data/moods.json');
    if (!response.ok) {
      throw new Error(`Failed to load moods data: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();

    if (validateMoodData(data)) {
      return data;
    }
    return null;
  } catch (error) {
    console.error('Error loading moods data:', error);
    return null;
  }
};

export const validateMoodData = (data: any): data is MoodData => {
  if (!data || !Array.isArray(data.moods)) {
    console.error('Invalid moods data structure:', data);
    return false;
  }

  for (const mood of data.moods) {
    if (!mood.name || !mood.description || !Array.isArray(mood.verses)) {
      console.error('Invalid mood structure:', mood);
      return false;
    }

    for (const verse of mood.verses) {
      if (!Number.isInteger(verse.chapter) || !Number.isInteger(verse.verse)) {
        console.error('Invalid verse reference:', verse);
        return false;
      }
    }
  }

  return true;
};