export type NotificationType = 'alert' | 'system' | 'news';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  relatedSymbol?: string;
}
