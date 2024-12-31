import { useEffect, useState } from "react";
import { useGlobalShortcut } from "./useGlobalShortcuts";

export const useNavigationShortcuts = () => {
  const [focusedSection, setFocusedSection] = useState<"navbar" | "focus-view">(
    "focus-view"
  );
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  useGlobalShortcut(
    "ArrowUp",
    () => {
      const focusableElement = document.querySelector(
        `.${focusedSection} [tabindex="${focusedIndex - 1}"]`
      );

      if (focusableElement) {
        setFocusedIndex(focusedIndex - 1);
      }
    },
    {
      requireCtrlOrCmd: false,
    }
  );
  useGlobalShortcut(
    "ArrowDown",
    () => {
      const focusableElement = document.querySelector(
        `.${focusedSection} [tabindex="${focusedIndex + 1}"]`
      );

      if (focusableElement) {
        setFocusedIndex(focusedIndex + 1);
      }
    },
    {
      requireCtrlOrCmd: false,
    }
  );

  useGlobalShortcut(
    "ArrowLeft",
    () => {
      setFocusedSection("navbar");
      setFocusedIndex(0);
    },
    {
      requireCtrlOrCmd: false,
    }
  );
  useGlobalShortcut(
    "ArrowRight",
    () => {
      setFocusedSection("focus-view");
      setFocusedIndex(0);
    },
    {
      requireCtrlOrCmd: false,
    }
  );

  useEffect(() => {
    const focusableElement = document.querySelector(
      `.${focusedSection} [tabindex="${focusedIndex}"]`
    );

    if (focusableElement) {
      (focusableElement as HTMLElement).focus();
      focusableElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [focusedIndex, focusedSection]);
};
