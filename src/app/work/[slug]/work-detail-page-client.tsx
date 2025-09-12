'use client';

import type { ImagePlaceholder } from '@/lib/placeholder-images';
import Link from 'next/link';
import { ArrowLeft, Play, Pause, Settings } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';

export function WorkDetailPageClient({ item }: { item: ImagePlaceholder }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackRate, setPlaybackRate] = useState('1');
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = Number(playbackRate);
    }
  }, [playbackRate]);
  
  const handleMouseMove = () => {
    setIsControlsVisible(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setIsControlsVisible(false);
    }, 3000);
  };

  useEffect(() => {
    handleMouseMove(); // Show controls on initial load
    const currentTimeout = controlsTimeoutRef.current;
    
    // Add event listener to window
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
        if (currentTimeout) {
            clearTimeout(currentTimeout);
        }
        window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-5xl mx-auto">
        <div className={`flex justify-between items-center mb-4 transition-opacity duration-300 ${isControlsVisible ? 'opacity-100' : 'opacity-0'}`}>
          <h1 className="text-lg font-semibold text-white">{item.title}</h1>
          <Link href="/" className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors">
            <ArrowLeft size={16} />
            Back to home
          </Link>
        </div>
        <div className="aspect-video relative group">
          <video
            ref={videoRef}
            autoPlay
            loop
            className="w-full h-full object-contain"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onClick={togglePlay}
          >
            <source src={item.videoUrl} type="video/mp4" />
          </video>
          <div className={`absolute bottom-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-t from-black/50 to-transparent transition-opacity duration-300 ${isControlsVisible ? 'opacity-100' : 'opacity-0'}`}>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 hover:text-white" onClick={togglePlay}>
              {isPlaying ? <Pause /> : <Play />}
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 hover:text-white">
                  <Settings />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40 bg-black/80 border-gray-700 text-white">
                <DropdownMenuLabel>Playback Speed</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={playbackRate} onValueChange={setPlaybackRate}>
                  <DropdownMenuRadioItem value="0.5">0.5x</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="1">Normal</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="1.5">1.5x</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="2">2x</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
                <DropdownMenuSeparator className="bg-gray-700"/>
                <DropdownMenuLabel>Quality</DropdownMenuLabel>
                <DropdownMenuRadioGroup value="auto">
                  <DropdownMenuRadioItem value="1080p">1080p</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="720p">720p</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="480p">480p</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="auto">Auto</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}
