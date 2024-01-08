import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

type BaseError = FetchBaseQueryError | SerializedError;

type ResponseErrorType = {
  error: BaseError;
};

type ResponseWithNestedError = {
  error: {
    data: {
      error: string;
    };
  };
};

export const isResponseErrorType = (
  potentialErrorObj: any
): potentialErrorObj is ResponseErrorType => "error" in potentialErrorObj;

export const hasNestedError = (
  errorObj: any
): errorObj is ResponseWithNestedError =>
  errorObj?.error?.data?.error !== undefined;
