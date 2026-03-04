export const CONTACT_ZALO_URL = 'https://zalo.me/YOUR_ZALO_ID';
export const CONTACT_MESSENGER_URL = 'https://m.me/YOUR_FB_PAGE';

export const STATUS_COLORS: Record<string, string> = {
  Available: 'bg-emerald-100 text-emerald-800',
  Pending: 'bg-amber-100 text-amber-800',
  Sold: 'bg-red-100 text-red-800',
};

export const PLATFORM_ICONS: Record<string, string> = {
  Android: '🤖',
  iOS: '🍎',
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (num: number): string => {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
};
