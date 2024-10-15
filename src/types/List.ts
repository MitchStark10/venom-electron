import { Task } from "./Task";

export interface List {
  id: number;
  order: number;
  listName: string;
  tasks: Task[];
  isStandupList?: boolean;
}
