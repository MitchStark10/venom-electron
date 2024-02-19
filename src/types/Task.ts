import { List } from "./List";

export interface Task {
  id: number;
  taskName: string;
  dueDate?: string | null;
  listViewOrder?: number;
  timeViewOrder?: number;
  isCompleted?: boolean;
  list?: List;
}
