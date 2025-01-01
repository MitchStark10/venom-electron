import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useGlobalShortcut } from "./useGlobalShortcuts";

export const useNavigationShortcuts = () => {
  const { focusView } = useSelector((state: RootState) => state.focusView);
  const { selectedListId } = useSelector(
    (state: RootState) => state.focusView,
    shallowEqual
  );

  const [focusedSection, setFocusedSection] = useState<
    "sidebar" | "focus-view"
  >("focus-view");
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  useGlobalShortcut("ArrowUp", () => {
    const focusableElement = document.querySelector(
      `.${focusedSection} [tabindex="${focusedIndex - 1}"]`
    );

    if (focusableElement) {
      setFocusedIndex(focusedIndex - 1);
    }
  });
  useGlobalShortcut("ArrowDown", () => {
    const focusableElement = document.querySelector(
      `.${focusedSection} [tabindex="${focusedIndex + 1}"]`
    );

    if (focusableElement) {
      setFocusedIndex(focusedIndex + 1);
    }
  });

  useGlobalShortcut("ArrowLeft", () => {
    setFocusedSection("sidebar");
    setFocusedIndex(0);
  });
  useGlobalShortcut("ArrowRight", () => {
    setFocusedSection("focus-view");
    setFocusedIndex(0);
  });

  useEffect(() => {
    const focusableElement: HTMLElement | null = document.querySelector(
      `.${focusedSection} [tabindex="${focusedIndex}"]`
    );

    if (focusableElement) {
      // The contentEditable attribute is used to deal with a weird MUI + Safari issue
      // where the focus() method doesn't consistently work
      focusableElement.contentEditable = "true";
      focusableElement.focus();
      focusableElement.contentEditable = "false";
      focusableElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [focusedIndex, focusedSection]);

  useEffect(() => {
    if (focusedSection === "focus-view") {
      setFocusedIndex(-1);
    }
  }, [focusView, selectedListId, focusedSection]);
};
