import { Suspense } from 'react';

import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { queryClient } from 'shared/lib';

const HomePage = () => {
  return (
    <main className="p-2">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense>Hello World</Suspense>
      </HydrationBoundary>
    </main>
  );
};

export default HomePage;
