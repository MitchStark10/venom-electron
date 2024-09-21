import { List } from "./List";
import { TaskTag } from "./TaskTag";

export interface Task {
  id: number;
  taskName: string;
  dueDate?: string | null;
  listViewOrder?: number;
  timeViewOrder?: number;
  isCompleted?: boolean;
  list?: List;
  listId?: number;
  taskTag?: TaskTag[];
  tagIds?: number[];
}
