/**
 * Dataset selector component
 */

'use client';

import { MOCK_DATASETS, getTotalCommits, getActiveDaysCount } from '@/lib/data/mock-contributions';
import type { MockDatasetType } from '@/lib/game/types';
import { Button } from '../ui/Button';

interface DatasetSelectorProps {
  onSelect: (type: MockDatasetType) => void;
  selectedType?: MockDatasetType;
}

/**
 * Component to select a mock dataset type
 */
export function DatasetSelector({ onSelect, selectedType }: DatasetSelectorProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6 text-zinc-900">
        Choose Your Challenge
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {MOCK_DATASETS.map((dataset) => {
          const isSelected = selectedType === dataset.type;
          
          return (
            <button
              key={dataset.type}
              onClick={() => onSelect(dataset.type)}
              className={`p-6 rounded-lg border-2 transition-all text-left ${
                isSelected
                  ? 'border-zinc-900 bg-zinc-50'
                  : 'border-zinc-200 hover:border-zinc-400'
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
                        ? 'bg-green-500'
                        : 'bg-zinc-200'
                    }`}
                  />
                ))}
              </div>
            </button>
          );
        })}
      </div>
      
      {selectedType && (
        <div className="mt-6 text-center">
          <Button
            onClick={() => onSelect(selectedType)}
            size="lg"
            className="w-full sm:w-auto"
          >
            Start Game
          </Button>
        </div>
      )}
    </div>
  );
}
