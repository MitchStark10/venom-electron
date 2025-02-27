import { useEffect, useMemo } from "react";

interface Options {
  requireCtrlOrCmd?: boolean;
  skip?: boolean;
}

const defaultOptions: Options = {
  requireCtrlOrCmd: false,
  skip: false,
};

export const useGlobalShortcut = (
  shortcutKey: string,
  action: () => void,
  options?: Options
) => {
  const shortcutOptions = useMemo(() => options ?? defaultOptions, [options]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isCtrlOrCmdPressed =
        (event.ctrlKey || event.metaKey) && shortcutOptions.requireCtrlOrCmd;

      const isCtrlAndCmdOptedOut =
        !shortcutOptions.requireCtrlOrCmd && !event.ctrlKey && !event.metaKey;

      const isInputFocused =
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA";

      if (
        (isCtrlOrCmdPressed || isCtrlAndCmdOptedOut) &&
        event.key === shortcutKey &&
        !isInputFocused &&
        !shortcutOptions.skip
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
