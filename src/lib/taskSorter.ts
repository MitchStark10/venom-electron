import moment from "moment";
import { Task } from "../types/Task";

export const useTaskSorter = (field: "listViewOrder" | "combinedViewOrder") => {
  const taskSorter = (a: Task, b: Task) => {

    // Move completed tasks to the bottom
    if (a.isCompleted && !b.isCompleted) {
      return 1;
    } else if (!a.isCompleted && b.isCompleted) {
      return -1;
    }

    if (!a.dueDate && !b.dueDate) {
      return 0;
    } else if (!a.dueDate) {
      return 1;
    } else if (!b.dueDate) {
      return -1;
    } else if (a.dueDate === b.dueDate) {
      const listAViewOrder = a[field] ?? Infinity;
      const listBViewOrder = b[field] ?? Infinity;

      // Check the sort order
      if (listAViewOrder > listBViewOrder) {
        return 1;
      } else if (listBViewOrder > listAViewOrder) {
        return -1;
      } else {
        return 0;
      }
    }

    return moment(a.dueDate).isBefore(moment(b.dueDate)) ? -1 : 1;
  };

  return taskSorter;
};
