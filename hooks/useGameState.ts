/**
 * Hook for managing game state with game loop
 */

import { useReducer, useEffect, useRef, useCallback } from 'react';
import type { GameState, Direction, Grid } from '@/lib/game/types';
import { gameReducer, initializeGame } from '@/lib/game/game-engine';

const GAME_SPEED = 150; // milliseconds per tick (adjust for difficulty)

/**
 * Hook to manage game state with automatic game loop
 * 
 * @param initialGrid - The contribution grid to play with
 * @returns Game state and control functions
 */
export function useGameState(initialGrid: Grid) {
  const [gameState, dispatch] = useReducer(
    gameReducer,
    initialGrid,
    initializeGame
  );
  
  const gameLoopRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(0);
  
  // Change direction
  const changeDirection = useCallback((direction: Direction) => {
    dispatch({ type: 'CHANGE_DIRECTION', direction });
  }, []);
  
  // Restart game
  const restart = useCallback(() => {
    dispatch({ type: 'RESTART' });
  }, []);
  
  // Start new game with different grid
  const startNewGame = useCallback((grid: Grid) => {
    dispatch({ type: 'NEW_GAME', grid });
  }, []);
  
  // Game loop using requestAnimationFrame
  useEffect(() => {
    if (gameState.isGameOver) {
      if (gameLoopRef.current !== null) {
        cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = null;
      }
      return;
    }
    
    const gameLoop = (timestamp: number) => {
      if (lastTickRef.current === 0) {
        lastTickRef.current = timestamp;
      }
      
      const elapsed = timestamp - lastTickRef.current;
      
      if (elapsed >= GAME_SPEED) {
        dispatch({ type: 'TICK' });
        lastTickRef.current = timestamp;
      }
      
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };
    
    gameLoopRef.current = requestAnimationFrame(gameLoop);
    
    return () => {
      if (gameLoopRef.current !== null) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState.isGameOver]);
  
  // Reset last tick when game restarts
  useEffect(() => {
    lastTickRef.current = 0;
  }, [gameState.isGameOver]);
  
  return {
    gameState,
    changeDirection,
    restart,
    startNewGame,
  };
}
