import { VENDOR_MAPPING } from '../types';

export const VENDOR_COLORS = {
  'ABC': {
    bg: 'bg-blue-50 hover:bg-blue-100',
    text: 'text-blue-900',
    label: 'ABC Industrie'
  },
  'CAP': {
    bg: 'bg-green-50 hover:bg-green-100',
    text: 'text-green-900',
    label: 'Capfruit'
  },
  'ISM': {
    bg: 'bg-purple-50 hover:bg-purple-100',
    text: 'text-purple-900',
    label: 'Isigny'
  },
  'MAN': {
    bg: 'bg-amber-50 hover:bg-amber-100',
    text: 'text-amber-900',
    label: 'Manufacture'
  },
  'PON': {
    bg: 'bg-rose-50 hover:bg-rose-100',
    text: 'text-rose-900',
    label: 'Ponthier'
  },
  'QWE': {
    bg: 'bg-cyan-50 hover:bg-cyan-100',
    text: 'text-cyan-900',
    label: 'Qwehli'
  }
} as const;

export function getVendorName(code: string): string {
  return VENDOR_MAPPING[code as keyof typeof VENDOR_MAPPING] || code;
}

export function getVendorColors(code: string) {
  const prefix = code.substring(3, 6);
  return VENDOR_COLORS[prefix as keyof typeof VENDOR_COLORS] || {
    bg: 'bg-gray-50 hover:bg-gray-100',
    text: 'text-gray-900',
    label: getVendorName(code)
  };
}