import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FC } from "react";

interface DraggableProps {
  id: string;
  children: React.ReactNode;
}

export const Draggable: FC<DraggableProps> = (props) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: props.id,
      animateLayoutChanges: () => true,
    });

  const style = { transform: CSS.Translate.toString(transform), transition };
  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {" "}
      {props.children}{" "}
    </div>
  );
};
