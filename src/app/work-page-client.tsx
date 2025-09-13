'use client';

import type { ImagePlaceholder } from '@/lib/placeholder-images';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useRef, useState, useEffect } from 'react';
import {
  Play,
  Pause,
  Settings,
  Maximize,
  Minimize,
  Volume2,
  Volume1,
  VolumeX,
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';

const formatTime = (timeInSeconds: number) => {
  if (isNaN(timeInSeconds)) return '00:00';
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

function VideoItem({ item, index, setVideoRef }: { item: ImagePlaceholder, index: number, setVideoRef: (el: HTMLVideoElement | null, index: number) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isControlsVisible, setIsControlsVisible] = useState(false);
  
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState('1');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(0); // Muted by default
  const [isMuted, setIsMuted] = useState(true);
  
  useEffect(() => {
    setVideoRef(videoRef.current, index);
  }, [index, setVideoRef]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => setProgress((video.currentTime / video.duration) * 100);
    const setVideoDuration = () => {
        if (video.duration && isFinite(video.duration)) {
            setDuration(video.duration);
        }
    };
    
    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('loadedmetadata', setVideoDuration);
    video.addEventListener('durationchange', setVideoDuration);

    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      video.removeEventListener('timeupdate', updateProgress);
      video.removeEventListener('loadedmetadata', setVideoDuration);
      video.removeEventListener('durationchange', setVideoDuration);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleMouseEnter = () => {
    setIsControlsVisible(true);
    videoRef.current?.play();
    setIsPlaying(true);
  };

  const handleMouseLeave = () => {
    setIsControlsVisible(false);
    videoRef.current?.pause();
    setIsPlaying(false);
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
    }
  };

  const handlePlaybackRateChange = (rate: string) => {
    setPlaybackRate(rate);
    if(videoRef.current) {
      videoRef.current.playbackRate = Number(rate);
    }
  };

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const videoContainer = containerRef.current;
    if (!videoContainer) return;

    if (!document.fullscreenElement) {
        videoContainer.requestFullscreen().catch(err => {
            alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
    } else {
        document.exitFullscreen();
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
      } else if (newVolume === 0 && !isMuted) {
        setIsMuted(true);
        videoRef.current.muted = true;
      }
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (videoRef.current) {
      const newMuted = !videoRef.current.muted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
      if (newMuted) {
        setVolume(0);
      } else {
        // If unmuting and volume was 0, set to a default volume
        if (videoRef.current.volume === 0) {
          videoRef.current.volume = 1;
          setVolume(1);
        } else {
          setVolume(videoRef.current.volume);
        }
      }
    }
  };

  const VolumeIcon = isMuted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;
  
  return (
    <div className="group">
        <h2 className="text-lg font-medium mb-4 text-foreground/80">{item.title}</h2>
        <div 
          ref={containerRef}
          className="relative aspect-video overflow-hidden rounded-lg border border-border/20 hover:border-border/60 transition-colors duration-300"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Link href={`/work/${item.id}`} className="block w-full h-full">
            <video
                ref={videoRef}
                src={item.videoUrl}
                muted
                loop
                playsInline
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </Link>
          <div className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${isControlsVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute bottom-0 left-0 right-0 p-3 flex flex-col gap-2 text-white">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-mono">{formatTime(videoRef.current?.currentTime ?? 0)}</span>
                    <Slider
                        value={[progress]}
                        onValueChange={handleProgressChange}
                        max={100}
                        step={0.1}
                        className="w-full"
                    />
                    <span className="text-xs font-mono">{formatTime(duration)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 hover:text-white" onClick={togglePlay}>
                            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                        </Button>
                         <div className="flex items-center gap-2 group/volume">
                            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 hover:text-white" onClick={toggleMute}>
                                <VolumeIcon size={20} />
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
                                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 hover:text-white" onClick={(e) => e.stopPropagation()}>
                                    <Settings size={20} />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent onClick={(e) => e.stopPropagation()} className="bg-background/80 border-border text-foreground w-40">
                                <DropdownMenuLabel>Playback Speed</DropdownMenuLabel>
                                <DropdownMenuRadioGroup value={playbackRate} onValueChange={handlePlaybackRateChange}>
                                    <DropdownMenuRadioItem value="0.5">0.5x</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="1">Normal</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="1.5">1.5x</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="2">2x</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                                <DropdownMenuSeparator className="bg-border" />
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
                           {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                        </Button>
                    </div>
                </div>
            </div>
          </div>
        </div>
    </div>
  );
}

export function WorkPageClient({ items }: { items: ImagePlaceholder[] }) {
  const [visibleItems, setVisibleItems] = useState(4);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const showMoreItems = () => {
    setVisibleItems((prev) => prev + 4);
  };
  
  const setVideoRef = (el: HTMLVideoElement | null, index: number) => {
    videoRefs.current[index] = el;
  }

  return (
    <div className="container mx-auto max-w-3xl">
        <div className="space-y-16">
            {items.slice(0, visibleItems).map((item, index) => (
              <VideoItem key={item.id} item={item} index={index} setVideoRef={setVideoRef} />
            ))}
        </div>
        {visibleItems < items.length && (
            <div className="mt-16 text-center">
            <Button variant="link" className="text-muted-foreground hover:text-foreground" onClick={showMoreItems}>
                See more
            </Button>
            </div>
        )}
    </div>
  );
}
