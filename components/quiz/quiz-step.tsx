'use client';

import { cn } from '@/lib/utils';

interface QuizOption {
  value: string;
  label: string;
  description: string;
}

interface QuizStepProps {
  question: string;
  description?: string;
  options: QuizOption[];
  selectedValue?: string;
  onSelect: (value: string) => void;
}

export function QuizStep({
  question,
  description,
  options,
  selectedValue,
  onSelect,
}: QuizStepProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-coffee-900 mb-2">{question}</h2>
        {description && <p className="text-coffee-600">{description}</p>}
      </div>

      <div className="grid gap-3">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onSelect(option.value)}
            className={cn(
              'quiz-option w-full text-left p-4 rounded-xl border-2 bg-white',
              selectedValue === option.value
                ? 'border-coffee-600 bg-coffee-50'
                : 'border-coffee-100 hover:border-coffee-200'
            )}
            data-selected={selectedValue === option.value}
            aria-pressed={selectedValue === option.value}
          >
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  'mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                  selectedValue === option.value
                    ? 'border-coffee-600 bg-coffee-600'
                    : 'border-coffee-300'
                )}
              >
                {selectedValue === option.value && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
              <div>
                <p className="font-medium text-coffee-900">{option.label}</p>
                <p className="text-sm text-coffee-500">{option.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
