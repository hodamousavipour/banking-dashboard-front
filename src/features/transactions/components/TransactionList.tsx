import type { Transaction } from "../types";
import TransactionRow from "./TransactionRow";

type Props = {
  items: Transaction[];
  onEdit: (tx: Transaction) => void;
  onDelete: (tx: Transaction) => void;
  onReuse: (tx: Transaction) => void;
};

export default function TransactionList({ items, onEdit, onDelete, onReuse }: Props) {
    console.log("🧾 TransactionList items:", items.map(t => ({ id: t.id, amount: t.amount })));

    if (!items.length) {
    return <div className="text-sm text-gray-500">No transactions.</div>;
  }
  return (
    
    <div className="flex flex-col gap-2">
      {items.map((tx) => (
        <TransactionRow
          key={tx.id}
          tx={tx}
          onEdit={onEdit}
          onReuse={onReuse}
          onDelete={() => onDelete(tx)}
        />
      ))}
    </div>
  );
}