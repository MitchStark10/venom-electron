import { List } from "./List";
import { Tag } from "./Tag";

export interface Task {
  id: number;
  taskName: string;
  dueDate?: string | null;
  listViewOrder?: number;
  timeViewOrder?: number;
  isCompleted?: boolean;
  list?: List;
  tags?: Tag[];
  tagIds?: number[];
}
