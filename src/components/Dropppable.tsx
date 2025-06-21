import { useDroppable } from "@dnd-kit/core";
import {FC} from "react";

interface DroppableProps {
  id: string;
  children: React.ReactNode;
}

export const Droppable: FC<DroppableProps> = (props) => {
  const { isOver, setNodeRef } = useDroppable({ id: props.id });
  const style = { opacity: isOver ? 1 : 0.5 };
  return (
    <div ref={setNodeRef} style={style}>
      {" "}
      {props.children}{" "}
    </div>
  );
}
