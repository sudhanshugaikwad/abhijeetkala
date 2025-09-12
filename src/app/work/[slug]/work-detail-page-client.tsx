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

function VideoItem({ item }: { item: ImagePlaceholder }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const handleMouseEnter = () => {
    videoRef.current?.play();
    setIsPlaying(true);
  };

  const handleMouseLeave = () => {
    videoRef.current?.pause();
    setIsPlaying(false);
  };
  
  return (
      <Link href={`/work/${item.id}`} className="group block">
          <div 
            className="aspect-video relative overflow-hidden rounded-lg border border-neutral-700/60 group-hover:border-neutral-500 transition-colors"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
              <video
                  ref={videoRef}
                  src={item.videoUrl}
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
               <div className="absolute inset-0 bg-black/20" />
               { !isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Play className="text-white h-12 w-12 opacity-80 group-hover:opacity-100 transition-opacity" />
                  </div>
                )}
          </div>
          <div className="mt-2">
              <h3 className="font-semibold text-white">{item.title}</h3>
              <p className="text-sm text-neutral-400">{item.client}</p>
          </div>
      </Link>
  );
}

export function WorkDetailPageClient({ item, relatedItems }: { item: ImagePlaceholder, relatedItems: ImagePlaceholder[] }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackRate, setPlaybackRate] = useState('1');
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [visibleItems, setVisibleItems] = useState(4);

  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const showMoreItems = () => {
    setVisibleItems((prev) => prev + 4);
  };

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
    
    containerRef.current?.addEventListener('mousemove', handleMouseMove);

    return () => {
        if (currentTimeout) {
            clearTimeout(currentTimeout);
        }
        containerRef.current?.removeEventListener('mousemove', handleMouseMove);
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
    <div className="bg-background min-h-screen text-white">
      <div ref={containerRef} className="relative w-full max-w-7xl mx-auto pt-4">
        <div className={`absolute top-0 left-0 right-0 z-20 flex justify-between items-center p-4 transition-opacity duration-300 ${isControlsVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold">{item.title}</h1>
              <p className="text-muted-foreground">{item.client}</p>
            </div>
            <Link href="/" className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors">
              <ArrowLeft size={16} />
              Back
            </Link>
        </div>

        <div className="aspect-video relative group bg-black rounded-lg overflow-hidden">
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
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl">
            <p className="text-lg text-neutral-300">{item.description}</p>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold tracking-tight text-white mb-8">More to explore</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedItems.slice(0, visibleItems).map(related => (
                <VideoItem key={related.id} item={related} />
            ))}
          </div>
           {visibleItems < relatedItems.length && (
            <div className="mt-12 text-center">
            <Button variant="link" className="text-neutral-400 hover:text-white" onClick={showMoreItems}>
                See more
            </Button>
            </div>
        )}
        </div>
      </div>

    </div>
  );
}
