import { styled } from "@mui/material";

export const FormHeader = styled("h2")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(2),
  margin: theme.spacing(1),
}));