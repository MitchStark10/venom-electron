import type { Middleware, MiddlewareAPI } from "@reduxjs/toolkit";
import { isRejectedWithValue } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

/**
 * Log a warning and show a toast!
 */
export const rtkQueryErrorMiddlware: Middleware =
  (api: MiddlewareAPI) => (next) => (action: any) => {
    // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these matchers!
    if (isRejectedWithValue(action)) {
      console.error("An error occurred!", action.payload);
      toast.error(
        action?.payload?.data?.message ||
          "An unexpedted error occurred. Please try again later."
      );
      return;
    }

    return next(action);
  };
