/* eslint-disable no-magic-numbers */
import { FC, useEffect, useRef, useState } from 'react';

import { clsx } from 'clsx';
import { observer } from 'mobx-react-lite';

import { Emotion } from 'shared/stores/emotion.store';
import { Button } from 'shared/ui';

interface EmotionCardProps {
  emotion: Emotion;
  onDelete: (id: string) => void;
  className?: string;
}

export const EmotionCard: FC<EmotionCardProps> = observer(
  ({ emotion, onDelete, className }) => {
    const [isSwipeActive, setIsSwipeActive] = useState(false);
    const [swipeOffset, setSwipeOffset] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const startXRef = useRef(0);
    const isDraggingRef = useRef(false);

    const formatTime = (timestamp: number) => {
      return new Date(timestamp).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    };

    const handleTouchStart = (event: React.TouchEvent) => {
      startXRef.current = event.touches[0].clientX;
      isDraggingRef.current = true;
      setIsSwipeActive(true);
    };

    const handleTouchMove = (event: React.TouchEvent) => {
      if (!isDraggingRef.current) {
        return;
      }

      const currentX = event.touches[0].clientX;
      const diff = startXRef.current - currentX;

      if (diff > 0) {
        setSwipeOffset(Math.min(diff, 100));
      }
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
      setIsSwipeActive(false);

      if (swipeOffset > 50) {
        handleDelete();
      } else {
        setSwipeOffset(0);
      }
    };

    const handleDelete = () => {
      setIsDeleting(true);
      setTimeout(() => {
        onDelete(emotion.id);
      }, 150);
    };

    useEffect(() => {
      const card = cardRef.current;

      if (!card) {
        return;
      }

      const updateTransform = () => {
        if (swipeOffset > 0) {
          card.style.transform = `translateX(-${swipeOffset}px)`;
          card.style.opacity = `${1 - swipeOffset / 100}`;
        } else {
          card.style.transform = '';
          card.style.opacity = '';
        }
      };

      const animationFrame = requestAnimationFrame(updateTransform);

      return () => {
        cancelAnimationFrame(animationFrame);
      };
    }, [swipeOffset]);

    return (
      <div
        ref={cardRef}
        className={clsx(
          'relative overflow-hidden rounded-lg bg-white shadow-md transition-all duration-150',
          'transform hover:shadow-lg',
          isDeleting && 'scale-95 animate-pulse opacity-0',
          className,
        )}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Card Content */}
        <div className={clsx('p-4', emotion.color)}>
          <div className="mb-2 flex items-center justify-between rounded-lg">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{emotion.icon}</span>
              <h3 className="text-lg font-semibold text-white">
                {emotion.type}
              </h3>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              className="hidden rounded-full bg-white/20 p-1 transition-colors hover:bg-white/30 md:flex"
              aria-label="Delete emotion"
            >
              <svg
                className="h-4 w-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </Button>
          </div>

          {emotion.comment && (
            <p className="mb-3 text-sm leading-relaxed text-white/90">
              {emotion.comment}
            </p>
          )}

          <p className="text-xs text-white/70">
            {formatTime(emotion.timestamp)}
          </p>
        </div>

        {isSwipeActive && (
          <div className="absolute inset-y-0 right-0 flex w-16 items-center justify-center bg-red-500 md:hidden">
            <svg
              className="h-6 w-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </div>
        )}
      </div>
    );
  },
);
