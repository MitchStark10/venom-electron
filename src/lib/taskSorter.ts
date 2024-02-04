import moment from "moment";
import { Task } from "../types/Task";

export const taskSorter = (a: Task, b: Task) => {
  if (!a.dueDate && !b.dueDate) {
    return 0;
  } else if (!a.dueDate) {
    return 1;
  } else if (!b.dueDate) {
    return -1;
  } else if (
    moment(a.dueDate).format("MM/DD/YYYY") ===
    moment(b.dueDate).format("MM/DD/YYYY")
  ) {
    const listAViewOrder = a.listViewOrder || Infinity;
    const listBViewOrder = b.listViewOrder || Infinity;

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
