/**
 * Hook for handling keyboard controls
 */

import { useEffect, useCallback } from 'react';
import type { Direction } from '@/lib/game/types';

type KeyHandler = (direction: Direction) => void;

/**
 * Map keyboard keys to game directions
 */
const KEY_TO_DIRECTION: Record<string, Direction> = {
  ArrowUp: 'UP',
  ArrowDown: 'DOWN',
  ArrowLeft: 'LEFT',
  ArrowRight: 'RIGHT',
  w: 'UP',
  W: 'UP',
  s: 'DOWN',
  S: 'DOWN',
  a: 'LEFT',
  A: 'LEFT',
  d: 'RIGHT',
  D: 'RIGHT',
};

/**
 * Hook to handle keyboard input for game controls
 * Supports both arrow keys and WASD
 * 
 * @param onDirectionChange - Callback when direction key is pressed
 * @param enabled - Whether controls are active (default: true)
 */
export function useKeyboardControls(
  onDirectionChange: KeyHandler,
  enabled: boolean = true
) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;
      
      const direction = KEY_TO_DIRECTION[event.key];
      
      if (direction) {
        event.preventDefault();
        onDirectionChange(direction);
      }
    },
    [onDirectionChange, enabled]
  );
  
  useEffect(() => {
    if (!enabled) return;
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, enabled]);
}
