import { FC, ReactNode } from "react";

interface Props {
  icon: ReactNode;
  title: string;
}

export const SidebarMenuItem: FC<Props> = ({ icon, title }) => {
  return (
    <div>
      {icon}
      {title}
    </div>
  );
};
