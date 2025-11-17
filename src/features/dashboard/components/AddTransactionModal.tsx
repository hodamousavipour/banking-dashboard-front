// src/features/dashboard/components/AddTransactionModal.tsx
import { Modal } from "../../../shared/components/Modal";
import TransactionForm from "../../transactions/components/TransactionForm";
import type { CreateTransactionInput } from "../../transactions/types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: CreateTransactionInput) => void;
  isSubmitting?: boolean; // 👈 این رو اضافه کن
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
        onSubmit={onAdd}          // 👈 فقط به بالا پاس می‌دیم
        submitLabel="Add"
        isSubmitting={isSubmitting} // 👈 از بیرون می‌آد
      />
    </Modal>
  );
}