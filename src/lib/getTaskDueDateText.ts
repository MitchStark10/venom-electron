import moment from "moment";

export const getTaskDueDateText = (dueDate?: string | null, isCompleted?: boolean) => {
  if (isCompleted) {
    return "Completed";
  } else if (
    moment(dueDate).format("YYYY-MM-DD") ===
    moment().startOf("day").format("YYYY-MM-DD")
  ) {
    return "Due today";
  }

  return dueDate
    ? `Due ${moment(dueDate).from(moment().startOf("day"))} (${moment(
        dueDate
      ).format("dddd, MM/DD")})`
    : "No due date";
};
