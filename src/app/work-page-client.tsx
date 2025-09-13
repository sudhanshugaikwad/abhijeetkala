'use client';


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
import { PlaceHolderVideos } from '@/lib/placeholder-videos';

const formatTime = (timeInSeconds: number) => {
  if (isNaN(timeInSeconds) || !isFinite(timeInSeconds)) return '00:00';
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

function VideoItem({ item }: { item: (typeof PlaceHolderVideos)[0] }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState('1');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      if (video.duration > 0) {
        setProgress((video.currentTime / video.duration) * 100);
        setCurrentTime(video.currentTime);
      }
    }
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

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }

  const handleProgressChange = (value: number[]) => {
    if (videoRef.current && isFinite(duration) && duration > 0) {
      const newTime = (value[0] / 100) * duration;
      videoRef.current.currentTime = newTime;
      setProgress(value[0]);
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
      const muted = newVolume === 0;
      if (videoRef.current.muted !== muted) {
        videoRef.current.muted = muted;
      }
      setIsMuted(muted);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (videoRef.current) {
      const newMuted = !isMuted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
      if (newMuted) {
        setVolume(videoRef.current.volume);
      } else {
        if (videoRef.current.volume === 0) {
            const defaultVolume = 1;
            videoRef.current.volume = defaultVolume;
            setVolume(defaultVolume);
        }
      }
    }
  };

  const VolumeIcon = isMuted ? VolumeX : volume < 0.5 ? Volume1 : Volume2;
  
  return (
    <div className="group">
        <h2 className="text-lg font-medium mb-4 text-foreground/80">{item.videoTitle}</h2>
        <div 
          ref={containerRef}
          className="relative aspect-video overflow-hidden rounded-lg border border-border/20"
        >
          <video
              ref={videoRef}
              src={item.videoUrl}
              muted={isMuted}
              loop
              playsInline
              onClick={handleVideoClick}
              className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40">
            <div className="absolute bottom-0 left-0 right-0 p-3 flex flex-col gap-2 text-white">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-mono">{formatTime(currentTime)}</span>
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
                                className="w-24 h-full"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 hover:text-white" onClick={(e) => {e.preventDefault(); e.stopPropagation();}}>
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

export function WorkPageClient({ items }: { items: (typeof PlaceHolderVideos) }) {
  return (
    <div className="container mx-auto max-w-3xl">
        <div className="space-y-16">
            {items.map((item) => (
              <VideoItem key={item.id} item={item} />
            ))}
        </div>
    </div>
  );
}
