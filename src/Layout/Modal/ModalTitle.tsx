import { styled } from "@mui/material";

export const ModalTitle = styled("h2")(({ theme }) => ({
  color: theme.palette.mode === "dark" ? "white" : "black",
  fontSize: "1.5rem",
  fontWeight: "bold",
  margin: `0 0 ${theme.spacing(1)} 0`,
}));
