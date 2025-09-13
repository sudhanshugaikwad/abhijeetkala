import data from './placeholder-videos.json';

export type VideoPlaceholder = {
  id: string;
  videoTitle: string;
  client: string;
  category: string;
  description: string;
  videoUrl: string;
  imageHint: string;
};

export const PlaceHolderVideos: VideoPlaceholder[] = data.placeholderVideos;
