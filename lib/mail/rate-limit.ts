type Bucket = {
  timestamps: number[];
};

const WINDOW_MS = 15 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const DUPLICATE_WINDOW_MS = 2 * 60 * 1000;

const ipBuckets = new Map<string, Bucket>();
const recentFingerprints = new Map<string, number>();

function prune(now: number) {
  for (const [ip, bucket] of ipBuckets) {
    bucket.timestamps = bucket.timestamps.filter((time) => now - time < WINDOW_MS);
    if (bucket.timestamps.length === 0) {
      ipBuckets.delete(ip);
    }
  }

  for (const [fingerprint, time] of recentFingerprints) {
    if (now - time >= DUPLICATE_WINDOW_MS) {
      recentFingerprints.delete(fingerprint);
    }
  }
}

export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }

  return headers.get("x-real-ip")?.trim() || "unknown";
}

export function checkRateLimit(ip: string, fingerprint: string): { ok: true } | { ok: false; error: string } {
  const now = Date.now();
  prune(now);

  const lastSeen = recentFingerprints.get(fingerprint);
  if (lastSeen && now - lastSeen < DUPLICATE_WINDOW_MS) {
    return {
      ok: false,
      error: "This was just submitted. Please wait a moment before sending again.",
    };
  }

  const bucket = ipBuckets.get(ip) ?? { timestamps: [] };
  bucket.timestamps = bucket.timestamps.filter((time) => now - time < WINDOW_MS);

  if (bucket.timestamps.length >= MAX_PER_WINDOW) {
    return {
      ok: false,
      error: "Too many submissions. Please try again in a few minutes.",
    };
  }

  return { ok: true };
}

export function recordSubmission(ip: string, fingerprint: string) {
  const now = Date.now();
  const bucket = ipBuckets.get(ip) ?? { timestamps: [] };
  bucket.timestamps = bucket.timestamps.filter((time) => now - time < WINDOW_MS);
  bucket.timestamps.push(now);
  ipBuckets.set(ip, bucket);
  recentFingerprints.set(fingerprint, now);
}

export function submissionFingerprint(parts: string[]): string {
  return parts.map((part) => part.trim().toLowerCase()).join("|");
}
