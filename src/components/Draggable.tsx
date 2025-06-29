import { useDraggable } from "@dnd-kit/core";
import { FC } from "react";
import { CSS } from "@dnd-kit/utilities";

interface DraggableProps {
  id: string;
  children: React.ReactNode;
}

export const Draggable: FC<DraggableProps> = (props) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: props.id,
  });
  const style = { transform: CSS.Translate.toString(transform) };
  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {" "}
      {props.children}{" "}
    </div>
  );
};
