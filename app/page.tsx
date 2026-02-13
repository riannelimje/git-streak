'use client';

import { useState } from 'react';
import { GameBoard } from '@/components/game/GameBoard';
import { DatasetSelector } from '@/components/game/DatasetSelector';
import { Button } from '@/components/ui/Button';
import { getMockContributions } from '@/lib/data/mock-contributions';
import { createGrid } from '@/lib/game/grid';
import type { MockDatasetType, Grid } from '@/lib/game/types';

type GameScreen = 'landing' | 'playing';

export default function Home() {
  const [screen, setScreen] = useState<GameScreen>('landing');
  const [selectedDataset, setSelectedDataset] = useState<MockDatasetType>('medium');
  const [currentGrid, setCurrentGrid] = useState<Grid | null>(null);

  const handleStartGame = (datasetType: MockDatasetType) => {
    const contributions = getMockContributions(datasetType);
    const grid = createGrid(contributions);
    setCurrentGrid(grid);
    setSelectedDataset(datasetType);
    setScreen('playing');
  };

  const handleBackToMenu = () => {
    setScreen('landing');
    setCurrentGrid(null);
  };

  const handleRestart = () => {
    // Restart with same dataset
    if (currentGrid) {
      const contributions = getMockContributions(selectedDataset);
      const grid = createGrid(contributions);
      setCurrentGrid(grid);
    }
  };

  if (screen === 'playing' && currentGrid) {
    return (
      <div className="min-h-screen bg-white dark:bg-black">
        <header className="border-b border-zinc-200 dark:border-zinc-800 py-4 px-4">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              git-streak
            </h1>
            <Button variant="secondary" onClick={handleBackToMenu}>
              Back to Menu
            </Button>
          </div>
        </header>
        
        <main className="py-8">
          <GameBoard
            initialGrid={currentGrid}
            mode="mock"
            onRestart={handleRestart}
            onNewGame={handleBackToMenu}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-12 max-w-3xl">
          <h1 className="text-5xl sm:text-6xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">
            git-streak
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-2">
            Turn your GitHub contributions into a snake game
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-500">
            Collect green tiles to increase your score. Each tile is worth its commit count!
          </p>
        </div>

        {/* Dataset Selector */}
        <DatasetSelector
          onSelect={handleStartGame}
          selectedType={selectedDataset}
        />

        {/* Footer hint */}
        <div className="mt-12 text-center text-sm text-zinc-500 dark:text-zinc-400">
          <p>Want to play with your real GitHub data?</p>
          <p className="mt-1">Sign in with GitHub (coming soon)</p>
        </div>
      </main>
    </div>
  );
}
