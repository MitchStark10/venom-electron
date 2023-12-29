import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export type FocusViewOptions = "today" | "upcoming" | "completed" | "project";

export interface FocusViewState {
  focusView: FocusViewOptions;
  selectedProjectId?: number;
}

const initialState: FocusViewState = {
  focusView: "today",
  selectedProjectId: undefined,
};

export const focusViewSlice = createSlice({
  name: "focusView",
  initialState,
  reducers: {
    setFocusView: (state, action: PayloadAction<FocusViewOptions>) => {
      state.focusView = action.payload;
    },
    setSelectedProjectId: (
      state,
      action: PayloadAction<number | undefined>
    ) => {
      state.selectedProjectId = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setFocusView, setSelectedProjectId } = focusViewSlice.actions;

export default focusViewSlice.reducer;
