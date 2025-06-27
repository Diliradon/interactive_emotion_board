import { FC, useEffect, useRef, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { observer } from 'mobx-react-lite';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { cn } from 'shared/lib';
import { EMOTION_CONFIG, EmotionType } from 'shared/stores/emotion.store';
import { Button } from 'shared/ui';

// Validation schema
const emotionFormSchema = z.object({
  emotion: z.nativeEnum(EmotionType, {
    required_error: 'Please select an emotion',
  }),
  comment: z
    .string()
    .max(200, 'Comment must be 200 characters or less')
    .optional(),
});

type EmotionFormData = z.infer<typeof emotionFormSchema>;

interface AddEmotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (type: EmotionType, comment: string) => void;
}

export const AddEmotionModal: FC<AddEmotionModalProps> = observer(
  ({ isOpen, onClose, onAdd }) => {
    const {
      register,
      handleSubmit,
      watch,
      setValue,
      reset,
      formState: { errors, isValid },
    } = useForm<EmotionFormData>({
      resolver: zodResolver(emotionFormSchema),
      mode: 'onChange',
      defaultValues: {
        comment: '',
      },
    });

    const selectedEmotion = watch('emotion');
    const comment = watch('comment') || '';

    // Add scroll arrow state and ref
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showScrollArrow, setShowScrollArrow] = useState(false);

    const onSubmit = (data: EmotionFormData) => {
      if (data.emotion) {
        onAdd(
          data.emotion,
          data.comment?.trim() || 'Here could be your advetisement!',
        );
        handleClose();
      }
    };

    const handleClose = () => {
      reset();
      onClose();
    };

    // Check if content is scrollable and handle scroll events
    useEffect(() => {
      const container = scrollContainerRef.current;

      if (!container) {
        return;
      }

      const checkScrollable = () => {
        const { scrollTop, scrollHeight, clientHeight } = container;
        const canScrollDown =
          scrollHeight > clientHeight &&
          // eslint-disable-next-line no-magic-numbers
          scrollTop < scrollHeight - clientHeight - 10;

        setShowScrollArrow(canScrollDown);
      };

      checkScrollable();
      container.addEventListener('scroll', checkScrollable);

      // Check on window resize as well
      window.addEventListener('resize', checkScrollable);

      return () => {
        container.removeEventListener('scroll', checkScrollable);
        window.removeEventListener('resize', checkScrollable);
      };
    }, [isOpen]);

    // Smooth scroll down function
    const handleScrollDown = () => {
      const container = scrollContainerRef.current;

      if (!container) {
        return;
      }

      container.scrollBy({
        top: 200,
        behavior: 'smooth',
      });
    };

    if (!isOpen) {
      return null;
    }

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        />

        <div
          ref={scrollContainerRef}
          className="zoom-in-95 relative max-h-[90vh] w-full max-w-md animate-in overflow-y-auto rounded-xl bg-white shadow-2xl duration-200"
        >
          <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Add Emotion</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="rounded-full p-2 transition-colors hover:bg-gray-100"
                aria-label="Close modal"
              >
                <svg
                  className="h-5 w-5 text-gray-500"
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

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-6">
                <label className="mb-3 block text-sm font-medium text-gray-700">
                  How are you feeling?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.values(EmotionType).map(type => {
                    const config = EMOTION_CONFIG[type];
                    const isSelected = selectedEmotion === type;

                    return (
                      <Button
                        key={type}
                        variant="ghost"
                        onClick={() =>
                          setValue('emotion', type, { shouldValidate: true })
                        }
                        className={cn(
                          'h-full rounded-lg border-2 p-4 transition-all duration-200 hover:scale-105',
                          'flex flex-col items-center space-y-2',
                          isSelected
                            ? 'border-blue-500 bg-blue-50 shadow-md'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50',
                        )}
                      >
                        <div
                          className={cn(
                            'flex h-12 w-12 items-center justify-center rounded-full',
                            config.color,
                          )}
                        >
                          <span className="text-2xl">{config.icon}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {type}
                        </span>
                      </Button>
                    );
                  })}
                </div>
                {errors.emotion && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.emotion.message}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label
                  htmlFor="comment"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Add a note (optional)
                </label>
                <textarea
                  id="comment"
                  {...register('comment')}
                  placeholder="What's on your mind?"
                  rows={3}
                  className={cn(
                    'w-full resize-none rounded-lg border px-3 py-2 focus:ring-2',
                    errors.comment
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
                  )}
                  maxLength={200}
                />
                <div className="mt-1 flex justify-between">
                  {errors.comment && (
                    <p className="text-sm text-red-600">
                      {errors.comment.message}
                    </p>
                  )}
                  <div className="ml-auto text-xs text-gray-500">
                    {comment.length}/200
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  disabled={!isValid}
                  className={cn(
                    'flex-1 rounded-lg px-4 py-2 font-medium transition-all duration-200',
                    isValid
                      ? 'bg-blue-500 text-white shadow-md hover:bg-blue-600 hover:shadow-lg'
                      : 'cursor-not-allowed bg-gray-300 text-gray-500',
                  )}
                >
                  Add Emotion
                </Button>
              </div>
            </form>
          </div>

          {/* Animated Scroll Down Arrow */}
          {showScrollArrow && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 transform">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleScrollDown}
                className="h-10 w-10 animate-bounce rounded-full border border-gray-200 bg-white/90 shadow-lg backdrop-blur-sm transition-all duration-200 hover:bg-white hover:shadow-xl"
                aria-label="Scroll down"
              >
                <svg
                  className="h-5 w-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  },
);
