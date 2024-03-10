import { Task } from "../types/Task";

type Group = [string, Task[]];

export const groupByDateSorter = (a: Group, b: Group) => {
  const aDate = a[0];
  const bDate = b[0];

  if (bDate === "No Due Date") {
    return -1;
  } else if (aDate === "No Due Date") {
    return 1;
  }

  return new Date(aDate) > new Date(bDate) ? 1 : -1;
};
