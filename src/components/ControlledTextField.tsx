import { TextField, TextFieldProps } from "@mui/material";
import { FC, KeyboardEventHandler } from "react";
import { Control, Controller } from "react-hook-form";

interface Props {
  control: Control<any>;
  name: string;
  label: string;
  type?: string;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
  fullWidth?: boolean;
  autoFocus?: boolean;
  multiline?: boolean;
  rows?: number;
  autoComplete?: TextFieldProps["autoComplete"];
}

export const ControlledTextField: FC<Props> = ({
  control,
  name,
  label,
  type,
  onKeyDown,
  fullWidth,
  autoFocus,
  multiline,
  rows,
  autoComplete,
}) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <TextField
          label={label}
          type={type}
          onChange={onChange}
          value={value}
          onKeyDown={onKeyDown}
          fullWidth={fullWidth}
          autoFocus={autoFocus}
          multiline={multiline}
          rows={rows}
          autoComplete={autoComplete}
        />
      )}
    />
  );
};
