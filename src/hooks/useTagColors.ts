import { useTheme } from "@mui/material";

export const useTagColors = (): Record<string, string> => {
  const theme = useTheme();

  return {
    blue: theme.palette.primary.main,
    red: theme.palette.error.main,
    green: theme.palette.success.main,
    yellow: theme.palette.warning.main,
  };
};
