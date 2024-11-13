export interface RichContent {
  type: 'link' | 'image';
  content: string;
  thumbnail?: string;
  title?: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  date: Date;
  startTime?: string;
  endTime?: string;
  country: string;
  color: string;
  category: 'holiday' | 'cultural' | 'business' | 'personal' | 'other';
  tags: string[];
  richContent?: RichContent[];
}

export interface Country {
  code: string;
  name: string;
  flag: string;
  capital: string;
}

export interface ExportOptions {
  dateRange: {
    start: Date;
    end: Date;
  };
  countries: string[];
  categories: string[];
  includeRichContent: boolean;
  format: 'pdf' | 'presentation';
}