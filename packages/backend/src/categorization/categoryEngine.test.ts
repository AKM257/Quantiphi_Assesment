import { describe, it, expect } from "vitest";
import { categorize } from "./categoryEngine";

describe("categorize", () => {
  it("maps Zomato to Food & Dining", () => {
    expect(
      categorize({ amount: 250, direction: "debit", merchant: "Zomato", rawMessage: "" })
    ).toBe("Food & Dining");
  });

  it("maps Uber to Travel", () => {
    expect(
      categorize({ amount: 430, direction: "debit", merchant: "Uber", rawMessage: "" })
    ).toBe("Travel");
  });

  it("does NOT match 'Uberoi Sweets' as Travel (word boundary)", () => {
    expect(
      categorize({
        amount: 899,
        direction: "debit",
        merchant: "Uberoi Sweets",
        rawMessage: "",
      })
    ).toBe("Miscellaneous");
  });

  it("classifies known employer credit as Salary even without the word 'salary'", () => {
    expect(
      categorize({
        amount: 45000,
        direction: "credit",
        merchant: "Infosys Ltd",
        rawMessage: "Received Rs.45000 from Infosys Ltd",
      })
    ).toBe("Salary");
  });

  it("classifies credit with 'salary' keyword as Salary", () => {
    expect(
      categorize({
        amount: 1200,
        direction: "credit",
        merchant: "ABC Pvt Ltd",
        rawMessage: "Received Rs.1200 from ABC Pvt Ltd Salary",
      })
    ).toBe("Salary");
  });

  it("falls back to Miscellaneous when merchant is null (partial parse)", () => {
    expect(
      categorize({ amount: 18, direction: "credit", merchant: null, rawMessage: "" })
    ).toBe("Miscellaneous");
  });

  it("falls back to Miscellaneous for unrecognized merchant", () => {
    expect(
      categorize({ amount: 2000, direction: "credit", merchant: "John Doe", rawMessage: "" })
    ).toBe("Miscellaneous");
  });
});
