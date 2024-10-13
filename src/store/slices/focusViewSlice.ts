import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { Task } from "../../types/Task";

export type FocusViewOptions =
  | "today"
  | "upcoming"
  | "completed"
  | "tags"
  | "list"
  | "settings";

export interface FocusViewState {
  focusView: FocusViewOptions;
  selectedListId?: number;
  selectedTask?: Task | null;
}

const initialState: FocusViewState = {
  focusView: "today",
  selectedListId: undefined,
};

export const focusViewSlice = createSlice({
  name: "focusView",
  initialState,
  reducers: {
    setFocusView: (state, action: PayloadAction<FocusViewOptions>) => {
      state.focusView = action.payload;
    },
    setSelectedListId: (state, action: PayloadAction<number | undefined>) => {
      state.selectedListId = action.payload;
    },
    setSelectedTask: (
      state,
      action: PayloadAction<Task | null | undefined>
    ) => {
      state.selectedTask = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setFocusView, setSelectedListId, setSelectedTask } =
  focusViewSlice.actions;

export default focusViewSlice.reducer;
