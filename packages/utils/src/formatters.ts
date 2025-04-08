/**
 * Format a timestamp into a human-readable relative time
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Formatted relative time string
 */
export function formatRelativeTime(timestamp: number): string {
  if (!timestamp) return '';
  
  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const msPerMonth = msPerDay * 30;
  const msPerYear = msPerDay * 365;
  
  const elapsed = Date.now() - timestamp;
  
  if (elapsed < msPerMinute) {
    const seconds = Math.round(elapsed / 1000);
    return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
  } else if (elapsed < msPerHour) {
    const minutes = Math.round(elapsed / msPerMinute);
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  } else if (elapsed < msPerDay) {
    const hours = Math.round(elapsed / msPerHour);
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  } else if (elapsed < msPerMonth) {
    const days = Math.round(elapsed / msPerDay);
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  } else if (elapsed < msPerYear) {
    const months = Math.round(elapsed / msPerMonth);
    return `${months} month${months !== 1 ? 's' : ''} ago`;
  } else {
    const years = Math.round(elapsed / msPerYear);
    return `${years} year${years !== 1 ? 's' : ''} ago`;
  }
}

/**
 * Format a timestamp to a standard date/time format
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Formatted date/time string
 */
export function formatTimestamp(timestamp: number): string {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Truncate a string to a certain length and add ellipsis if needed
 * @param str - The string to truncate
 * @param maxLength - Maximum length
 * @returns Truncated string
 */
export function truncateString(str: string, maxLength: number): string {
  if (!str || str.length <= maxLength) return str;
  return `${str.slice(0, maxLength)}...`;
} 