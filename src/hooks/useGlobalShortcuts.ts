import { useEffect } from "react";

export const useGlobalShortcut = (shortcutKey: string, action: () => void) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === shortcutKey) {
        console.log("processing");
        event.preventDefault();
        action();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [shortcutKey, action]);
};
