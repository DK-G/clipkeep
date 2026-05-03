'use client';

import { useState, useEffect } from 'react';

export interface HistoryItem {
  id: string;
  platform: string;
  thumbnail_url: string;
  title: string;
  created_at: string;
  source_url?: string;
  author_name?: string;
  author_handle?: string;
}

const STORAGE_KEY = 'clipkeep_history';
const MAX_ITEMS = 12;

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse history:', e);
      }
    }
  }, []);

  const addToHistory = (item: HistoryItem) => {
    setHistory((prev) => {
      // Remove duplicate if it exists
      const filtered = prev.filter((i) => i.id !== item.id);
      // Add to front and limit
      const next = [item, ...filtered].slice(0, MAX_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const clearHistory = () => {
    localStorage.removeItem(STORAGE_KEY);
    setHistory([]);
  };

  return { history, addToHistory, clearHistory };
}
