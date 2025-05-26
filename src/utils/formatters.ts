export const formatCurrency = (value: number, compact: boolean = false): string => {
  const options: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: value < 1 ? 4 : 2,
    maximumFractionDigits: value < 1 ? 4 : 2,
  };

  if (compact) {
    options.notation = 'compact';
    options.compactDisplay = 'short';
  }

  return new Intl.NumberFormat('en-US', options).format(value);
};

export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    signDisplay: 'exceptZero',
  }).format(value / 100);
};

export const formatDateTime = (timestamp: string | number, locale: string = 'en'): string => {
  const date = typeof timestamp === 'number' ? new Date(timestamp) : new Date(timestamp);
  
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZoneName: 'shortOffset',
  }).format(date);
};

export const formatChartDate = (timestamp: number, timeframe: number, locale: string = 'en'): string => {
  const date = new Date(timestamp);
  
  if (timeframe === 1) {
    // For 24h view, show hours and minutes with timezone
    return new Intl.DateTimeFormat(locale, {
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'shortOffset',
    }).format(date);
  } else if (timeframe <= 7) {
    // For weekly view, show day and time
    return new Intl.DateTimeFormat(locale, {
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    }).format(date);
  } else if (timeframe <= 90) {
    // For monthly view, show date
    return new Intl.DateTimeFormat(locale, {
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } else {
    // For yearly view, show month and year
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
    }).format(date);
  }
};