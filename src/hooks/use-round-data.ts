'use client';

import { useState } from 'react';
import { useGame } from '@/contexts/game-context';

export function useRoundData() {
  const { currentRoundData } = useGame();
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  const roundData = currentRoundData;

  const retry = () => {
    console.log('Retry called, but data is already pre-generated');
  };

  return {
    roundData,
    loading,
    error,
    retry,
  };
}
