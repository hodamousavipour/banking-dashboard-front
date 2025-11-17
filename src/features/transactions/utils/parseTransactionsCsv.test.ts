import { describe, it, expect } from "vitest";
import { parseTransactionsCsv } from "./parseTransactionsCsv";
import type { Transaction } from "../types";

describe("parseTransactionsCsv", () => {
  it("returns error when file is empty", () => {
    const result = parseTransactionsCsv("", []);
    expect(result.toCreate).toHaveLength(0);
    expect(result.errors).toEqual(["File is empty"]);
    expect(result.duplicateCount).toBe(0);
  });

  it("returns error when header is invalid", () => {
    const csv = `date,amount,desc,type
2024-02-01,1000.50,Salary,Deposit`;

    const result = parseTransactionsCsv(csv, []);
    expect(result.toCreate).toHaveLength(0);
    expect(result.errors[0]).toMatch(/Invalid header/);
  });

  it("parses valid rows and normalizes sign by type", () => {
    const csv = `Date,Amount,Description,Type
2024-02-01,1000.50,Salary,Deposit
2024-02-02,50.25,Grocery,Withdrawal`;

    const result = parseTransactionsCsv(csv, []);

    expect(result.errors).toEqual([]);
    expect(result.duplicateCount).toBe(0);
    expect(result.toCreate).toEqual([
      {
        date: "2024-02-01",
        description: "Salary",
        amount: 1000.5, 
      },
      {
        date: "2024-02-02",
        description: "Grocery",
        amount: -50.25, 
      },
    ]);
  });

  it("detects duplicates vs existing and inside file", () => {
    const existing: Transaction[] = [
      {
        id: 1,
        date: "2024-02-01T00:00:00.000Z",
        amount: 1000.5,
        description: "Salary",
      },
    ];

    const csv = `Date,Amount,Description,Type
2024-02-01,1000.50,Salary,Deposit
2024-02-02,-10.00,Coffee,Withdrawal
2024-02-02,-10.00,Coffee,Withdrawal`;

    const result = parseTransactionsCsv(csv, existing);

    // first row duplicate of existing, 3rd duplicate of 2nd inside file
    expect(result.duplicateCount).toBe(2);
    expect(result.toCreate).toEqual([
      {
        date: "2024-02-02",
        description: "Coffee",
        amount: -10,
      },
    ]);
  });

  it("collects validation errors for bad rows", () => {
    const csv = `Date,Amount,Description,Type
not-a-date,100,Something,Deposit
2024-02-02,abc,Something,Deposit
2024-02-03,100,,Deposit
2024-02-04,100,Something,Other`;

    const result = parseTransactionsCsv(csv, []);

    expect(result.toCreate).toHaveLength(0);
    expect(result.errors).toHaveLength(4);
    expect(result.errors[0]).toMatch(/Invalid date/);
    expect(result.errors[1]).toMatch(/Invalid amount/);
    expect(result.errors[2]).toMatch(/Description is required/);
    expect(result.errors[3]).toMatch(/Type must be "Deposit" or "Withdrawal"/);
  });
});