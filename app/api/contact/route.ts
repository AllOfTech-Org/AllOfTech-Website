import { MAIL_RUNTIME, mailJson } from "@/lib/mail/http";
import { checkRateLimit, getClientIp, recordSubmission, submissionFingerprint } from "@/lib/mail/rate-limit";
import { sendContactMails } from "@/lib/mail/send";
import { validateContactPayload } from "@/lib/mail/validate";

export const runtime = MAIL_RUNTIME;

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return mailJson(400, "Please fill out your name, email, and message.");
  }

  const parsed = validateContactPayload(payload);
  if (!parsed.ok) {
    return mailJson(400, parsed.error);
  }

  const ip = getClientIp(request.headers);
  const fingerprint = submissionFingerprint(["contact", parsed.data.email, parsed.data.message]);
  const limited = checkRateLimit(ip, fingerprint);
  if (!limited.ok) {
    return mailJson(429, limited.error);
  }

  try {
    await sendContactMails(parsed.data);
    recordSubmission(ip, fingerprint);
    return mailJson(200);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to send right now.";
    return mailJson(500, message);
  }
}
