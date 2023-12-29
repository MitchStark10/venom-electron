import { styled } from "@mui/material";

export const VerticalAlignmentContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  gap: theme.spacing(4),
}));
