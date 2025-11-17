import { http, HttpResponse } from "msw";

let transactions: Array<{
  id: number;
  amount: number;
  description: string;
  date: string;
}> = JSON.parse(localStorage.getItem("transactions") || "[]");

// derive lastId from stored data
let lastId = transactions.reduce(
  (max, t) => (t.id > max ? t.id : max),
  0
);

function getNextId() {
  lastId += 1;
  return lastId;
}

function persist() {
  try {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  } catch {
    /* ignore */
  }
}

function getSummary() {
  const income = transactions
    .filter((t) => t.amount > 0)
    .reduce((a, b) => a + b.amount, 0);
  const expense = transactions
    .filter((t) => t.amount < 0)
    .reduce((a, b) => a + b.amount, 0);
  const balance = income + expense;
  return { income, expense, balance };
}

export const handlers = [
  http.get("/transactions", () => {
    return HttpResponse.json({
      items: transactions,
      total: transactions.length,
    });
  }),

  http.post("/transactions", async ({ request }) => {
    const body = (await request.json()) as {
      amount: number;
      description: string;
      date?: string;
    };

    if (!body.description || body.amount === 0) {
      return HttpResponse.json(
        { error: "Invalid transaction" },
        { status: 400 }
      );
    }

    const newTx = {
      id: getNextId(),
      date: body.date ?? new Date().toISOString(),
      ...body,
    };

    transactions.unshift(newTx);
    persist();

    return HttpResponse.json(newTx, { status: 201 });
  }),

  http.put("/transactions/:id", async ({ params, request }) => {
    const id = Number(params.id);
    const body = (await request.json()) as {
      amount?: number;
      description?: string;
      date?: string;
    };

    const index = transactions.findIndex((t) => t.id === id);
    if (index === -1) {
      return HttpResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    transactions[index] = { ...transactions[index], ...body };
    persist();
    return HttpResponse.json(transactions[index]);
  }),

  http.delete("/transactions/:id", ({ params }) => {
    const id = Number(params.id);
    const exists = transactions.find((t) => t.id === id);
    if (!exists) {
      return HttpResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    transactions = transactions.filter((t) => t.id !== id);
    persist();

    return HttpResponse.json({ success: true });
  }),

  http.get("/summary", () => {
    const summary = getSummary();
    return HttpResponse.json(summary);
  }),
];