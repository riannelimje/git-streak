'use client';

import { useState, useEffect } from 'react';
import { GameBoard } from '@/components/game/GameBoard';
import { DatasetSelector } from '@/components/game/DatasetSelector';
import { SignInButton } from '@/components/auth/SignInButton';
import { UserBadge } from '@/components/auth/UserBadge';
import { Button } from '@/components/ui/Button';
import { getMockContributions } from '@/lib/data/mock-contributions';
import { createGrid } from '@/lib/game/grid';
import type { MockDatasetType, Grid, Player, GameMode } from '@/lib/game/types';

type GameScreen = 'landing' | 'playing';

export default function Home() {
  const [screen, setScreen] = useState<GameScreen>('landing');
  const [selectedDataset, setSelectedDataset] = useState<MockDatasetType>('medium');
  const [currentGrid, setCurrentGrid] = useState<Grid | null>(null);
  const [gameMode, setGameMode] = useState<GameMode>('mock');
  const [player, setPlayer] = useState<Player>(null);
  const [isLoadingGitHub, setIsLoadingGitHub] = useState(false);

  // Check for existing GitHub authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/contributions');
        if (response.ok) {
          const data = await response.json();
          setPlayer({
            username: data.user.username,
            avatarUrl: data.user.avatarUrl,
          });
        }
      } catch (error) {
        console.error('Failed to check auth:', error);
      }
    };
    
    checkAuth();
  }, []);

  // Handle mock game start
  const handleStartGame = (datasetType: MockDatasetType) => {
    const contributions = getMockContributions(datasetType);
    const grid = createGrid(contributions);
    setCurrentGrid(grid);
    setSelectedDataset(datasetType);
    setGameMode('mock');
    setScreen('playing');
  };

  // Handle GitHub game start
  const handleStartGitHubGame = async () => {
    setIsLoadingGitHub(true);
    
    try {
      const response = await fetch('/api/contributions');
      
      if (!response.ok) {
        alert('Failed to fetch GitHub contributions. Please try again.');
        setIsLoadingGitHub(false);
        return;
      }
      
      const data = await response.json();
      const grid = createGrid(data.contributions);
      
      setCurrentGrid(grid);
      setGameMode('github');
      setScreen('playing');
    } catch (error) {
      console.error('Error fetching GitHub data:', error);
      alert('Failed to load GitHub data. Please try again.');
    } finally {
      setIsLoadingGitHub(false);
    }
  };

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await fetch('/api/contributions', { method: 'DELETE' });
      setPlayer(null);
      setScreen('landing');
      setCurrentGrid(null);
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  const handleBackToMenu = () => {
    setScreen('landing');
    setCurrentGrid(null);
  };

  const handleRestart = () => {
    // Restart with same dataset/mode
    if (gameMode === 'mock') {
      const contributions = getMockContributions(selectedDataset);
      const grid = createGrid(contributions);
      setCurrentGrid(grid);
    } else {
      handleStartGitHubGame();
    }
  };

  // Playing screen
  if (screen === 'playing' && currentGrid) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <header className="bg-white border-b border-zinc-200 py-4 px-4">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <h1 className="text-2xl font-bold text-zinc-900">
              git-streak
            </h1>
            <div className="flex items-center gap-4">
              {gameMode === 'github' && player && (
                <UserBadge player={player} onSignOut={handleSignOut} />
              )}
              <Button variant="secondary" onClick={handleBackToMenu}>
                Back to Menu
              </Button>
            </div>
          </div>
        </header>
        
        <main className="py-8">
          <GameBoard
            initialGrid={currentGrid}
            mode={gameMode}
            player={player}
            onRestart={handleRestart}
            onNewGame={handleBackToMenu}
          />
        </main>
      </div>
    );
  }

  // Landing screen
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-12 max-w-3xl">
          <h1 className="text-5xl sm:text-6xl font-bold mb-4 text-zinc-900">
            git-streak
          </h1>
          <p className="text-xl text-zinc-600 mb-2">
            Turn your GitHub contributions into a snake game
          </p>
          <p className="text-sm text-zinc-500">
            Collect green tiles to increase your score. Each tile is worth its commit count!
          </p>
        </div>

        {/* GitHub Section */}
        {player ? (
          <div className="w-full max-w-2xl mx-auto mb-12">
            <div className="bg-white rounded-lg p-8 border border-zinc-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <UserBadge player={player} onSignOut={handleSignOut} />
              </div>
              
              <Button
                onClick={handleStartGitHubGame}
                size="lg"
                className="w-full"
                disabled={isLoadingGitHub}
              >
                {isLoadingGitHub ? 'Loading your contributions...' : 'Play with Your GitHub Data'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-2xl mx-auto mb-12">
            <div className="bg-white rounded-lg p-8 border border-zinc-200 shadow-sm text-center">
              <h2 className="text-xl font-bold mb-3 text-zinc-900">
                Play with Your GitHub Data
              </h2>
              <p className="text-sm text-zinc-600 mb-6">
                Sign in to turn your real contribution history into a playable game
              </p>
              <SignInButton />
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="w-full max-w-2xl mx-auto mb-12">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-zinc-50 text-zinc-500">
                or try with sample data
              </span>
            </div>
          </div>
        </div>

        {/* Dataset Selector */}
        <DatasetSelector
          onSelect={handleStartGame}
          selectedType={selectedDataset}
        />
      </main>
    </div>
  );
}
