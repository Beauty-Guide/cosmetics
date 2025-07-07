import { API_BASE_URL } from "@/config/consts"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getImgUrl = (url: string | undefined): string => {
  if (url) {
    return `${API_BASE_URL}${url}`
  }

  return "/600x400.svg"
}
