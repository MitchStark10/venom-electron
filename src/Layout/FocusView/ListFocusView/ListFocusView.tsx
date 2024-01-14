import { TaskAlt } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { EditableText } from "../../../components/EditableText";
import {
  useListsQuery,
  useUpdateListMutation,
} from "../../../store/slices/listSlice";
import { RootState } from "../../../store/store";
import { NewTaskForm } from "./NewTaskForm";
import { TaskCard } from "./TaskCard";

export const ListFocusView = () => {
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const { selectedListId } = useSelector(
    (state: RootState) => state.focusView,
    shallowEqual
  );
  const [updateListName] = useUpdateListMutation();
  const { data: lists } = useListsQuery();
  const selectedList = lists?.find((list) => list.id === selectedListId);
  const handleListNameChange = (newListName: string) => {
    if (newListName && selectedListId) {
      updateListName({ id: selectedListId.toString(), listName: newListName });
    }
  };

  return (
    <div>
      <EditableText
        displayAs="h1"
        initialValue={selectedList?.listName}
        onSave={handleListNameChange}
        displayIcon={<TaskAlt sx={{ marginRight: "10px" }} />}
      />

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
