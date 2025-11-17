// src/features/dashboard/components/AddTransactionModal.tsx
import { Modal } from "../../../shared/components/Modal";
import TransactionForm from "../../transactions/components/TransactionForm";
import type { CreateTransactionInput } from "../../transactions/types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: CreateTransactionInput) => void;
};

export default function AddTransactionModal({ isOpen, onClose, onAdd }: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Transaction">
      <TransactionForm
        onSubmit={(values) => {
          onAdd(values);
          onClose();
        }}
        submitLabel="Add"
      />
    </Modal>
    
  );
}