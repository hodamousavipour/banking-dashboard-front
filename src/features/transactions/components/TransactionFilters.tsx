import { Select } from "../../../shared/components/Select";
import { Input } from "../../../shared/components/Input";
import { Button } from "../../../shared/components/Button";
import type { TransactionKindFilter } from "../types";

type Props = {
  q: string;
  setQ: (v: string) => void;
  from: string;
  setFrom: (v: string) => void;
  to: string;
  setTo: (v: string) => void;
  kind: TransactionKindFilter;
  setKind: (k: TransactionKindFilter) => void;
  reset: () => void;
};

export default function TransactionFilters({
  q,
  setQ,
  from,
  setFrom,
  to,
  setTo,
  kind,
  setKind,
  reset,
}: Props) {
  return (
    <div className="flex flex-wrap items-end gap-3">

      {/* Search */}
      <div>
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          label="Description"
          placeholder="Search description…"
          className="w-44"
        />
      </div>

      {/* From */}
      <Input
        type="date"
        value={from || ""}
        onChange={(e) => setFrom(e.target.value)}
        label="From"
        className="date-no-placeholder w-40"
      />

      {/* To */}
      <Input
        type="date"
        value={to || ""}
        onChange={(e) => setTo(e.target.value)}
        label="To"
        className="date-no-placeholder w-40"
      />

      {/* Dropdown using Select component */}
      <Select
        label="Type"
        value={kind}
        onChange={(e) =>
          setKind(e.target.value as TransactionKindFilter)
        }
        className="w-40"
        options={[
          { value: "all", label: "All Transactions" },
          { value: "deposits", label: "Only Deposits" },
          { value: "withdrawals", label: "Only Withdrawals" },
        ]}
      />

      {/* Reset */}
      <div>
        <label className="text-xs text-transparent select-none">Reset</label>
        <Button variant="primary" size="sm" onClick={reset}>
          Reset Filters
        </Button>
      </div>
    </div>
  );
}