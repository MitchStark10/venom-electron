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
      skip: isModalOpen,
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
      skip: isModalOpen,
    }
  );

  useGlobalShortcut(
    "ArrowLeft",
    () => {
      setFocusedSection("sidebar");
    },
    {
      skip: isModalOpen,
    }
  );
  useGlobalShortcut(
    "ArrowRight",
    () => {
      setFocusedSection("focus-view");
    },
    {
      skip: isModalOpen,
    }
  );

  useEffect(() => {
    console.log(
      "query to test",
      `.${focusedSection} [tabindex="${focusedIndex}"]`
    );
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
