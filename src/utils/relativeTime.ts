// /* eslint-disable @typescript-eslint/no-explicit-any */
// const getRelativeTime = (date: Date | string) => {
//   const now: any = new Date();
//   const targetDate: any = new Date(date);
//   const differenceInSeconds = Math.abs((now - targetDate) / 1000);

//   if (differenceInSeconds < 60) {
//     return "just now";
//   } else if (differenceInSeconds < 3600) {
//     const minutes = Math.floor(differenceInSeconds / 60);
//     return `${minutes}m ago`;
//   } else if (differenceInSeconds < 86400) {
//     const hours = Math.floor(differenceInSeconds / 3600);
//     return `${hours}h ago`;
//   } else {
//     const days = Math.floor(differenceInSeconds / 86400);
//     return `${days}d ago`;
//   }
// };
// export default getRelativeTime;

// utils/relativeTime.js
import { formatDistanceToNow } from "date-fns";

/**
 * Get relative time from a given date.
 * @param {Date|string|number} date - The date to calculate relative time from.
 * @returns {string} - The relative time string (e.g., "1 year ago", "just now", "4 minutes ago").
 */
const getRelativeTime = (date: Date | string | number): string => {
  // Convert the input to a Date object if it isn't already
  const dateObj = new Date(date);

  // Get the relative time using date-fns
  const relativeTime = formatDistanceToNow(dateObj, {
    addSuffix: true,
  });

  // Replace "less than a minute ago" with "just now" for better UX
  // return relativeTime;
  return relativeTime.replace(/less than a minute ago/, "just now");
};
export default getRelativeTime;
