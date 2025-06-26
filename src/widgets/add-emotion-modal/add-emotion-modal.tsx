import { FC, useState } from 'react';

import { clsx } from 'clsx';
import { observer } from 'mobx-react-lite';

import { EMOTION_CONFIG, EmotionType } from 'shared/stores/emotion.store';

interface AddEmotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (type: EmotionType, comment: string) => void;
}

export const AddEmotionModal: FC<AddEmotionModalProps> = observer(
  ({ isOpen, onClose, onAdd }) => {
    const [selectedEmotion, setSelectedEmotion] = useState<EmotionType | null>(
      null,
    );
    const [comment, setComment] = useState('');

    const handleSubmit = (event: React.FormEvent) => {
      event.preventDefault();
      if (selectedEmotion) {
        onAdd(selectedEmotion, comment.trim());
        setSelectedEmotion(null);
        setComment('');
      }
    };

    const handleClose = () => {
      setSelectedEmotion(null);
      setComment('');
      onClose();
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

        <div className="zoom-in-95 relative max-h-[90vh] w-full max-w-md animate-in overflow-y-auto rounded-xl bg-white shadow-2xl duration-200">
          <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Add Emotion</h2>
              <button
                type="button"
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
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="mb-3 block text-sm font-medium text-gray-700">
                  How are you feeling?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.values(EmotionType).map(type => {
                    const config = EMOTION_CONFIG[type];
                    const isSelected = selectedEmotion === type;

                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setSelectedEmotion(type)}
                        className={clsx(
                          'rounded-lg border-2 p-4 transition-all duration-200 hover:scale-105',
                          'flex flex-col items-center space-y-2',
                          isSelected
                            ? 'border-blue-500 bg-blue-50 shadow-md'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50',
                        )}
                      >
                        <div
                          className={clsx(
                            'flex h-12 w-12 items-center justify-center rounded-full',
                            config.color,
                          )}
                        >
                          <span className="text-2xl">{config.icon}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {type}
                        </span>
                      </button>
                    );
                  })}
                </div>
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
                  value={comment}
                  onChange={event => setComment(event.target.value)}
                  placeholder="What's on your mind?"
                  rows={3}
                  className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  maxLength={200}
                />
                <div className="mt-1 text-right text-xs text-gray-500">
                  {comment.length}/200
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedEmotion}
                  className={clsx(
                    'flex-1 rounded-lg px-4 py-2 font-medium transition-all duration-200',
                    selectedEmotion
                      ? 'bg-blue-500 text-white shadow-md hover:bg-blue-600 hover:shadow-lg'
                      : 'cursor-not-allowed bg-gray-300 text-gray-500',
                  )}
                >
                  Add Emotion
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  },
);
