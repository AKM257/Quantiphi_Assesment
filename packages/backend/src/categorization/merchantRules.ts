import type { Category } from "shared-types";

export const MERCHANT_CATEGORY_MAP: Record<string, Category> = {
  zomato: "Food & Dining",
  swiggy: "Food & Dining",
  dominos: "Food & Dining",
  starbucks: "Food & Dining",
  uber: "Travel",
  ola: "Travel",
  rapido: "Travel",
  myntra: "Shopping",
  amazon: "Shopping",
};

export const KNOWN_EMPLOYERS = ["infosys", "tcs", "wipro", "accenture", "abc pvt ltd"];

export const SALARY_KEYWORD = /\bsalary\b/i;
