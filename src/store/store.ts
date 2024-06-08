import { configureStore } from "@reduxjs/toolkit";
import { rtkQueryErrorMiddlware } from "../lib/rtkQueryErrorMiddlware";
import focusViewReducer from "./slices/focusViewSlice";
import { listsApi } from "./slices/listSlice";
import modalReducer from "./slices/modalSlice";
import { tagsApi } from "./slices/tagSlice";
import { tasksApi } from "./slices/taskSlice";
import { userApi } from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    focusView: focusViewReducer,
    modal: modalReducer,
    user: userApi.reducer,
    list: listsApi.reducer,
    task: tasksApi.reducer,
    tag: tagsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      rtkQueryErrorMiddlware,
      userApi.middleware,
      listsApi.middleware,
      tasksApi.middleware,
      tagsApi.middleware
    ),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
