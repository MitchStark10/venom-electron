import { Typography, styled } from "@mui/material";

export const ErrorText = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.main,
}));
