import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createTransactionSchema,
  type CreateTransactionFormData,
} from "../validation/transactionSchemas";
import { Button } from "../../../shared/components/Button";
import { Input } from "../../../shared/components/Input";

type Props = {
  defaultValues?: Partial<CreateTransactionFormData>;
  onSubmit: (data: CreateTransactionFormData) => void;
  isSubmitting?: boolean;
  currentBalance?: number;
  submitLabel?: string;
  onCancel?: () => void;
};

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

export default function TransactionForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  currentBalance,
  submitLabel,
  onCancel,
}: Props) {
  const emptyDefaults: CreateTransactionFormData = {
    amount: "" as unknown as number,
    description: "",
    date: getToday(),
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitSuccessful },
    setError,
    reset,
  } = useForm<CreateTransactionFormData>({
    resolver: zodResolver(createTransactionSchema),
    mode: "onChange",
    defaultValues: {
      ...emptyDefaults,
      ...defaultValues,
      date: defaultValues?.date ?? getToday(),
    },
  });

  useEffect(() => {
    const nextValues: CreateTransactionFormData = {
      ...emptyDefaults,
      ...defaultValues,
      date: defaultValues?.date ?? getToday(),
    };

    reset(nextValues);
  }, [defaultValues?.amount, defaultValues?.description, defaultValues?.date, reset]);

  const submit = (data: CreateTransactionFormData) => {
    if (
      currentBalance != null &&
      data.amount < 0 &&
      Math.abs(data.amount) > currentBalance
    ) {
      setError("amount", { message: "Insufficient funds" });
      return;
    }

    onSubmit(data);
  };

  useEffect(() => {
    if (isSubmitSuccessful && !defaultValues) {
      reset(emptyDefaults);
    }
  }, [isSubmitSuccessful, defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="space-y-3">
      {/* Amount */}
      <div>
        <label className="block text-sm mb-1" htmlFor="amount">
    Amount <span className="text-red-500">*</span>
    <span className="text-xs text-[var(--color-text-secondary)]">
      {" "}
      (use negative for withdrawals)
    </span>
  </label>

        <Input
          type="number"
          step="0.01"
          inputMode="decimal"
          {...register("amount", { valueAsNumber: true })}
          aria-invalid={!!errors.amount}
          placeholder="e.g. 1200 or -50.75"
        />

        {errors.amount && (
          <p className="text-xs text-red-500 mt-1">{errors.amount.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm mb-1" htmlFor="description">
    Description <span className="text-red-500">*</span>
  </label>
        <Input
          type="text"
          placeholder="e.g., Salary, Grocery Shopping"
          {...register("description")}
          aria-invalid={!!errors.description}
        />
        {errors.description && (
          <p className="text-xs text-red-500 mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm mb-1" htmlFor="date">
    Date <span className="text-red-500">*</span>
  </label>

        <Input
          type="date"
          {...register("date")}
          aria-invalid={!!errors.date}
        />

        {errors.date && (
          <p className="text-xs text-red-500 mt-1">{errors.date.message}</p>
        )}
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={!isValid || isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : submitLabel ?? (defaultValues ? "Save changes" : "Add transaction")}
        </Button>

        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}