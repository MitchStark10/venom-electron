import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { CoreModal } from "./CoreModal";
import { NewListModal } from "./NewListModal";
import { TaskModal } from "./TaskModal";
import { DeleteAccountModal } from "./DeleteAccountModal";
import { QuickDueDateModal } from "./QuickDueDateModal";
import { QuickListChangeModal } from "./QuickListChangeModal";
import { QuickTagsChangeModal } from "./QuickTagsChangeModal";

const MODAL_MAP = {
  newList: NewListModal,
  task: TaskModal,
  deleteAccount: DeleteAccountModal,
  quickDueDateEdit: QuickDueDateModal,
  quickListChange: QuickListChangeModal,
  quickTagsChange: QuickTagsChangeModal,
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
