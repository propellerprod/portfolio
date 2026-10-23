export interface Project {
  id: string;
  title: string;
  category: string;
  cover?: string;
  thumbnail_url?: string;
  video_url?: string;
  video?: string;
  video_source?: string;
  images?: string[];
  links?: string[];
  client?: string;
  format?: string;
  added?: string;
  task?: string;
  idea?: string;
  process?: string;
}

export interface Collab {
  name: string;
  img?: string;
  links?: string[];
}

export interface VideoMeta {
  success: boolean;
  service: string;
  source: string;
  video_id: string;
  is_shorts: boolean;
  thumbnail: string | null;
  thumbnail_url: string | null;
  embed_url: string;
  error?: string;
}

export interface ServiceItem {
  n: string;
  name: string;
  tags: string;
  img: string;
}

export interface PriceItem {
  name: string;
  val: string;
  forOne: string;
  inc: string[];
  hot: boolean;
}
