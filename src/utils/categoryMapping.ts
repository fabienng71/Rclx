import { CATEGORY_COLORS } from '../types';

export function getCategoryLabel(code: string): string {
  return CATEGORY_COLORS[code as keyof typeof CATEGORY_COLORS]?.label || code;
}

export function getCategoryColors(code: string) {
  return CATEGORY_COLORS[code as keyof typeof CATEGORY_COLORS] || {
    bg: 'bg-gray-50 hover:bg-gray-100',
    text: 'text-gray-900',
    label: code
  };
}

export function getCategories(): { code: string; label: string }[] {
  return Object.entries(CATEGORY_COLORS)
    .map(([code, { label }]) => ({ code, label }))
    .sort((a, b) => a.label.localeCompare(b.label));
}