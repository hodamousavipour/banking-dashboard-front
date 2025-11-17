import { describe, it, expect } from "vitest";
import { buildTransactionsCsv } from "./buildTransactionsCsv";
import type { Transaction } from "../types";

describe("buildTransactionsCsv", () => {
  it("builds CSV with correct header and rows", () => {
    const txs: Transaction[] = [
      {
        id: 1,
        amount: 1000.5,
        description: "Salary",
        date: "2024-02-01T10:00:00.000Z",
      },
      {
        id: 2,
        amount: -50.25,
        description: "Grocery,supermarket", 
        date: "2024-02-02T09:30:00.000Z",
      },
    ];

    const csv = buildTransactionsCsv(txs);
    const lines = csv.split("\n");

    expect(lines[0]).toBe("Date,Amount,Description,Type");
    expect(lines[1]).toBe("2024-02-01,1000.50,Salary,Deposit");
    // comma in description replaced with space, type = Withdrawal
    expect(lines[2]).toBe("2024-02-02,-50.25,Grocery supermarket,Withdrawal");
  });
});