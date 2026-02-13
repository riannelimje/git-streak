/**
 * GitHub-style contribution grid component
 */

'use client';

import type { Grid, Position } from '@/lib/game/types';
import { getContributionLevel, getLevelColor } from '@/lib/game/grid';
import { positionsEqual } from '@/lib/utils/grid-helpers';

interface ContributionGridProps {
  grid: Grid;
  snakeBody: Position[];
  className?: string;
}

/**
 * Renders the contribution grid with GitHub-style heatmap colors
 * and snake overlay
 */
export function ContributionGrid({ grid, snakeBody, className = '' }: ContributionGridProps) {
  const isSnakeSegment = (row: number, col: number): boolean => {
    return snakeBody.some(pos => positionsEqual(pos, { row, col }));
  };
  
  const isSnakeHead = (row: number, col: number): boolean => {
    if (snakeBody.length === 0) return false;
    return positionsEqual(snakeBody[0], { row, col });
  };
  
  return (
    <div className={`inline-block ${className}`}>
      <div className="flex gap-[3px]">
        {grid.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-[3px]">
            {week.map((tile, dayIndex) => {
              const level = getContributionLevel(tile.commits);
              const baseColor = getLevelColor(level);
              const isSnake = isSnakeSegment(dayIndex, weekIndex);
              const isHead = isSnakeHead(dayIndex, weekIndex);
              const isEmpty = tile.date === '';
              
              return (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className="w-[11px] h-[11px] rounded-[2px] transition-all duration-100 relative"
                  style={{
                    backgroundColor: isEmpty ? 'transparent' : baseColor,
                    opacity: tile.isCollected ? 0.3 : 1,
                  }}
                  title={
                    isEmpty
                      ? ''
                      : `${tile.date}: ${tile.commits} contribution${tile.commits !== 1 ? 's' : ''}`
                  }
                >
                  {isSnake && (
                    <div
                      className={`absolute inset-0 rounded-[2px] ${
                        isHead
                          ? 'bg-yellow-400 border-2 border-yellow-600'
                          : 'bg-blue-500 border border-blue-700'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
