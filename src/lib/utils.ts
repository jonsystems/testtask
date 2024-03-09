import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const timeSinceDate = (date: Date) => {
  const now = new Date().getTime();
  const past = date.getTime();

  const hoursSince = Math.round((now - past) / 3600000);

  if (hoursSince > 24) {
    const daysSince = Math.round((now - past) / 8.64e+7);
    return `${daysSince} ${daysSince > 1 ? "days" : "day"} ago`
  } else if (hoursSince >= 1) {
    return `${hoursSince} ${hoursSince > 1 ? "hours" : "hour"} ago`;
  } else {
    const minutesSince = Math.round((now - past) / 60000);
    return `${minutesSince} ${minutesSince > 1 ? "minutes" : "minute"} ago`;
  };
};