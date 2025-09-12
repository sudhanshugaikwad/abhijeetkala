'use client';

import type { ImagePlaceholder } from '@/lib/placeholder-images';
import Link from 'next/link';
import {
  ArrowLeft,
  Play,
  Pause,
  Settings,
  Volume2,
  Volume1,
  VolumeX,
  Maximize,
  Minimize,
} from 'lucide-react';
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
import { Slider } from '@/components/ui/slider';

const formatTime = (timeInSeconds: number) => {
  if (isNaN(timeInSeconds)) return '00:00';
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export function WorkDetailPageClient({ item }: { item: ImagePlaceholder }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackRate, setPlaybackRate] = useState('1');
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

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
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      setProgress((video.currentTime / video.duration) * 100);
    };
    const setVideoDuration = () => {
      if (video.duration && isFinite(video.duration)) {
        setDuration(video.duration);
      }
    };

    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('loadedmetadata', setVideoDuration);
    video.addEventListener('durationchange', setVideoDuration);

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    handleMouseMove(); // Show controls on initial load
    const currentTimeout = controlsTimeoutRef.current;
    
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
        if (currentTimeout) {
            clearTimeout(currentTimeout);
        }
        window.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
        if (video) {
          video.removeEventListener('timeupdate', updateProgress);
          video.removeEventListener('loadedmetadata', setVideoDuration);
          video.removeEventListener('durationchange', setVideoDuration);
        }
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

  const handleProgressChange = (value: number[]) => {
    if (videoRef.current) {
      const newTime = (value[0] / 100) * duration;
      videoRef.current.currentTime = newTime;
      setProgress(value[0]);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    if (videoRef.current) {
      const newVolume = value[0];
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      if (newVolume > 0 && isMuted) {
        setIsMuted(false);
        videoRef.current.muted = false;
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
      if (!isMuted && volume === 0) {
        setVolume(1); // Unmute to full volume if it was 0
        videoRef.current.volume = 1;
      }
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      containerRef.current.requestFullscreen().catch(err => {
        alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const VolumeIcon = isMuted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <div ref={containerRef} className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4" onMouseMove={handleMouseMove}>
      <div className="w-full max-w-5xl mx-auto">
        <div className={`flex justify-between items-center mb-2 transition-opacity duration-300 ${isControlsVisible ? 'opacity-100' : 'opacity-0'}`}>
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
          <div className={`absolute bottom-0 left-0 right-0 p-3 flex flex-col gap-2 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300 ${isControlsVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex items-center gap-2">
              <span className="text-white text-xs font-mono">{formatTime(videoRef.current?.currentTime ?? 0)}</span>
              <Slider
                value={[progress]}
                onValueChange={handleProgressChange}
                max={100}
                step={0.1}
                className="w-full"
              />
              <span className="text-white text-xs font-mono">{formatTime(duration)}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 hover:text-white" onClick={togglePlay}>
                  {isPlaying ? <Pause /> : <Play />}
                </Button>
                <div className="flex items-center gap-2 group/volume">
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 hover:text-white" onClick={toggleMute}>
                    <VolumeIcon />
                  </Button>
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    onValueChange={handleVolumeChange}
                    max={1}
                    step={0.05}
                    className="w-24 h-full hidden group-hover/volume:block"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
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

                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 hover:text-white" onClick={toggleFullscreen}>
                  {isFullscreen ? <Minimize /> : <Maximize />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

    