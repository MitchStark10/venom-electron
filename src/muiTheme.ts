import { createTheme } from "@mui/material";

export const createMuiTheme = (mode: "light" | "dark") =>
  createTheme({
    palette: {
      mode: mode,
    },
    spacing: 2,
  });
