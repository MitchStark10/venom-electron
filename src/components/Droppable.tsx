import { useDroppable } from "@dnd-kit/core";
import { FC } from "react";

interface DroppableProps {
  id: string;
  children: React.ReactNode;
}

export const Droppable: FC<DroppableProps> = (props) => {
  const { isOver, setNodeRef } = useDroppable({ id: props.id });

  return (
    <div
      ref={setNodeRef}
    >
      {props.children}
    </div>
  );
};
