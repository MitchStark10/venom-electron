import { createTheme } from "@mui/material";

export const createMuiTheme = (mode: "light" | "dark") =>
  createTheme({
    palette: {
      mode: mode,
    },
  });

export const HEADER_HEIGHT = "80px";
