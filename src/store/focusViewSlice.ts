import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

type FocusViewOptions = "today" | "upcoming" | "completed" | "project";

export interface FocusViewState {
  focusView: FocusViewOptions;
}

const initialState: FocusViewState = {
  focusView: "today",
};

export const focusViewSlice = createSlice({
  name: "focusView",
  initialState,
  reducers: {
    setFocusView: (state, action: PayloadAction<FocusViewOptions>) => {
      state.focusView = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setFocusView } = focusViewSlice.actions;

export default focusViewSlice.reducer;
