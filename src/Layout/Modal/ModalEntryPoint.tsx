import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { CoreModal } from "./CoreModal";
import { NewListModal } from "./NewListModal";

const MODAL_MAP = {
  newList: NewListModal,
};

export const ModalEntryPoint = () => {
  const { isModalOpen, modalView } = useSelector(
    (state: RootState) => state.modal
  );

  if (!isModalOpen) {
    return null;
  }

  const SubComp = MODAL_MAP[modalView];

  return (
    <CoreModal>
      <SubComp />
    </CoreModal>
  );
};
