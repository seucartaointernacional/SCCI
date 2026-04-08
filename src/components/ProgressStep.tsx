"use client";

import { motion } from "framer-motion";

interface ProgressStepProps {
  label: string;
  isActive: boolean;
  isComplete: boolean;
  index: number;
}

export default function ProgressStep({
  label,
  isActive,
  isComplete,
  index,
}: ProgressStepProps) {
  return (
    <motion.div
      className="flex items-center gap-3 py-2"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
    >
      {/* Circle indicator */}
      <div className="flex-shrink-0">
        {isComplete ? (
          <motion.div
            className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </motion.div>
        ) : isActive ? (
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
            <svg
              className="animate-spin w-4 h-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-gray-400" />
          </div>
        )}
      </div>

      {/* Label */}
      <span
        className={`text-sm font-medium transition-colors duration-300 ${
          isComplete
            ? "text-green-600"
            : isActive
            ? "text-blue-600"
            : "text-gray-400"
        }`}
      >
        {label}
      </span>
    </motion.div>
  );
}
