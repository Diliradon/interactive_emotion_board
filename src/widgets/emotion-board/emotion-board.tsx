import React, { FC, useEffect, useRef, useState } from 'react';

import {
  draggable,
  dropTargetForElements,
  monitorForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { clsx } from 'clsx';
import { observer } from 'mobx-react-lite';

import { emotionStore } from 'shared/stores/emotion.store';

import { EmotionCard } from '../emotion-card';

interface DragData extends Record<string | symbol, unknown> {
  type: 'emotion';
  emotionId: string;
  index: number;
}

export const EmotionBoard = observer(() => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  useEffect(() => {
    return monitorForElements({
      onDragStart({ source }) {
        const data = source.data as unknown as DragData;

        if (data.type === 'emotion') {
          setDraggedIndex(data.index);
        }
      },
      onDrop({ source, location }) {
        const sourceData = source.data as DragData;
        const target = location.current.dropTargets[0];

        if (target && sourceData.type === 'emotion') {
          const targetData = target.data as DragData;

          if (sourceData.index !== targetData.index) {
            emotionStore.reorderEmotions(sourceData.index, targetData.index);
          }
        }

        setDraggedIndex(null);
        setDragOverIndex(null);
      },
    });
  }, []);

  const isEmpty = emotionStore.emotions.length === 0;

  if (isEmpty) {
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
      <div className="hidden grid-cols-1 gap-4 sm:grid-cols-2 md:grid lg:grid-cols-3 xl:grid-cols-4">
        {emotionStore.emotions.map((emotion, index) => (
          <DraggableEmotionItem
            key={emotion.id}
            emotion={emotion}
            index={index}
            isDragged={draggedIndex === index}
            isDraggedOver={dragOverIndex === index && draggedIndex !== index}
            onDragOver={setDragOverIndex}
          />
        ))}
      </div>

      {/* Mobile List Layout */}
      <div className="space-y-3 md:hidden">
        {emotionStore.emotions.map((emotion, index) => (
          <div
            key={emotion.id}
            className="overflow-hidden rounded-lg bg-transparent"
          >
            <DraggableEmotionItem
              emotion={emotion}
              index={index}
              isDragged={draggedIndex === index}
              isDraggedOver={dragOverIndex === index && draggedIndex !== index}
              onDragOver={setDragOverIndex}
            />

            {/* Drag Indicator */}
            {dragOverIndex === index && draggedIndex !== index && (
              <div className="-my-1 mx-4 h-1 rounded-full bg-blue-400 transition-all duration-200" />
            )}
          </div>
        ))}
      </div>

      {/* Drag Instructions */}
      {emotionStore.emotions.length > 1 && draggedIndex === null && (
        <div className="py-4 text-center">
          <p className="text-xs text-gray-400">
            💡 Drag and drop to reorder your emotions
          </p>
        </div>
      )}
    </div>
  );
});

interface DraggableEmotionItemProps {
  emotion: any;
  index: number;
  isDragged: boolean;
  isDraggedOver: boolean;
  onDragOver: (index: number | null) => void;
}

const DraggableEmotionItem: FC<DraggableEmotionItemProps> = ({
  emotion,
  index,
  isDragged,
  isDraggedOver,
  onDragOver,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const dragData: DragData = {
      type: 'emotion',
      emotionId: emotion.id,
      index,
    };

    const cleanupDraggable = draggable({
      element,
      getInitialData: () => dragData as Record<string | symbol, unknown>,
    });

    const cleanupDropTarget = dropTargetForElements({
      element,
      getData: () => dragData as Record<string | symbol, unknown>,
      onDragEnter: () => onDragOver(index),
      onDragLeave: () => onDragOver(null),
    });

    return () => {
      cleanupDraggable();
      cleanupDropTarget();
    };
  }, [emotion.id, index, onDragOver]);

  return (
    <div
      ref={ref}
      className={clsx(
        'h-full bg-transparent transition-all',
        isDragged && 'scale-95 opacity-50',
        isDraggedOver && 'scale-100 transform bg-transparent',
      )}
    >
      <EmotionCard
        emotion={emotion}
        onDelete={emotionStore.deleteEmotion}
        className="cursor-grab active:cursor-grabbing"
      />
    </div>
  );
};
