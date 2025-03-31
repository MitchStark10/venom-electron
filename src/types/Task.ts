import { List } from "./List";
import { TaskTag } from "./TaskTag";

export interface Task {
  id: number;
  taskName: string;
  dueDate?: string | null;
  dateCompleted?: string | null;
  listViewOrder?: number;
  combinedViewOrder?: number;
  isCompleted?: boolean;
  list?: List;
  listId?: number;
  taskTag?: TaskTag[];
  tagIds?: number[];
}
