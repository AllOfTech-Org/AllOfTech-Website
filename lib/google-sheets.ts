/** Shared Apps Script webhook already used by visitor tracking and the chatbot. */
export const DEFAULT_GOOGLE_SHEETS_WEBHOOK_URL =
  process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL?.trim() ||
  "https://script.google.com/macros/s/AKfycby6mx1chaD0UyESeUU-xOYK2RYaduxF5LFy2290Gey7wqIyJLMlAZfxWe32cbLbJUyf/exec";
