/**
 * GitHub-style contribution grid component
 */

'use client';

import type { Grid, Position } from '@/lib/game/types';
import { getContributionLevel, getLevelColor, getCollectedColor } from '@/lib/game/grid';
import { positionsEqual } from '@/lib/utils/grid-helpers';

interface ContributionGridProps {
  grid: Grid;
  snakeBody: Position[];
  className?: string;
}

/**
 * Renders the contribution grid with GitHub's exact visual style
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
      <div className="flex gap-3">
        {/* Day labels */}
        <div className="flex flex-col justify-between py-1">
          <div className="h-[10px] text-[9px] text-zinc-600 leading-[10px]">Mon</div>
          <div className="h-[10px] text-[9px] text-zinc-600 leading-[10px]">Wed</div>
          <div className="h-[10px] text-[9px] text-zinc-600 leading-[10px]">Fri</div>
        </div>
        
        {/* Grid */}
        <div className="flex gap-[2px]">
          {grid.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-[2px]">
              {week.map((tile, dayIndex) => {
                const level = getContributionLevel(tile.commits);
                const baseColor = getLevelColor(level);
                const isSnake = isSnakeSegment(dayIndex, weekIndex);
                const isHead = isSnakeHead(dayIndex, weekIndex);
                const isEmpty = tile.date === '';
                const isCollected = tile.isCollected;
                
                // Collected tiles show dimmed grey
                const displayColor = isEmpty 
                  ? 'transparent' 
                  : isCollected
                    ? getCollectedColor()
                    : baseColor;
                
                return (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className="w-[10px] h-[10px] rounded-[2px] relative group"
                    style={{
                      backgroundColor: displayColor,
                    }}
                    title={
                      isEmpty
                        ? ''
                        : `${tile.date}: ${tile.commits} contribution${tile.commits !== 1 ? 's' : ''}${isCollected ? ' (collected)' : ''}`
                    }
                  >
                    {/* Subtle hover outline (GitHub style) */}
                    {!isEmpty && !isSnake && (
                      <div className="absolute inset-0 rounded-[2px] opacity-0 group-hover:opacity-100 transition-opacity" 
                           style={{ outline: '1px solid rgba(27, 31, 35, 0.06)' }} 
                      />
                    )}
                    
                    {/* Snake overlay */}
                    {isSnake && (
                      <div
                        className={`absolute inset-0 rounded-[2px] ${
                          isHead
                            ? 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.5)]'
                            : 'bg-blue-500'
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
    </div>
  );
}
