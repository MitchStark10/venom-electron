import { styled } from "@mui/material";
import { useSelector } from "react-redux";
import { capitalize } from "../../lib/capitalize";
import { useListsQuery } from "../../store/slices/listSlice";
import { RootState } from "../../store/store";

const FocusContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
  padding: theme.spacing(16),
}));

export const FocusView = () => {
  const { focusView, selectedListId } = useSelector(
    (state: RootState) => state.focusView
  );
  const { data: lists } = useListsQuery();

  const selectedListName = lists?.find(
    (list) => list.id === selectedListId
  )?.listName;

  return (
    <FocusContainer>
      <h1>{focusView === "list" ? selectedListName : capitalize(focusView)}</h1>
    </FocusContainer>
  );
};
