export const CHANNEL_MAPPING = {
  'HTL-FIV': 'Five Star Hotels',
  'HTL-FOR': 'Four Star Hotels',
  'HTL-LES': 'Less than Four Stars Hotels',

  'OTH-BPC': 'Bar, Pub & Coffee Shop',
  'OTH-CAE': 'Catering for Events',
  'OTH-CAT': 'Catering for Transporters',
  'OTH-CRU': 'Cruising Company',
  'OTH-DST': 'Distributors',
  'OTH-EMP': 'Employee',
  'OTH-IND': 'Industrial',
  'OTH-INT': 'Intercompany',
  'OTH-PRV': 'Private (B2C)',

  'RES-FRA': 'French Restaurants',
  'RES-ITA': 'Italian Restaurants',
  'RES-JPN': 'Japanese Restaurants',
  'RES-OTH': 'Other Restaurants',
  'RES-SHO': 'Steakhouse',

  'RET-BPA': 'Bakery / Pastry',
  'RET-DGR': 'Deli / Gourmet Retail',
  'RET-ICE': 'Ice-Cream / Gelato',
  'RET-OLR': 'Online Retailers',
  'RET-SMK': 'Supermarket',
} as const;

export const CHANNEL_COLORS = {
  'HTL': {
    bg: 'bg-blue-50 hover:bg-blue-100',
    text: 'text-blue-900',
    label: 'Hotels'
  },
  'RES': {
    bg: 'bg-green-50 hover:bg-green-100',
    text: 'text-green-900',
    label: 'Restaurants'
  },
  'RET': {
    bg: 'bg-purple-50 hover:bg-purple-100',
    text: 'text-purple-900',
    label: 'Retail'
  },
  'OTH': {
    bg: 'bg-amber-50 hover:bg-amber-100',
    text: 'text-amber-900',
    label: 'Others'
  }
} as const;

export function getChannelLabel(code: string): string {
  return CHANNEL_MAPPING[code as keyof typeof CHANNEL_MAPPING] || code;
}

export function getChannelColors(code: string) {
  const prefix = code.split('-')[0];
  return CHANNEL_COLORS[prefix as keyof typeof CHANNEL_COLORS] || {
    bg: 'bg-gray-50 hover:bg-gray-100',
    text: 'text-gray-900',
    label: prefix
  };
}

export function getChannelGroups(): { label: string; channels: string[] }[] {
  const groups = new Map<string, string[]>();

  Object.entries(CHANNEL_MAPPING).forEach(([code]) => {
    const prefix = code.split('-')[0];
    if (!groups.has(prefix)) {
      groups.set(prefix, []);
    }
    groups.get(prefix)?.push(code);
  });

  return Array.from(groups.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([prefix, channels]) => ({
      label: CHANNEL_COLORS[prefix as keyof typeof CHANNEL_COLORS]?.label || prefix,
      channels: channels.sort((a, b) => 
        getChannelLabel(a).localeCompare(getChannelLabel(b))
      ),
    }));
}