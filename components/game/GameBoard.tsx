/**
 * Main game board component
 */

'use client';

import { useEffect } from 'react';
import type { Grid, Player } from '@/lib/game/types';
import { useGameState } from '@/hooks/useGameState';
import { useKeyboardControls } from '@/hooks/useKeyboardControls';
import { getGameStats } from '@/lib/game/game-engine';
import { ContributionGrid } from './ContributionGrid';
import { ScorePanel } from './ScorePanel';
import { GameOverModal } from './GameOverModal';

interface GameBoardProps {
  initialGrid: Grid;
  mode: 'mock' | 'github';
  player?: Player;
  onRestart?: () => void;
  onNewGame?: () => void;
}

/**
 * Main game container that manages game state and renders all game UI
 */
export function GameBoard({
  initialGrid,
  mode,
  player = null,
  onRestart,
  onNewGame,
}: GameBoardProps) {
  const { gameState, changeDirection, restart, startNewGame } = useGameState(initialGrid);
  
  // Enable keyboard controls
  useKeyboardControls(changeDirection, !gameState.isGameOver);
  
  // Get current game stats
  const stats = getGameStats(gameState);
  
  // Handle restart
  const handleRestart = () => {
    restart();
    onRestart?.();
  };
  
  // Handle new game
  const handleNewGame = () => {
    onNewGame?.();
  };
  
  // Focus on mount for keyboard controls
  useEffect(() => {
    window.focus();
  }, []);
  
  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto p-4">
      {/* Score Panel */}
      <ScorePanel
        score={stats.score}
        tilesCollected={stats.tilesCollected}
        tilesRemaining={stats.tilesRemaining}
        snakeLength={stats.snakeLength}
        player={player}
        mode={mode}
      />
      
      {/* Game Grid */}
      <div className="flex justify-center items-center bg-zinc-50 dark:bg-zinc-900 rounded-lg p-8 min-h-[400px]">
        <ContributionGrid
          grid={gameState.grid}
          snakeBody={gameState.snake.body}
        />
      </div>
      
      {/* Controls hint */}
      <div className="text-center text-sm text-zinc-500 dark:text-zinc-400">
        Use arrow keys or WASD to control the snake
      </div>
      
      {/* Game Over Modal */}
      {gameState.isGameOver && (
        <GameOverModal
          isWin={gameState.isWin}
          score={stats.score}
          tilesCollected={stats.tilesCollected}
          snakeLength={stats.snakeLength}
          onRestart={handleRestart}
          onNewGame={handleNewGame}
        />
      )}
    </div>
  );
}
