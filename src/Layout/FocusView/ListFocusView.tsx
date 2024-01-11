import { TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  useListsQuery,
  useUpdateListMutation,
} from "../../store/slices/listSlice";
import { RootState } from "../../store/store";

export const ListFocusView = () => {
  const { selectedListId } = useSelector((state: RootState) => state.focusView);
  const [isEditingListName, setIsEditingListName] = useState(false);
  const [updateListName] = useUpdateListMutation();
  const [newListName, setNewListName] = useState<string>("");
  const { data: lists } = useListsQuery();

  const handleListNameBlur = () => {
    if (newListName && selectedListId) {
      updateListName({ id: selectedListId.toString(), listName: newListName });
    }
    setIsEditingListName(false);
  };

  const handleNameClick = () => {
    setIsEditingListName(true);
  };

  const handleListNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewListName(e.target.value);
  };

  useEffect(() => {
    if (lists && selectedListId) {
      const selectedList = lists.find((list) => list.id === selectedListId);
      if (selectedList) {
        setNewListName(selectedList.listName);
      }
    }
  }, [lists, selectedListId]);

  return (
    <>
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
        <h1 onClick={handleNameClick}>{newListName}</h1>
      )}
    </>
  );
};
