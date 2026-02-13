/**
 * Dataset selector component
 */

'use client';

import { MOCK_DATASETS } from '@/lib/data/mock-contributions';
import type { MockDatasetType } from '@/lib/game/types';

interface DatasetSelectorProps {
  onSelect: (type: MockDatasetType) => void;
  selectedType?: MockDatasetType;
}

/**
 * Component to select a mock dataset type
 */
export function DatasetSelector({ onSelect, selectedType }: DatasetSelectorProps) {
  const difficultyColors = {
    light: 'from-green-50 to-emerald-50 border-green-200 hover:border-green-300',
    medium: 'from-yellow-50 to-orange-50 border-yellow-200 hover:border-yellow-300',
    heavy: 'from-red-50 to-pink-50 border-red-200 hover:border-red-300'
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6 text-zinc-900">
        Choose Your Challenge
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {MOCK_DATASETS.map((dataset) => {
          const isSelected = selectedType === dataset.type;
          
          return (
            <button
              key={dataset.type}
              onClick={() => onSelect(dataset.type)}
              className={`group relative bg-gradient-to-br ${difficultyColors[dataset.type]} rounded-xl p-6 border-2 transition-all text-left ${
                isSelected
                  ? 'ring-2 ring-zinc-900 ring-offset-2'
                  : 'hover:shadow-lg'
              }`}
            >
              <h3 className="text-lg font-bold mb-2 text-zinc-900">
                {dataset.label}
              </h3>
              <p className="text-sm text-zinc-600 mb-4">
                {dataset.description}
              </p>
              
              {/* Difficulty indicator */}
              <div className="flex gap-1">
                {[1, 2, 3].map((level) => (
                  <div
                    key={level}
                    className={`h-2 flex-1 rounded ${
                      level <= (dataset.type === 'light' ? 1 : dataset.type === 'medium' ? 2 : 3)
                        ? 'bg-zinc-900'
                        : 'bg-zinc-200'
                    }`}
                  />
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
