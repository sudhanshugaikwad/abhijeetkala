import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  title: string;
  client: string;
  category: string;
  description: string;
  imageUrl: string;
  videoUrl: string;
  imageHint: string;
};

export const PlaceHolderImages: ImagePlaceholder[] = data.placeholderImages;
