import moment from "moment";
import { Task } from "../types/Task";

export const taskSorter = (a: Task, b: Task) => {
  if (!a.dueDate && !b.dueDate) {
    return 0;
  } else if (!a.dueDate) {
    return 1;
  } else if (!b.dueDate) {
    return -1;
  }

  return moment(a.dueDate).isBefore(moment(b.dueDate)) ? -1 : 1;
};
