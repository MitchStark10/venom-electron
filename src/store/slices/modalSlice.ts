import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export type ModalOptions =
  | "newList"
  | "task"
  | "deleteAccount"
  | "quickDueDateEdit"
  | "quickListChange"
  | "quickTagsChange"
  | null;

export interface ModalState {
  modalView: ModalOptions;
  isModalOpen: boolean;
}

const initialState: ModalState = {
  modalView: null,
  isModalOpen: false,
};

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    setModalView: (state, action: PayloadAction<ModalOptions>) => {
      state.modalView = action.payload;
    },
    setIsModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isModalOpen = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setModalView, setIsModalOpen } = modalSlice.actions;

export default modalSlice.reducer;
