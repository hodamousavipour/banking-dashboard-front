// src/features/transactions/utils/parseTransactionsCsv.ts
import type { CreateTransactionInput, Transaction } from "../types";

export type CsvTransactionType = "Deposit" | "Withdrawal";

interface ParsedCsvResult {
  toCreate: CreateTransactionInput[];
  errors: string[];
  duplicateCount: number;
}

// very small helper – because format is fixed and simple
function safeSplit(line: string): string[] {
  // For this task we assume no quoted commas in description.
  return line.split(",").map((c) => c.trim());
}

function isValidDateIso(date: string): boolean {
  // expecting YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const d = new Date(date);
  return !Number.isNaN(d.getTime());
}

export function parseTransactionsCsv(
  text: string,
  existing: Transaction[]
): ParsedCsvResult {
  const errors: string[] = [];
  const toCreate: CreateTransactionInput[] = [];

  const normalized = text.trim();
  if (!normalized) {
    return { toCreate: [], errors: ["File is empty"], duplicateCount: 0 };
  }

  const lines = normalized.split(/\r?\n/);

  if (lines.length < 2) {
    return {
      toCreate: [],
      errors: ["CSV must contain a header and at least one data row"],
      duplicateCount: 0,
    };
  }

  const header = safeSplit(lines[0]).map((c) => c.toLowerCase());
  const expected = ["date", "amount", "description", "type"];

  const headerOk =
    header.length === expected.length &&
    expected.every((col, idx) => header[idx] === col);

  if (!headerOk) {
    return {
      toCreate: [],
      errors: [
        "Invalid header. Expected: Date,Amount,Description,Type (in this exact order)",
      ],
      duplicateCount: 0,
    };
  }

  // prepare duplicate detection
  const existingKeys = new Set(
    existing.map((tx) =>
      [
        tx.date.slice(0, 10),
        tx.amount,
        tx.description.trim().toLowerCase(),
      ].join("|")
    )
  );

  const newKeys = new Set<string>();
  let duplicateCount = 0;

  lines.slice(1).forEach((line, index) => {
    const lineNumber = index + 2; // 1-based + header

    if (!line.trim()) {
      // skip empty lines
      return;
    }

    const cols = safeSplit(line);
    if (cols.length !== 4) {
      errors.push(`Line ${lineNumber}: Expected 4 columns, found ${cols.length}`);
      return;
    }

    const [dateRaw, amountRaw, descriptionRaw, typeRaw] = cols;
    const date = dateRaw;
    const description = descriptionRaw;
    const typeStr = typeRaw.toLowerCase();
    const type: CsvTransactionType =
      typeStr === "deposit"
        ? "Deposit"
        : typeStr === "withdrawal"
        ? "Withdrawal"
        : (null as never);

    if (!isValidDateIso(date)) {
      errors.push(`Line ${lineNumber}: Invalid date "${date}"`);
      return;
    }

    const amountNum = Number(amountRaw.replace(",", "."));
    if (!Number.isFinite(amountNum)) {
      errors.push(`Line ${lineNumber}: Invalid amount "${amountRaw}"`);
      return;
    }

    if (!description) {
      errors.push(`Line ${lineNumber}: Description is required`);
      return;
    }

    if (!type) {
      errors.push(
        `Line ${lineNumber}: Type must be "Deposit" or "Withdrawal", got "${typeRaw}"`
      );
      return;
    }

    let amount = amountNum;

    // normalize sign based on Type
    if (type === "Deposit" && amount <= 0) {
      amount = Math.abs(amount);
    }
    if (type === "Withdrawal" && amount >= 0) {
      amount = -Math.abs(amount);
    }

    const key = [date, amount, description.trim().toLowerCase()].join("|");

    if (existingKeys.has(key) || newKeys.has(key)) {
      duplicateCount++;
      return;
    }

    newKeys.add(key);
    toCreate.push({ amount, description, date });
  });

  return { toCreate, errors, duplicateCount };
}