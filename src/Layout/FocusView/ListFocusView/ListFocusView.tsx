import {Button, TextField} from "@mui/material";
import {useEffect, useState} from "react";
import {shallowEqual, useSelector} from "react-redux";
import {
  useListsQuery,
  useUpdateListMutation,
} from "../../../store/slices/listSlice";
import {RootState} from "../../../store/store";
import {NewTaskForm} from "./NewTaskForm";
import {TaskCard} from "./TaskCard";

export const ListFocusView = () => {
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const { selectedListId } = useSelector(
    (state: RootState) => state.focusView,
    shallowEqual
  );
  const [isEditingListName, setIsEditingListName] = useState(false);
  const [updateListName] = useUpdateListMutation();
  const [newListName, setNewListName] = useState<string>("");
  const { data: lists } = useListsQuery();
  const selectedList = lists?.find((list) => list.id === selectedListId);

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
    <div>
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

      {selectedList?.tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}

      {showAddTaskForm ? (
        <NewTaskForm
          onAddNewTask={() => setShowAddTaskForm(false)}
          listId={selectedListId}
        />
      ) : (
        <Button variant="contained" onClick={() => setShowAddTaskForm(true)}>
          Add Task
        </Button>
      )}
    </div>
  );
};
