/* eslint-disable no-magic-numbers */
import { makeAutoObservable } from 'mobx';

export interface Emotion {
  id: string;
  type: EmotionType;
  comment: string;
  timestamp: number;
  color: string;
  icon: string;
}

export enum EmotionType {
  JOY = 'Joy',
  SADNESS = 'Sadness',
  ANGER = 'Anger',
  SURPRISE = 'Surprise',
  CALM = 'Calm',
  LOVE = 'Love',
  FEAR = 'Fear',
  EXCITEMENT = 'Excitement',
}

export const EMOTION_CONFIG: Record<
  EmotionType,
  { color: string; icon: string }
> = {
  [EmotionType.JOY]: { color: 'bg-yellow-400', icon: '😊' },
  [EmotionType.SADNESS]: { color: 'bg-blue-400', icon: '😢' },
  [EmotionType.ANGER]: { color: 'bg-red-400', icon: '😠' },
  [EmotionType.SURPRISE]: { color: 'bg-purple-400', icon: '😮' },
  [EmotionType.CALM]: { color: 'bg-green-400', icon: '😌' },
  [EmotionType.LOVE]: { color: 'bg-pink-400', icon: '❤️' },
  [EmotionType.FEAR]: { color: 'bg-gray-400', icon: '😨' },
  [EmotionType.EXCITEMENT]: { color: 'bg-orange-400', icon: '🤩' },
};

export class EmotionStore {
  emotions: Emotion[] = [];

  isAddModalOpen = false;

  currentView: 'board' | 'stats' = 'board';

  statsFilter: 'today' | 'week' | 'month' = 'today';

  constructor() {
    makeAutoObservable(this);
    this.loadFromStorage();
  }

  // Actions
  addEmotion = (type: EmotionType, comment: string) => {
    const config = EMOTION_CONFIG[type];
    const newEmotion: Emotion = {
      id: crypto.randomUUID(),
      type,
      comment,
      timestamp: Date.now(),
      color: config.color,
      icon: config.icon,
    };

    this.emotions.unshift(newEmotion);
    this.saveToStorage();
    this.closeAddModal();
  };

  deleteEmotion = (id: string) => {
    this.emotions = this.emotions.filter(emotion => emotion.id !== id);
    this.saveToStorage();
  };

  reorderEmotions = (startIndex: number, endIndex: number) => {
    const result = Array.from(this.emotions);
    const [removed] = result.splice(startIndex, 1);

    result.splice(endIndex, 0, removed);
    this.emotions = result;
    this.saveToStorage();
  };

  clearAllEmotions = () => {
    this.emotions = [];
    this.saveToStorage();
  };

  openAddModal = () => {
    this.isAddModalOpen = true;
  };

  closeAddModal = () => {
    this.isAddModalOpen = false;
  };

  setCurrentView = (view: 'board' | 'stats') => {
    this.currentView = view;
  };

  setStatsFilter = (filter: 'today' | 'week' | 'month') => {
    this.statsFilter = filter;
  };

  get filteredEmotionsForStats() {
    const now = Date.now();
    const today = new Date().setHours(0, 0, 0, 0);
    const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
    const monthAgo = now - 30 * 24 * 60 * 60 * 1000;

    switch (this.statsFilter) {
      case 'today':
        return this.emotions.filter(emotion => emotion.timestamp >= today);

      case 'week':
        return this.emotions.filter(emotion => emotion.timestamp >= weekAgo);

      case 'month':
        return this.emotions.filter(emotion => emotion.timestamp >= monthAgo);

      default:
        return this.emotions;
    }
  }

  get emotionStats() {
    const filtered = this.filteredEmotionsForStats;
    const stats: Record<EmotionType, number> = {} as Record<
      EmotionType,
      number
    >;

    Object.values(EmotionType).forEach(type => {
      stats[type] = filtered.filter(emotion => emotion.type === type).length;
    });

    return stats;
  }

  static getCurrentTheme() {
    const hour = new Date().getHours();

    if (hour < 12) {
      return 'morning';
    }

    if (hour < 18) {
      return 'afternoon';
    }

    return 'evening';
  }

  private saveToStorage = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('emotions', JSON.stringify(this.emotions));
    }
  };

  private loadFromStorage = () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('emotions');

      if (stored) {
        try {
          this.emotions = JSON.parse(stored);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Failed to load emotions from storage:', error);
        }
      }
    }
  };
}

export const emotionStore = new EmotionStore();
