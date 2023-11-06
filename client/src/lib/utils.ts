import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isMobile() {
  return window.innerWidth < 768;
}

export function isTablet() {
  return window.innerWidth < 1024;
}

export function isDesktop() {
  return window.innerWidth >= 1024;
}
