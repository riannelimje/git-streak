/**
 * Score and game stats panel
 */

'use client';

import type { Player } from '@/lib/game/types';

interface ScorePanelProps {
  score: number;
  tilesCollected: number;
  tilesRemaining: number;
  snakeLength: number;
  player: Player;
  mode: 'mock' | 'github';
}

/**
 * Displays current game statistics and player info
 */
export function ScorePanel({
  score,
  tilesCollected,
  tilesRemaining,
  snakeLength,
  player,
  mode,
}: ScorePanelProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Player info */}
      <div className="flex items-center gap-3">
        {mode === 'github' && player ? (
          <>
            <img
              src={player.avatarUrl}
              alt={player.username}
              className="w-10 h-10 rounded-full border-2 border-zinc-300 dark:border-zinc-700"
            />
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {player.username}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">GitHub Mode</p>
            </div>
          </>
        ) : (
          <div className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
            <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Sample Data Mode
            </p>
          </div>
        )}
      </div>
      
      {/* Game stats */}
      <div className="flex gap-6">
        <div className="text-center">
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {score}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Score</p>
        </div>
        
        <div className="text-center">
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {tilesCollected}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Collected</p>
        </div>
        
        <div className="text-center">
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {tilesRemaining}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Remaining</p>
        </div>
        
        <div className="text-center">
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {snakeLength}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Length</p>
        </div>
      </div>
    </div>
  );
}
