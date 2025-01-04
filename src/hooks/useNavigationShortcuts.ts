import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useGlobalShortcut } from "./useGlobalShortcuts";

export const useNavigationShortcuts = () => {
  const { focusView } = useSelector((state: RootState) => state.focusView);
  const { selectedListId } = useSelector(
    (state: RootState) => state.focusView,
    shallowEqual
  );
  const { isModalOpen } = useSelector((state: RootState) => state.modal);

  const [focusedSection, setFocusedSection] = useState<
    "sidebar" | "focus-view"
  >("focus-view");
  const [sidebarFocusIndex, setSidebarFocusIndex] = useState<number>(0);
  const [viewFocusIndex, setViewFocusIndex] = useState<number>(0);
  const [focusedIndex, setFocusedIndex] = useMemo(() => {
    return focusedSection === "sidebar"
      ? [sidebarFocusIndex, setSidebarFocusIndex]
      : [viewFocusIndex, setViewFocusIndex];
  }, [focusedSection, sidebarFocusIndex, viewFocusIndex]);

  const handleArrowUp = () => {
    const focusableElement = document.querySelector(
      `.${focusedSection} [tabindex="${focusedIndex - 1}"]`
    );

    if (focusableElement) {
      setFocusedIndex(focusedIndex - 1);
    }
  };
  const handleArrowDown = () => {
    const focusableElement = document.querySelector(
      `.${focusedSection} [tabindex="${focusedIndex + 1}"]`
    );

    if (focusableElement) {
      setFocusedIndex(focusedIndex + 1);
    }
  };
  const handleArrowLeft = () => {
    setFocusedSection("sidebar");
  };
  const handleArrowRight = () => {
    setFocusedSection("focus-view");
  };

  useGlobalShortcut("ArrowUp", handleArrowUp, {
    skip: isModalOpen,
  });
  useGlobalShortcut("ArrowDown", handleArrowDown, {
    skip: isModalOpen,
  });
  useGlobalShortcut("ArrowLeft", handleArrowLeft, {
    skip: isModalOpen,
  });
  useGlobalShortcut("ArrowRight", handleArrowRight, {
    skip: isModalOpen,
  });

  // Vim keybindings
  useGlobalShortcut("k", handleArrowUp, {
    skip: isModalOpen,
  });
  useGlobalShortcut("j", handleArrowDown, {
    skip: isModalOpen,
  });
  useGlobalShortcut("h", handleArrowLeft, {
    skip: isModalOpen,
  });
  useGlobalShortcut("l", handleArrowRight, {
    skip: isModalOpen,
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
    setViewFocusIndex(0);
  }, [focusView, selectedListId]);
};
