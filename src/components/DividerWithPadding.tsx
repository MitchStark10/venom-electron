import { Divider, styled } from "@mui/material";

interface Props {
  uniformSpacing?: boolean;
}

export const DividerWithPadding = styled(Divider)<Props>(
  ({ theme, uniformSpacing }) => ({
    margin: `${theme.spacing(uniformSpacing ? 1 : 0.5)} 0 ${theme.spacing(
      1
    )} 0 !important`,
    color: theme.palette.mode === "dark" ? "white" : undefined,
  })
);
