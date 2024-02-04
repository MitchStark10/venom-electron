export interface Task {
  id: number;
  taskName: string;
  dueDate?: string | null;
  listViewOrder?: number;
  timeViewOrder?: number;
}
