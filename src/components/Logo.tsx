import * as React from 'react';

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className || "h-16 w-16 text-primary"}
    >
      <path d="M7 20v-8.5a4 4 0 0 1 8 0v8.5" />
      <path d="M5 20h14" />
      <path d="M9 12h6" />
    </svg>
  );
}
