import { useDroppable } from "@dnd-kit/core";
import { CSSProperties, FC } from "react";

interface DroppableProps {
  id: string;
  children: React.ReactNode;
}

export const Droppable: FC<DroppableProps> = (props) => {
  const { isOver, setNodeRef } = useDroppable({ id: props.id });

  const dragOverStyles: CSSProperties = {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    minHeight: "50px",
  };

  return (
    <div ref={setNodeRef} style={isOver ? dragOverStyles : undefined}>
      {" "}
      {props.children}{" "}
    </div>
  );
};
