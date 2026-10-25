export interface Discipler {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

export interface Message {
  id: number;
  disciplerId: number;
  disciplerName: string;
  title: string;
  content: string;
  date: Date;
  audioUrl?: string;
}

export interface Blog {
  id: number;
  title: string;
  content: string;
  author: string;
  date: Date;
  imageUrl?: string;
}