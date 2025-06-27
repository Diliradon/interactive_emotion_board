import React, { useState } from 'react';

import { observer } from 'mobx-react-lite';

import { emotionStore } from 'shared/stores/emotion.store';

import { EmotionCard } from '../emotion-card';

export const EmotionBoard = observer(() => {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [draggedOverItem, setDraggedOverItem] = useState<string | null>(null);

  const handleDragStart = (event: React.DragEvent, emotionId: string) => {
    setDraggedItem(emotionId);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (event: React.DragEvent, emotionId: string) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';

    if (draggedItem && draggedItem !== emotionId) {
      setDraggedOverItem(emotionId);
    }
  };

  const handleDragLeave = () => {
    setDraggedOverItem(null);
  };

  const handleDrop = (event: React.DragEvent, targetEmotionId: string) => {
    event.preventDefault();

    if (!draggedItem || draggedItem === targetEmotionId) {
      return;
    }

    const draggedIndex = emotionStore.emotions.findIndex(
      emotion => emotion.id === draggedItem,
    );
    const targetIndex = emotionStore.emotions.findIndex(
      emotion => emotion.id === targetEmotionId,
    );

    if (draggedIndex !== -1 && targetIndex !== -1) {
      emotionStore.reorderEmotions(draggedIndex, targetIndex);
    }

    setDraggedItem(null);
    setDraggedOverItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDraggedOverItem(null);
  };

  // Empty state
  if (emotionStore.emotions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-16">
        <div className="mb-4 text-6xl">😊</div>
        <h3 className="mb-2 text-xl font-semibold text-gray-700">
          No emotions yet
        </h3>
        <p className="max-w-md text-center text-gray-500">
          Start tracking your daily emotions by clicking the &quot;Add
          Emotion&quot; button above.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Grid Layout */}
      <div className="hidden grid-cols-1 gap-4 sm:grid-cols-2 md:grid lg:grid-cols-3 xl:grid-cols-4">
        {emotionStore.emotions.map(emotion => (
          <div
            key={emotion.id}
            draggable
            onDragStart={event => handleDragStart(event, emotion.id)}
            onDragOver={event => handleDragOver(event, emotion.id)}
            onDragLeave={handleDragLeave}
            onDrop={event => handleDrop(event, emotion.id)}
            onDragEnd={handleDragEnd}
            className={`cursor-grab transition-all duration-200 active:cursor-grabbing ${draggedItem === emotion.id ? 'rotate-2 scale-105 opacity-50' : ''} ${draggedOverItem === emotion.id ? 'scale-105 ring-2 ring-blue-400 ring-opacity-50' : ''} hover:scale-102 hover:shadow-lg`}
          >
            <EmotionCard
              emotion={emotion}
              onDelete={emotionStore.deleteEmotion}
              className="h-full"
            />
          </div>
        ))}
      </div>

      {/* Mobile List Layout */}
      <div className="space-y-3 md:hidden">
        {emotionStore.emotions.map(emotion => (
          <div
            key={emotion.id}
            draggable
            onDragStart={event => handleDragStart(event, emotion.id)}
            onDragOver={event => handleDragOver(event, emotion.id)}
            onDragLeave={handleDragLeave}
            onDrop={event => handleDrop(event, emotion.id)}
            onDragEnd={handleDragEnd}
            className={`cursor-grab transition-all duration-200 active:cursor-grabbing ${draggedItem === emotion.id ? 'scale-105 opacity-50' : ''} ${draggedOverItem === emotion.id ? 'scale-105 ring-2 ring-blue-400 ring-opacity-50' : ''} `}
          >
            <EmotionCard
              emotion={emotion}
              onDelete={emotionStore.deleteEmotion}
            />
          </div>
        ))}
      </div>

      {/* Drag Instructions */}
      {emotionStore.emotions.length > 1 && !draggedItem && (
        <div className="py-4 text-center">
          <p className="text-xs text-gray-400">
            💡 Drag and drop to reorder your emotions
          </p>
        </div>
      )}

      {/* Active drag feedback */}
      {draggedItem && (
        <div className="fixed left-1/2 top-4 z-50 -translate-x-1/2 transform">
          <div className="rounded-full bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-lg">
            Moving emotion... Drop to reorder
          </div>
        </div>
      )}
    </div>
  );
});
