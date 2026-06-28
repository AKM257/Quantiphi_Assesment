export interface ParsedMessage {
  amount: number;
  direction: "credit" | "debit";
  merchant: string | null;
  rawMessage: string;
}

// Matches Rs.250 / Rs 250 / ₹250 / INR 250 / 250.50
const AMOUNT_REGEX = /(?:rs\.?|inr|₹)\s*([\d,]+(?:\.\d{1,2})?)/i;

const DEBIT_KEYWORDS = /\b(paid|debited|spent|sent)\b/i;
const CREDIT_KEYWORDS = /\b(received|credited)\b/i;

// Captures merchant after "to X" / "at X" / "from X" / "using UPI to X"
const MERCHANT_REGEX = /\b(?:to|at|from)\s+([A-Za-z][A-Za-z .&]*?)(?:\s+(?:salary|on|via|using).*)?$/i;

export function parseMessage(rawMessage: string): ParsedMessage | null {
  const amountMatch = rawMessage.match(AMOUNT_REGEX);
  if (!amountMatch) {
    // Total parse failure: no amount at all -> nothing to record.
    return null;
  }

  const amount = parseFloat(amountMatch[1].replace(/,/g, ""));

  let direction: "credit" | "debit";
  if (DEBIT_KEYWORDS.test(rawMessage)) {
    direction = "debit";
  } else if (CREDIT_KEYWORDS.test(rawMessage)) {
    direction = "credit";
  } else {
    // Ambiguous direction with a valid amount: still total failure,
    // since direction is as essential as amount for a usable record.
    return null;
  }

  const merchantMatch = rawMessage.match(MERCHANT_REGEX);
  const merchant = merchantMatch ? merchantMatch[1].trim() : null;

  return { amount, direction, merchant, rawMessage };
}
