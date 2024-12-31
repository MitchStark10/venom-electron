import { useEffect, useMemo } from "react";

interface Options {
  requireCtrlOrCmd?: boolean;
}

const defaultOptions: Options = {
  requireCtrlOrCmd: true,
};

export const useGlobalShortcut = (
  shortcutKey: string,
  action: () => void,
  options?: Options
) => {
  const shortcutOptions = useMemo(() => options ?? defaultOptions, [options]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isCtrlOrCmdPressedOrOptedOut =
        event.ctrlKey || event.metaKey || !shortcutOptions.requireCtrlOrCmd;

      const isInputFocused = document.activeElement?.tagName === "INPUT";

      if (
        isCtrlOrCmdPressedOrOptedOut &&
        event.key === shortcutKey &&
        !isInputFocused
      ) {
        event.preventDefault();
        action();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [shortcutKey, action, shortcutOptions]);
};
