import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export type FocusViewOptions =
  | "today"
  | "upcoming"
  | "completed"
  | "tags"
  | "list";

export interface FocusViewState {
  focusView: FocusViewOptions;
  selectedListId?: number;
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
  },
});

// Action creators are generated for each case reducer function
export const { setFocusView, setSelectedListId } = focusViewSlice.actions;

export default focusViewSlice.reducer;
