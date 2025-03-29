if (!import.meta.env.VITE_API_BASE_URL) {
  throw new Error("VITE_API_BASE_URL is not set");
}

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const DEFAULT_MENU_ITEMS_COUNT = 5;
