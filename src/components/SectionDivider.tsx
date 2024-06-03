import { styled } from "@mui/material";

export const SectionDivider = styled("h2")(({ theme }) => ({
  margin: theme.spacing(1),
  borderBottom: "1px solid",
  borderColor: theme.palette.mode === "dark" ? "white" : "black",
}));
