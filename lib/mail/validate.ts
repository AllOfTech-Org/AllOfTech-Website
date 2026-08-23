import { SERVICES } from "@/lib/services";

export const CONTACT_SERVICE_SLUGS = [
  ...SERVICES.map((service) => service.slug),
  "other",
] as const;

export type ContactServiceSlug = (typeof CONTACT_SERVICE_SLUGS)[number];

export type ContactSubmission = {
  name: string;
  email: string;
  message: string;
  service: ContactServiceSlug | "";
};

export type ReviewSubmission = {
  name: string;
  occupation: string;
  rating: number;
  message: string;
};

export type ValidationResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LIMITS = {
  name: 120,
  email: 254,
  message: 8000,
  occupation: 160,
} as const;

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function readString(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > max) return null;
  return trimmed;
}

function isServiceSlug(value: string): value is ContactServiceSlug {
  return (CONTACT_SERVICE_SLUGS as readonly string[]).includes(value);
}

export function validateContactPayload(value: unknown): ValidationResult<ContactSubmission> {
  const body = asRecord(value);
  if (!body) {
    return { ok: false, error: "Please fill out your name, email, and message." };
  }

  const name = readString(body.name, LIMITS.name);
  const email = readString(body.email, LIMITS.email)?.toLowerCase() ?? null;
  const message = readString(body.message, LIMITS.message);
  const rawService = typeof body.service === "string" ? body.service.trim() : "";

  if (!name || !email || !message) {
    return { ok: false, error: "Please fill out your name, email, and message." };
  }

  if (!EMAIL_PATTERN.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  if (rawService && !isServiceSlug(rawService)) {
    return { ok: false, error: "Please choose a valid area of interest." };
  }

  return {
    ok: true,
    data: {
      name,
      email,
      message,
      service: rawService && isServiceSlug(rawService) ? rawService : "",
    },
  };
}

export function validateReviewPayload(value: unknown): ValidationResult<ReviewSubmission> {
  const body = asRecord(value);
  if (!body) {
    return { ok: false, error: "Please fill out your name, star rating, and main review." };
  }

  const name = readString(body.name, LIMITS.name);
  const message = readString(body.message, LIMITS.message);
  const occupationRaw =
    typeof body.occupation === "string" ? body.occupation.trim() : "";
  const occupation =
    occupationRaw.length > LIMITS.occupation ? null : occupationRaw;
  const rating = Number(body.rating);

  if (!name || !message || occupation === null) {
    return { ok: false, error: "Please fill out your name, star rating, and main review." };
  }

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { ok: false, error: "Please fill out your name, star rating, and main review." };
  }

  return {
    ok: true,
    data: {
      name,
      occupation,
      rating,
      message,
    },
  };
}
