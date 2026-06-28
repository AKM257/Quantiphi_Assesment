import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "./app";

describe("Transaction API", () => {
  it("GET /health returns ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });

  it("GET /api/transactions returns parsed transactions", async () => {
    const res = await request(app).get("/api/transactions");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it("PATCH /api/transactions/:id/category updates category", async () => {
    const list = await request(app).get("/api/transactions");
    const id = list.body.data[0].id;

    const res = await request(app)
      .patch(`/api/transactions/${id}/category`)
      .send({ category: "Miscellaneous" });

    expect(res.status).toBe(200);
    expect(res.body.data.category).toBe("Miscellaneous");
    expect(res.body.data.isManualOverride).toBe(true);
  });

  it("PATCH with invalid category returns 400", async () => {
    const list = await request(app).get("/api/transactions");
    const id = list.body.data[0].id;

    const res = await request(app)
      .patch(`/api/transactions/${id}/category`)
      .send({ category: "NotARealCategory" });

    expect(res.status).toBe(400);
  });

  it("PATCH with unknown id returns 404", async () => {
    const res = await request(app)
      .patch(`/api/transactions/nonexistent-id/category`)
      .send({ category: "Travel" });

    expect(res.status).toBe(404);
  });
});
