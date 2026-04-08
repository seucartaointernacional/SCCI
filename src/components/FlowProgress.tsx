"use client";

import { CheckIcon } from "@/components/icons";

interface FlowProgressProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

export default function FlowProgress({ currentStep, totalSteps, labels }: FlowProgressProps) {
  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-2xl mx-auto px-4 py-4">
        {/* Progress bar */}
        <div className="relative flex items-center justify-between mb-2">
          {/* Background line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-100 -translate-y-1/2" />
          {/* Active line */}
          <div
            className="absolute top-1/2 left-0 h-0.5 bg-brand-600 -translate-y-1/2 transition-all duration-500"
            style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          />

          {Array.from({ length: totalSteps }, (_, i) => {
            const step = i + 1;
            const isComplete = step < currentStep;
            const isActive = step === currentStep;

            return (
              <div key={i} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    isComplete
                      ? "bg-brand-600 text-white"
                      : isActive
                      ? "bg-brand-600 text-white ring-4 ring-brand-100"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {isComplete ? <CheckIcon size={14} /> : step}
                </div>
              </div>
            );
          })}
        </div>

        {/* Labels */}
        <div className="flex items-center justify-between">
          {labels.map((label, i) => {
            const step = i + 1;
            const isActive = step === currentStep;
            const isComplete = step < currentStep;

            return (
              <span
                key={i}
                className={`text-[10px] sm:text-xs font-medium text-center max-w-[80px] sm:max-w-none transition-colors duration-300 ${
                  isActive
                    ? "text-brand-600"
                    : isComplete
                    ? "text-gray-600"
                    : "text-gray-400"
                }`}
              >
                {label}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
