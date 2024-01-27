import { TaskAlt } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useState } from "react";
import { Draggable } from "react-drag-reorder";
import { shallowEqual, useSelector } from "react-redux";
import { EditableText } from "../../../components/EditableText";
import {
  useListsQuery,
  useUpdateListMutation,
} from "../../../store/slices/listSlice";
import { useReorderTaskMutation } from "../../../store/slices/taskSlice";
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
  const [reorderTask] = useReorderTaskMutation();
  const { data: lists } = useListsQuery();

  const selectedList = lists?.find((list) => list.id === selectedListId);
  const handleListNameChange = (newListName: string) => {
    if (newListName && selectedListId) {
      updateListName({ id: selectedListId.toString(), listName: newListName });
    }
  };

  const onReorder = (prevPos: number, newPos: number) => {
    const taskId = selectedList?.tasks[prevPos].id?.toString();

    if (!taskId) {
      return;
    }

    reorderTask({
      fieldToUpdate: "listViewOrder",
      taskId,
      newOrder: newPos,
    });
  };

  return (
    <div>
      <EditableText
        displayAs="h1"
        initialValue={selectedList?.listName}
        onSave={handleListNameChange}
        displayIcon={<TaskAlt sx={{ marginRight: "10px" }} />}
      />

      {selectedList?.tasks && selectedList?.tasks.length > 0 && (
        <Draggable
          key={selectedList.tasks.map((task) => task.id).join("-")}
          onPosChange={onReorder}
        >
          {selectedList?.tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </Draggable>
      )}

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
