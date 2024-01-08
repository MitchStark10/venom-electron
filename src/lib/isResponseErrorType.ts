import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

type BaseError = FetchBaseQueryError | SerializedError;

type ResponseErrorType = {
  error: BaseError;
};

type NestedErrorType = {
  error: string;
};

type ResponseWithNestedError = {
  error: BaseError & NestedErrorType;
};

export const isResponseErrorType = (
  potentialErrorObj: any
): potentialErrorObj is ResponseErrorType => "error" in potentialErrorObj;

export const hasNestedError = (
  errorObj: ResponseErrorType
): errorObj is ResponseWithNestedError => "error" in errorObj.error;
