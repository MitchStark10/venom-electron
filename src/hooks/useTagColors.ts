import { useTheme } from "@mui/material";

export interface TagColorMap {
  background: Record<string, string>;
  text: Record<string, string>;
}

export const useTagColors = (): TagColorMap => {
  const theme = useTheme();
  const textColor = theme.palette.mode === "dark" ? "#FFF" : "#000";

  return {
    background: {
      blue: theme.palette.primary[theme.palette.mode],
      red: theme.palette.error[theme.palette.mode],
      green: theme.palette.success[theme.palette.mode],
      orange: theme.palette.warning[theme.palette.mode],
    },
    text: {
      blue: textColor,
      red: textColor,
      green: textColor,
      orange: textColor,
    },
  };
};
