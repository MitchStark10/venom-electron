import { styled } from "@mui/material";

const FocusContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
  padding: `${theme.spacing(32)} ${theme.spacing(16)}`,
}));

export const FocusView = () => {
  return <FocusContainer>TODO: FocusView</FocusContainer>;
};
