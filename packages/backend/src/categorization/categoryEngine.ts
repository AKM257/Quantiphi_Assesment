import type { Category } from "shared-types";
import { ParsedMessage } from "../parser/parseMessage";
import { MERCHANT_CATEGORY_MAP, KNOWN_EMPLOYERS, SALARY_KEYWORD } from "./merchantRules";

function matchesWordBoundary(haystack: string, needle: string): boolean {
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\b${escaped}\\b`, "i").test(haystack);
}

export function categorize(parsed: ParsedMessage): Category {
  const { direction, merchant, rawMessage } = parsed;

  if (direction === "credit") {
    const merchantLower = merchant?.toLowerCase() ?? "";
    const isKnownEmployer = KNOWN_EMPLOYERS.some((employer) =>
      merchantLower.includes(employer)
    );
    if (isKnownEmployer || SALARY_KEYWORD.test(rawMessage)) {
      return "Salary";
    }
  }

  if (!merchant) {
    // Partial parse: amount found, merchant missing -> Miscellaneous.
    return "Miscellaneous";
  }

  for (const [key, category] of Object.entries(MERCHANT_CATEGORY_MAP)) {
    // Word-boundary match prevents "Uberoi Sweets" from matching "uber".
    if (matchesWordBoundary(merchant, key)) {
      return category;
    }
  }

  return "Miscellaneous";
}
