/**
 * Talqa Net - Application Types & Domain Contracts
 */

export type PackageCategory = 'hours' | 'daily' | 'weekly' | 'monthly';

export interface CardPackage {
  id: string;
  name: string;
  category: PackageCategory;
  categoryLabel: string;
  price: number;
  currency: string;
  durationLabel: string;
  validityDaysLabel: string;
  dataLimitLabel: string;
  dataLimitMB: number;
  speedLimitLabel: string;
  badge?: string;
  popular?: boolean;
  colorTheme: 'blue' | 'emerald' | 'amber' | 'indigo' | 'violet';
  features: string[];
}

export interface DistributorPoint {
  id: string;
  name: string;
  ownerName: string;
  neighborhood: string;
  city: string;
  address: string;
  phone: string;
  whatsapp: string;
  openHours: string;
  lat: number;
  lng: number;
  isVerified: boolean;
  isPlaceholder: boolean; // Flagged true until confirmed by network owner in Phase 2
  availableCards: string[];
}

export interface NetworkAnnouncement {
  id: string;
  title: string;
  content: string;
  type: 'promotion' | 'info' | 'maintenance';
  date: string;
  active: boolean;
  linkText?: string;
  linkUrl?: string;
}

export interface LocalMediaItem {
  id: string;
  title: string;
  category: 'movies' | 'games' | 'apps';
  fileSize: string;
  downloadUrl: string;
  iconName: string;
  description: string;
  isLocalOnly: boolean;
}

export interface LiveChannel {
  id: string;
  name: string;
  hlsUrl: string;
  matchTitle?: string;
  tournament?: string;
  commentator?: string;
  status: 'live' | 'upcoming' | 'offline';
  isLocalOnly: boolean;
}

export interface LoyaltyRules {
  requiredCardsCount: number; // 10 consumed cards to enter lucky wheel
  prizeTierDescription: string;
}
