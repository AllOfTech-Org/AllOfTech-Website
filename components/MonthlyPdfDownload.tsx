"use client";

import { useState, type FormEvent } from "react";
import { DEFAULT_GOOGLE_SHEETS_WEBHOOK_URL } from "@/lib/google-sheets";
import {
  MONTHLY_PDF,
  MONTHLY_PDF_ACTION,
  monthlyPdfDownloadHref,
  parseMonthlyPdfLead,
} from "@/lib/monthly-pdf";
import styles from "./monthly-pdf.module.css";

type GateStatus = "closed" | "form" | "sending" | "done";

type UserTrackingApi = {
  getUserId?: () => string;
  getSessionId?: () => string;
  trackFormSubmission?: (
    formId: string,
    formData: { name: string; email: string },
  ) => void;
};

function userTracking() {
  return (window as unknown as { UserTracking?: UserTrackingApi }).UserTracking;
}

function trackingIds() {
  const tracking = userTracking();
  return {
    userId: tracking?.getUserId?.() ?? "",
    sessionId: tracking?.getSessionId?.() ?? "",
  };
}

function readQuery(name: string) {
  try {
    return new URLSearchParams(window.location.search).get(name) ?? "";
  } catch {
    return "";
  }
}

function startPdfDownload() {
  const href = monthlyPdfDownloadHref();
  const link = document.createElement("a");
  link.href = href;
  link.download = MONTHLY_PDF.downloadName;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  window.setTimeout(() => link.remove(), 800);
}

async function sendLead(name: string, email: string) {
  const payload = {
    action: MONTHLY_PDF_ACTION,
    submittedAt: new Date().toISOString(),
    name,
    email,
    pdfTitle: MONTHLY_PDF.heading,
    pdfFile: MONTHLY_PDF.downloadName,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    referrer: document.referrer,
    landingUrl: window.location.href,
    utmSource: readQuery("utm_source"),
    utmMedium: readQuery("utm_medium"),
    utmCampaign: readQuery("utm_campaign"),
    ...trackingIds(),
    userAgent: navigator.userAgent,
    acceptLanguage: navigator.language,
  };

  userTracking()?.trackFormSubmission?.("monthly-pdf-form", { name, email });

  await fetch(DEFAULT_GOOGLE_SHEETS_WEBHOOK_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

function DownloadIcon() {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 2v8m0 0 3-3m-3 3L5 7M3 12.5h10"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function MonthlyPdfDownload() {
  const [status, setStatus] = useState<GateStatus>("closed");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");

  const clearFieldErrors = () => {
    setNameError("");
    setEmailError("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = parseMonthlyPdfLead({ name, email });

    if ("error" in parsed) {
      setNameError(parsed.field === "name" ? parsed.error : "");
      setEmailError(parsed.field === "email" ? parsed.error : "");
      return;
    }

    clearFieldErrors();
    setStatus("sending");

    try {
      await sendLead(parsed.name, parsed.email);
    } catch {
      // Still give the file. Lead capture should not block the download.
    }

    startPdfDownload();
    setStatus("done");
  };

  if (status === "done") {
    return (
      <div className={styles.card} role="status">
        <div className={styles.done}>
          <p className={styles.kicker}>Downloaded</p>
          <h2>{MONTHLY_PDF.formDoneTitle}</h2>
          <p>{MONTHLY_PDF.formDoneBody}</p>
          <a
            className={styles.fallback}
            href={monthlyPdfDownloadHref()}
            download={MONTHLY_PDF.downloadName}
          >
            <DownloadIcon />
            {MONTHLY_PDF.downloadLabel}
          </a>
        </div>
      </div>
    );
  }

  if (status === "closed") {
    return (
      <div className={styles.card}>
        <div>
          <p className={styles.kicker}>PDF</p>
          <p className={styles.cardTitle}>{MONTHLY_PDF.heading}</p>
          <p className={styles.meta}>{MONTHLY_PDF.fileNote}</p>
        </div>
        <button
          type="button"
          className={styles.open}
          onClick={() => setStatus("form")}
        >
          <DownloadIcon />
          {MONTHLY_PDF.downloadLabel}
        </button>
      </div>
    );
  }

  return (
    <form
      className={`${styles.card} ${styles.form}`}
      onSubmit={handleSubmit}
      noValidate
      aria-label={MONTHLY_PDF.formTitle}
    >
      <div>
        <p className={styles.kicker}>{MONTHLY_PDF.formKicker}</p>
        <h2 className={styles.cardTitle}>{MONTHLY_PDF.formTitle}</h2>
        <p className={styles.cardBody}>{MONTHLY_PDF.formBody}</p>
      </div>

      <div className={styles.field}>
        <label htmlFor="monthly-pdf-name">Name</label>
        <input
          id="monthly-pdf-name"
          name="name"
          autoComplete="name"
          placeholder="Your name"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            if (nameError) setNameError("");
          }}
          required
          aria-required="true"
          aria-invalid={nameError ? true : undefined}
          aria-describedby={nameError ? "monthly-pdf-name-error" : undefined}
        />
        {nameError ? (
          <p id="monthly-pdf-name-error" className={styles.error} role="alert">
            {nameError}
          </p>
        ) : null}
      </div>

      <div className={styles.field}>
        <label htmlFor="monthly-pdf-email">Email</label>
        <input
          id="monthly-pdf-email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="you@company.com"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (emailError) setEmailError("");
          }}
          required
          aria-required="true"
          aria-invalid={emailError ? true : undefined}
          aria-describedby={emailError ? "monthly-pdf-email-error" : undefined}
        />
        {emailError ? (
          <p id="monthly-pdf-email-error" className={styles.error} role="alert">
            {emailError}
          </p>
        ) : null}
      </div>

      <button type="submit" className={styles.submit} disabled={status === "sending"}>
        <DownloadIcon />
        {status === "sending" ? "Sending…" : MONTHLY_PDF.formSubmitLabel}
      </button>
      <p className={styles.legal}>{MONTHLY_PDF.formLegal}</p>
    </form>
  );
}
