import { describe, it, expect } from "vitest";
import { parseMessage } from "./parseMessage";

describe("parseMessage", () => {
  it("parses a basic debit message", () => {
    const result = parseMessage("Paid Rs.250 to Zomato");
    expect(result).toEqual({
      amount: 250,
      direction: "debit",
      merchant: "Zomato",
      rawMessage: "Paid Rs.250 to Zomato",
    });
  });

  it("parses a credit message with multi-word merchant", () => {
    const result = parseMessage("Received Rs.1200 from ABC Pvt Ltd");
    expect(result?.direction).toBe("credit");
    expect(result?.merchant).toBe("ABC Pvt Ltd");
  });

  it("parses 'using UPI to X' preposition pattern", () => {
    const result = parseMessage("Paid Rs.430 using UPI to Uber");
    expect(result?.merchant).toBe("Uber");
    expect(result?.amount).toBe(430);
  });

  it("returns null for total parse failure (no amount)", () => {
    expect(parseMessage("Your account was debited")).toBeNull();
  });

  it("handles zero amount without crashing", () => {
    const result = parseMessage("Paid Rs.0 to Zomato");
    expect(result?.amount).toBe(0);
  });

  it("is case-insensitive for amount currency notation", () => {
    const result = parseMessage("paid rs.500 to swiggy");
    expect(result?.amount).toBe(500);
  });

  it("strips trailing 'Salary' suffix from merchant capture", () => {
    const result = parseMessage("Received Rs.45000 from Infosys Ltd Salary");
    expect(result?.merchant).toBe("Infosys Ltd");
  });
});
