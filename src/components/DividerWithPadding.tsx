import { Divider, styled } from "@mui/material";

export const DividerWithPadding = styled(Divider)(({ theme }) => ({
  margin: `${theme.spacing(4)} 0 ${theme.spacing(8)} 0 !important`,
}));
