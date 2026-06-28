import { describe, it, expect } from "vitest";
import { detectCashback } from "./cashbackEngine";

describe("detectCashback", () => {
  it("returns reward-partner cashback for Amazon at 3%", () => {
    const result = detectCashback({
      amount: 600,
      direction: "debit",
      merchant: "Amazon",
      rawMessage: "Paid Rs.600 to Amazon",
    });
    expect(result).toEqual({ expectedSavings: 18, ratePercent: 3, reason: "reward-partner" });
  });

  it("returns null for credit transactions (only debits get savings rows)", () => {
    const result = detectCashback({
      amount: 600,
      direction: "credit",
      merchant: "Amazon",
      rawMessage: "Received Rs.600 cashback from Amazon",
    });
    expect(result).toBeNull();
  });

  it("falls back to default 3% keyword rate for non-partner merchant with 'cashback'", () => {
    const result = detectCashback({
      amount: 200,
      direction: "debit",
      merchant: "RandomShop",
      rawMessage: "Paid Rs.200 to RandomShop, cashback applicable",
    });
    expect(result).toEqual({ expectedSavings: 6, ratePercent: 3, reason: "keyword" });
  });

  it("returns null when no cashback signal present", () => {
    const result = detectCashback({
      amount: 430,
      direction: "debit",
      merchant: "Uber",
      rawMessage: "Paid Rs.430 using UPI to Uber",
    });
    expect(result).toBeNull();
  });
});
