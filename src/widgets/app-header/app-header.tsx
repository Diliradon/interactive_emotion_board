/* eslint-disable no-magic-numbers */
import { useState } from 'react';

import { clsx } from 'clsx';
import { observer } from 'mobx-react-lite';

import { emotionStore, EmotionStore } from 'shared/stores/emotion.store';

import { ConfirmationModal } from '../confirmation-modal';

export const AppHeader = observer(() => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleClearAll = () => {
    setShowClearConfirm(true);
  };

  const handleConfirmClear = () => {
    emotionStore.clearAllEmotions();
  };

  const getThemeStyles = () => {
    const theme = EmotionStore.getCurrentTheme();

    switch (theme) {
      case 'morning':
        return 'bg-gradient-to-r from-yellow-200 to-orange-200';

      case 'afternoon':
        return 'bg-gradient-to-r from-blue-200 to-cyan-200';

      case 'evening':
        return 'bg-gradient-to-r from-purple-200 to-pink-200';

      default:
        return 'bg-gradient-to-r from-blue-200 to-cyan-200';
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 6) {
      return 'Good night';
    }

    if (hour < 12) {
      return 'Good morning';
    }

    if (hour < 18) {
      return 'Good afternoon';
    }

    return 'Good evening';
  };

  return (
    <>
      <header
        className={clsx(
          'shadow-sm transition-all duration-300',
          getThemeStyles(),
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-2xl">😊</div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Emotion Board
                </h1>
                <p className="text-xs text-gray-600">
                  {getGreeting()}! How are you feeling?
                </p>
              </div>
            </div>

            <nav className="hidden items-center space-x-1 sm:flex">
              <button
                type="button"
                onClick={() => emotionStore.setCurrentView('board')}
                className={clsx(
                  'rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200',
                  emotionStore.currentView === 'board'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-700 hover:bg-white/50 hover:text-gray-900',
                )}
              >
                📋 Board
              </button>
              <button
                type="button"
                onClick={() => emotionStore.setCurrentView('stats')}
                className={clsx(
                  'rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200',
                  emotionStore.currentView === 'stats'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-700 hover:bg-white/50 hover:text-gray-900',
                )}
              >
                📊 Statistics
              </button>
            </nav>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={emotionStore.openAddModal}
                className="flex items-center space-x-2 rounded-lg bg-blue-500 px-4 py-2 text-white shadow-md transition-colors duration-200 hover:bg-blue-600 hover:shadow-lg"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span className="hidden sm:inline">Add Emotion</span>
              </button>

              {emotionStore.emotions.length > 0 && (
                <button
                  aria-label="Clear all emotions"
                  type="button"
                  onClick={handleClearAll}
                  className="rounded-lg p-2 text-red-600 transition-colors duration-200 hover:bg-white/50 hover:text-red-700"
                  title="Clear all emotions"
                >
                  <svg
                    className="h-5 w-5"
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
                </button>
              )}
            </div>
          </div>

          <div className="pb-4 sm:hidden">
            <div className="flex space-x-1">
              <button
                type="button"
                onClick={() => emotionStore.setCurrentView('board')}
                className={clsx(
                  'flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                  emotionStore.currentView === 'board'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-700 hover:bg-white/50 hover:text-gray-900',
                )}
              >
                📋 Board
              </button>
              <button
                type="button"
                onClick={() => emotionStore.setCurrentView('stats')}
                className={clsx(
                  'flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                  emotionStore.currentView === 'stats'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-700 hover:bg-white/50 hover:text-gray-900',
                )}
              >
                📊 Statistics
              </button>
            </div>
          </div>
        </div>
      </header>

      <ConfirmationModal
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={handleConfirmClear}
        title="Clear All Emotions"
        message="Are you sure you want to clear all emotions? This action cannot be undone."
        confirmText="Clear All"
        cancelText="Cancel"
        variant="danger"
      />
    </>
  );
});
