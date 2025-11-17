import {
  FaceFrownIcon,
  FaceSmileIcon,
  ScaleIcon,
} from "@heroicons/react/24/outline";
import { currencyEUR } from "../../../lib/formatters/currencyFormat";
import type { DashboardSummary } from "../types";

type Props = { summary?: DashboardSummary };

export default function SummaryCards({ summary }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

      {/* Balance */}
      <div className="p-4 rounded-md border border-[var(--color-primary)] bg-[var(--color-card)]">
        <div className="flex items-center gap-2 text-sm text-[var(--color-text)]/70">
          <ScaleIcon className="w-5 h-5 text-cyan-500" />
          <span>Balance</span>
        </div>
        <div className="mt-2 text-xl font-semibold text-[var(--color-text)]">
          {summary ? currencyEUR(summary.balance) : "—"}
        </div>
      </div>

      {/* Income */}
      <div className="p-4 rounded-md border border-[var(--color-primary)] bg-[var(--color-card)]">
        <div className="flex items-center gap-2 text-sm text-[var(--color-text)]/70">
          <FaceSmileIcon className="w-5 h-5 text-green-500" />
          <span>Income</span>
        </div>
        <div className="mt-2 text-xl font-semibold text-[var(--color-text)]">
          {summary ? currencyEUR(summary.income) : "—"}
        </div>
      </div>

      {/* Expenses */}
      <div className="p-4 rounded-md border border-[var(--color-primary)] bg-[var(--color-card)]">
        <div className="flex items-center gap-2 text-sm text-[var(--color-text)]/70">
          <FaceFrownIcon className="w-5 h-5 text-red-500" />
          <span>Expenses</span>
        </div>
        <div className="mt-2 text-xl font-semibold text-[var(--color-text)]">
          {summary ? currencyEUR(summary.expense) : "—"}
        </div>
      </div>

    </div>
  );
}