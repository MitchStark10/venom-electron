if (!process.env.REACT_APP_API_BASE_URL) {
  throw new Error("REACT_APP_API_BASE_URL is not set");
}

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
export const DEFAULT_MENU_ITEMS_COUNT = 5;
