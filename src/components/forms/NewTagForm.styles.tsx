import { styled } from "@mui/material";

export const TagFormContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  gap: theme.spacing(1),
  padding: theme.spacing(1),
  width: "250px",
}));
