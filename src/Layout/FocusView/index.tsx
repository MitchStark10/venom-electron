import { styled } from "@mui/material";
import { useSelector } from "react-redux";
import { capitalize } from "../../lib/capitalize";
import { RootState } from "../../store/store";
import { ListFocusView } from "./ListFocusView/ListFocusView";

const FocusContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
  padding: theme.spacing(16),
}));

export const FocusView = () => {
  const { focusView } = useSelector((state: RootState) => state.focusView);

  return (
    <FocusContainer>
      {focusView === "list" ? (
        <ListFocusView />
      ) : (
        <h1>{capitalize(focusView)}</h1>
      )}
    </FocusContainer>
  );
};
