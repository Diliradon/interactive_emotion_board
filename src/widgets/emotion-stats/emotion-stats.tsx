/* eslint-disable no-magic-numbers */
import { clsx } from 'clsx';
import { observer } from 'mobx-react-lite';

import {
  EMOTION_CONFIG,
  emotionStore,
  EmotionType,
} from 'shared/stores/emotion.store';
import { Button } from 'shared/ui';

export const EmotionStats = observer(() => {
  const stats = emotionStore.emotionStats;
  const totalEmotions = emotionStore.filteredEmotionsForStats.length;

  const getPercentage = (count: number) => {
    return totalEmotions > 0 ? Math.round((count / totalEmotions) * 100) : 0;
  };

  const filters: Array<{ key: 'today' | 'week' | 'month'; label: string }> = [
    { key: 'today', label: 'Today' },
    { key: 'week', label: 'This Week' },
    { key: 'month', label: 'This Month' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex space-x-1 rounded-lg bg-gray-100 p-1">
        {filters.map(({ key, label }) => (
          <Button
            variant="ghost"
            key={key}
            onClick={() => emotionStore.setStatsFilter(key)}
            className={clsx(
              'flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200',
              emotionStore.statsFilter === key
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900',
            )}
          >
            {label}
          </Button>
        ))}
      </div>

      {/* Total Count */}
      <div className="py-4 text-center">
        <div className="text-3xl font-bold text-gray-900">{totalEmotions}</div>
        <div className="capitalize text-gray-500">
          emotions{' '}
          {emotionStore.statsFilter === 'today'
            ? 'today'
            : `this ${emotionStore.statsFilter}`}
        </div>
      </div>

      {totalEmotions === 0 ? (
        <div className="py-8 text-center">
          <div className="mb-3 text-4xl">📊</div>
          <p className="text-gray-500">
            No emotions recorded for this period yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Emotion Breakdown */}
          <h3 className="text-lg font-semibold text-gray-900">
            Emotion Breakdown
          </h3>

          <div className="space-y-3">
            {Object.values(EmotionType)
              .filter(type => stats[type] > 0)
              .sort((a, b) => stats[b] - stats[a])
              .map(type => {
                const config = EMOTION_CONFIG[type];
                const count = stats[type];
                const percentage = getPercentage(count);

                return (
                  <div key={type} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={clsx(
                            'flex h-8 w-8 items-center justify-center rounded-full',
                            config.color,
                          )}
                        >
                          <span className="text-sm">{config.icon}</span>
                        </div>
                        <span className="font-medium text-gray-900">
                          {type}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">{count}</span>
                        <span className="text-xs text-gray-400">
                          ({percentage}%)
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-2 w-full rounded-full bg-gray-200">
                      <div
                        className={clsx(
                          'h-2 rounded-full transition-all duration-500',
                          config.color,
                        )}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Top Emotion */}
          {totalEmotions > 0 && (
            <div className="mt-6 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 p-4">
              <h4 className="mb-2 text-sm font-medium text-gray-700">
                Most Frequent Emotion
              </h4>
              {(() => {
                const topEmotion = Object.values(EmotionType)
                  .filter(type => stats[type] > 0)
                  .sort((a, b) => stats[b] - stats[a])[0];

                if (!topEmotion) {
                  return null;
                }

                const config = EMOTION_CONFIG[topEmotion];
                const count = stats[topEmotion];

                return (
                  <div className="flex items-center space-x-3">
                    <div
                      className={clsx(
                        'flex h-12 w-12 items-center justify-center rounded-full',
                        config.color,
                      )}
                    >
                      <span className="text-2xl">{config.icon}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {topEmotion}
                      </div>
                      <div className="text-sm text-gray-600">
                        {count} time{count !== 1 && 's'} ({getPercentage(count)}
                        %)
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
});
