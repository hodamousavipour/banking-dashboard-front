import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { setupServer } from "msw/node";
import { handlers } from "../../mocks/handlers";
import { transactionsApi } from "./api";

const server = setupServer(...handlers);

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

describe("transactionsApi (integration with msw + axios)", () => {
  it("can create, list, update and remove a transaction", async () => {
    const initial = await transactionsApi.list();
    const initialTotal = initial.total;

    const created = await transactionsApi.create({
      amount: 100,
      description: "Test create",
      date: "2024-01-01",
    });

    expect(created.id).toBeDefined();
    expect(created.amount).toBe(100);
    expect(created.description).toBe("Test create");

    const afterCreate = await transactionsApi.list();
    expect(afterCreate.total).toBe(initialTotal + 1);
    const createdFromList = afterCreate.items.find((t) => t.id === created.id);
    expect(createdFromList).toBeDefined();
    expect(createdFromList?.amount).toBe(100);

    const updated = await transactionsApi.update({
      id: created.id,
      amount: 250,
      description: "Updated description",
      date: "2024-01-02",
    });

    expect(updated.id).toBe(created.id);
    expect(updated.amount).toBe(250);
    expect(updated.description).toBe("Updated description");

    const afterUpdate = await transactionsApi.list();
    const updatedFromList = afterUpdate.items.find((t) => t.id === created.id);
    expect(updatedFromList).toBeDefined();
    expect(updatedFromList?.amount).toBe(250);
    expect(updatedFromList?.description).toBe("Updated description");

    const removeResult = await transactionsApi.remove(created.id);
    expect(removeResult).toEqual({ success: true });

    const afterRemove = await transactionsApi.list();
    expect(afterRemove.total).toBe(initialTotal);
    const stillThere = afterRemove.items.find((t) => t.id === created.id);
    expect(stillThere).toBeUndefined();
  });
});