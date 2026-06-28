import type { CashbackInfo } from "shared-types";
import { ParsedMessage } from "../parser/parseMessage";
import { REWARD_PARTNERS, DEFAULT_CASHBACK_RATE, CASHBACK_KEYWORD } from "./rewardPartners";

export function detectCashback(parsed: ParsedMessage): CashbackInfo | null {
  // Only debit (outgoing) transactions get a synthetic "expected savings" row.
  if (parsed.direction !== "debit") return null;

  const merchantLower = parsed.merchant?.toLowerCase() ?? "";
  const partnerEntry = Object.entries(REWARD_PARTNERS).find(([key]) =>
    merchantLower.includes(key)
  );

  if (partnerEntry) {
    const [, ratePercent] = partnerEntry;
    return {
      expectedSavings: round2((parsed.amount * ratePercent) / 100),
      ratePercent,
      reason: "reward-partner",
    };
  }

  if (CASHBACK_KEYWORD.test(parsed.rawMessage)) {
    return {
      expectedSavings: round2((parsed.amount * DEFAULT_CASHBACK_RATE) / 100),
      ratePercent: DEFAULT_CASHBACK_RATE,
      reason: "keyword",
    };
  }

  return null;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
