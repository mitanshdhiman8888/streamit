import React, { useState, useEffect } from 'react';

interface Subtitle {
  id: string;
  start: number;
  end: number;
  text: string;
}

interface SubtitlesProps {
  subtitleUrl: string;
  currentTime: number;
}

const Subtitles: React.FC<SubtitlesProps> = ({ subtitleUrl, currentTime }) => {
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [currentSubtitle, setCurrentSubtitle] = useState<Subtitle | null>(null);

  // Parse SRT file
  useEffect(() => {
    const fetchSubtitles = async () => {
      try {
        const response = await fetch(subtitleUrl);
        const text = await response.text();
        const parsedSubtitles = parseSrt(text);
        setSubtitles(parsedSubtitles);
      } catch (error) {
        console.error('Error loading subtitles:', error);
      }
    };

    fetchSubtitles();
  }, [subtitleUrl]);

  // Find current subtitle based on time
  useEffect(() => {
    const subtitle = subtitles.find(
      sub => currentTime >= sub.start && currentTime <= sub.end
    ) || null;
    
    setCurrentSubtitle(subtitle);
  }, [currentTime, subtitles]);

  // Parse SRT format
  const parseSrt = (srtText: string): Subtitle[] => {
    const srtLines = srtText.trim().split('\n\n');
    const result: Subtitle[] = [];

    for (const block of srtLines) {
      const lines = block.split('\n');
      if (lines.length < 3) continue;

      const id = lines[0];
      const timeInfo = lines[1];
      const textLines = lines.slice(2);
      
      const [startTime, endTime] = timeInfo.split(' --> ').map(timeToSeconds);
      
      result.push({
        id,
        start: startTime,
        end: endTime,
        text: textLines.join(' ')
      });
    }

    return result;
  };

  // Convert time format (00:00:00,000) to seconds
  const timeToSeconds = (timeString: string): number => {
    const [time, milliseconds] = timeString.split(',');
    const [hours, minutes, seconds] = time.split(':').map(Number);
    
    return hours * 3600 + minutes * 60 + seconds + Number(milliseconds) / 1000;
  };

  if (!currentSubtitle) {
    return null;
  }

  return (
    <div className="absolute bottom-16 left-0 right-0 flex justify-center mb-4 pointer-events-none">
      <div className="bg-black/70 px-4 py-2 rounded-md max-w-2xl text-center">
        <p className="text-lg">{currentSubtitle.text}</p>
      </div>
    </div>
  );
};

export default Subtitles;