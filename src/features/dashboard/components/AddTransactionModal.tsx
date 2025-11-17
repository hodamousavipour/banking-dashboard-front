import { Modal } from "../../../shared/components/Modal";
import TransactionForm from "../../transactions/components/TransactionForm";
import type { CreateTransactionInput } from "../../transactions/types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: CreateTransactionInput) => void;
  isSubmitting?: boolean;
};

export default function AddTransactionModal({
  isOpen,
  onClose,
  onAdd,
  isSubmitting,
}: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Transaction">
      <TransactionForm
        onSubmit={onAdd}
        submitLabel="Add"
        isSubmitting={isSubmitting}
      />
    </Modal>
  );
}