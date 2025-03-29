/// <reference types="vite/client" />

declare global {
  interface Window {
    myGlobalVar: string;
  }
  const myOtherGlobal: number;
}

export {}; // Ensure this file is treated as a module
