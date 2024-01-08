import { Divider, styled } from "@mui/material";

interface Props {
  uniformSpacing?: boolean;
}

export const DividerWithPadding = styled(Divider)<Props>(
  ({ theme, uniformSpacing }) => ({
    margin: `${theme.spacing(uniformSpacing ? 8 : 4)} 0 ${theme.spacing(
      8
    )} 0 !important`,
  })
);
