// src/features/transactions/components/TransactionForm.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TransactionForm from "./TransactionForm";

describe("TransactionForm", () => {
  it("submits valid data via onSubmit", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(<TransactionForm onSubmit={handleSubmit} />);

    const amountInput = screen.getByPlaceholderText(/1200 or -50.75/i);
    const descriptionInput = screen.getByPlaceholderText(/salary, grocery shopping/i);
    const dateInput = screen.getByLabelText(/date/i);

    await user.clear(amountInput);
    await user.type(amountInput, "123.45");
    await user.type(descriptionInput, "Test payment");
    await user.clear(dateInput);
    await user.type(dateInput, "2024-02-01");

    const submitButton = screen.getByRole("button", { name: /add transaction/i });
    await user.click(submitButton);

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith({
      amount: 123.45,
      description: "Test payment",
      date: "2024-02-01",
    });
  });

  it("prevents overdraft when currentBalance is provided", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(
      <TransactionForm
        onSubmit={handleSubmit}
        currentBalance={100} // فقط 100 یورو داریم
      />
    );

    const amountInput = screen.getByPlaceholderText(/1200 or -50.75/i);
    const descriptionInput = screen.getByPlaceholderText(/salary, grocery shopping/i);
    const dateInput = screen.getByLabelText(/date/i);

    await user.clear(amountInput);
    await user.type(amountInput, "-150"); // بیشتر از موجودی
    await user.type(descriptionInput, "Huge withdrawal");
    await user.clear(dateInput);
    await user.type(dateInput, "2024-02-01");

    const submitButton = screen.getByRole("button", { name: /add transaction/i });
    await user.click(submitButton);

    expect(handleSubmit).not.toHaveBeenCalled();
    expect(screen.getByText(/insufficient funds/i)).toBeInTheDocument();
  });

  it("syncs defaultValues when they change (edit mode)", async () => {
    //const user = userEvent.setup();
    const handleSubmit = vi.fn();

    const { rerender } = render(
      <TransactionForm
        defaultValues={{
          amount: -50,
          description: "Groceries",
          date: "2024-02-02",
        }}
        onSubmit={handleSubmit}
      />
    );

    // مقدار اولیه
    expect(screen.getByDisplayValue("Groceries")).toBeInTheDocument();

    // تغییر props برای شبیه‌سازی ویرایش تراکنش دیگر
    rerender(
      <TransactionForm
        defaultValues={{
          amount: -100,
          description: "Rent",
          date: "2024-02-03",
        }}
        onSubmit={handleSubmit}
      />
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue("Rent")).toBeInTheDocument();
    });
  });
});