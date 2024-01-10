import { TextField, styled } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { capitalize } from "../../lib/capitalize";
import {
  useListsQuery,
  useUpdateListMutation,
} from "../../store/slices/listSlice";
import { RootState } from "../../store/store";

const FocusContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
  padding: theme.spacing(16),
}));

export const FocusView = () => {
  const [isEditingListName, setIsEditingListName] = useState(false);
  const { focusView, selectedListId } = useSelector(
    (state: RootState) => state.focusView
  );
  const { data: lists } = useListsQuery();
  const [updateListName] = useUpdateListMutation();

  const [newListName, setNewListName] = useState<string>("");

  useEffect(() => {
    if (lists && selectedListId) {
      const selectedList = lists.find((list) => list.id === selectedListId);
      if (selectedList) {
        setNewListName(selectedList.listName);
      }
    }
  }, [lists, selectedListId]);

  const handleListNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewListName(e.target.value);
  };

  const handleListNameBlur = () => {
    if (newListName && selectedListId) {
      updateListName({ id: selectedListId.toString(), listName: newListName });
    }
    setIsEditingListName(false);
  };

  const handleNameClick = () => {
    if (focusView === "list") {
      setIsEditingListName(true);
    }
  };

  return (
    <FocusContainer>
      {isEditingListName ? (
        <TextField
          label="List Name"
          value={newListName}
          onChange={handleListNameChange}
          onBlur={handleListNameBlur}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              e.stopPropagation();
              handleListNameBlur();
            }
          }}
          sx={{ width: "250px" }}
          autoFocus
        />
      ) : (
        <h1 onClick={handleNameClick}>
          {focusView === "list" ? newListName : capitalize(focusView)}
        </h1>
      )}
    </FocusContainer>
  );
};
