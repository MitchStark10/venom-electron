import {
  ButtonProps,
  CircularProgress,
  Button as MuiButton,
} from "@mui/material";
import { FC } from "react";

interface Props extends ButtonProps {
  loading?: boolean;
}

export const Button: FC<Props> = ({ loading, disabled, children, ...rest }) => {
  return (
    <MuiButton {...rest} disabled={loading || disabled}>
      {children}{" "}
      {loading && <CircularProgress size="10px" sx={{ marginLeft: "4px" }} />}
    </MuiButton>
  );
};
