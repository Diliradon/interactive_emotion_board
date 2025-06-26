'use client';

import { observer } from 'mobx-react-lite';

import {
  AddEmotionModal,
  AppHeader,
  EmotionBoard,
  EmotionStats,
} from 'widgets';
import { emotionStore } from 'shared/stores/emotion.store';

const HomePage = observer(() => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {emotionStore.currentView === 'board' ? (
          <EmotionBoard />
        ) : (
          <EmotionStats />
        )}
      </main>

      <AddEmotionModal
        isOpen={emotionStore.isAddModalOpen}
        onClose={emotionStore.closeAddModal}
        onAdd={emotionStore.addEmotion}
      />
    </div>
  );
});

export default HomePage;
