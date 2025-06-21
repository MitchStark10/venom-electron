import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {FC} from "react";

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
    <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {" "}
      {props.children}{" "}
    </button>
  );
}
