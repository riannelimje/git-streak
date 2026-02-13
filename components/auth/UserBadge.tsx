/**
 * User badge component
 */

'use client';

import type { Player } from '@/lib/game/types';
import { Button } from '../ui/Button';

interface UserBadgeProps {
  player: Player;
  onSignOut: () => void;
}

/**
 * Display authenticated user info with sign out option
 */
export function UserBadge({ player, onSignOut }: UserBadgeProps) {
  if (!player) return null;
  
  return (
    <div className="flex items-center gap-3">
      <img
        src={player.avatarUrl}
        alt={player.username}
        className="w-10 h-10 rounded-full border-2 border-zinc-300 dark:border-zinc-700"
      />
      <div className="flex-1">
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {player.username}
        </p>
        <button
          onClick={onSignOut}
          className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
