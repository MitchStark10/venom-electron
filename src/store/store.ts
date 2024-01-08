import { configureStore } from "@reduxjs/toolkit";
import focusViewReducer from "./slices/focusViewSlice";
import modalReducer from "./slices/modalSlice";
import { userApi } from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    user: userApi.reducer,
    focusView: focusViewReducer,
    modal: modalReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
