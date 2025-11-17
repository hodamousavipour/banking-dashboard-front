import type { Transaction } from "../types";
import { Button } from "../../../shared/components/Button";
import { currencyEUR } from "../../../lib/formatters/currencyFormat";

type Props = {
  tx: Transaction;
  onEdit: (tx: Transaction) => void;
  onDelete: (id: number) => void;
  onReuse: (tx: Transaction) => void;
};

export default function TransactionRow({ tx, onEdit, onDelete, onReuse }: Props) {
  return (
    <div className="grid grid-cols-4 items-center border border-gray-300 rounded-md p-3 gap-4">

      {/* Amount */}
      <div className="font-semibold">
        <span className={tx.amount >= 0 ? "text-green-600" : "text-red-600"}>
          {currencyEUR(tx.amount)}
        </span>
      </div>

      {/* Description */}
      <div className="text-gray-800">{tx.description}</div>

      {/* Date */}
      <div className="text-xs text-gray-800">
        {new Date(tx.date).toLocaleDateString()}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2">
        <Button
          variant="secondary"
          size="sm"
          type="button"
          onClick={() => onReuse(tx)}
        >
          Reuse
        </Button>
        <Button
          variant="primary"
          size="sm"
          type="button"
          onClick={() => onEdit(tx)}
        >
          Edit
        </Button>
        <Button
          variant="danger"
          size="sm"
          type="button"
          onClick={() => onDelete(tx.id)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}