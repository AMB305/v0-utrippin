// TypeScript definitions for Google Analytics gtag
declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'set' | 'event' | 'js',
      targetId?: string | Date,
      config?: {
        event_category?: string;
        event_label?: string;
        value?: number;
        [key: string]: any;
      }
    ) => void;
    dataLayer?: any[];
  }
}

export {};
