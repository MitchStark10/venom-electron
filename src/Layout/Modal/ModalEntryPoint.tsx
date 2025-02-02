import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { CoreModal } from "./CoreModal";
import { NewListModal } from "./NewListModal";
import { TaskModal } from "./TaskModal";
import { DeleteAccountModal } from "./DeleteAccountModal";

const MODAL_MAP = {
  newList: NewListModal,
  task: TaskModal,
  deleteAccount: DeleteAccountModal,
};

export const ModalEntryPoint = () => {
  const { isModalOpen, modalView } = useSelector(
    (state: RootState) => state.modal
  );

  if (!isModalOpen || !modalView) {
    return null;
  }

  const SubComp = MODAL_MAP[modalView];

  return (
    <CoreModal>
      <SubComp />
    </CoreModal>
  );
};
