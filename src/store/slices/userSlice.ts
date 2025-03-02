import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAuthToken } from "../../lib/authToken";
import { API_BASE_URL } from "../../lib/constants";
import { Settings } from "../../types/Settings";
import { listsApi } from "./listSlice";

interface LoginArgs {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

export const userApi = createApi({
  reducerPath: "user",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginArgs>({
      query: ({ email, password }) => ({
        url: "/users/login",
        method: "POST",
        body: {
          email,
          password,
        },
      }),
    }),
    signup: builder.mutation<LoginResponse, LoginArgs>({
      query: ({ email, password }) => ({
        url: "/users/createUser",
        method: "POST",
        body: {
          email,
          password,
        },
      }),
    }),
    settings: builder.query<Settings, void>({
      query: () => ({
        url: "/settings",
        method: "GET",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }),
    }),
    updateSettings: builder.mutation<Settings, Partial<Settings>>({
      query: (settings) => ({
        url: "/settings",
        method: "PUT",
        body: settings,
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }),
      onQueryStarted: (_arg, api) => {
        api.queryFulfilled.then(() => {
          api.dispatch(listsApi.util.invalidateTags(["Lists"]));
        });
      },
    }),
    deleteAccount: builder.mutation<void, void>({
      query: () => ({
        url: "/settings/full-account",
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }),
    }),
    resetPassword: builder.mutation<
      LoginResponse,
      { token: string; password: string; userId: string }
    >({
      query: (data) => ({
        url: "/users/reset_password",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useSettingsQuery,
  useUpdateSettingsMutation,
  useDeleteAccountMutation,
  useResetPasswordMutation,
} = userApi;
