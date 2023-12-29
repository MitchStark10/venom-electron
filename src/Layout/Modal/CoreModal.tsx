import { Box, Modal, styled } from "@mui/material";
import { FC, PropsWithChildren } from "react";
import { useDispatch } from "react-redux";
import { setIsModalOpen } from "../../store/slices/modalSlice";

const ModalBox = styled(Box)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? theme.palette.grey[800]
      : theme.palette.grey[50],
  display: "flex",
  flexDirection: "row",
  border: "1px solid black",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: "200px",
  padding: theme.spacing(8),
  borderRadius: "4px",
}));

export const CoreModal: FC<PropsWithChildren> = ({ children }) => {
  const dispatch = useDispatch();
  return (
    <Modal open={true} onClose={() => dispatch(setIsModalOpen(false))}>
      <ModalBox>{children}</ModalBox>
    </Modal>
  );
};
