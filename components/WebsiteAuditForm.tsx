"use client";

import { useState, type FormEvent } from "react";
import { FaArrowRight } from "react-icons/fa";
import { Button } from "@/components/base-ui/button";
import { Input } from "@/components/base-ui/input";
import { Label } from "@/components/base-ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/base-ui/select";
import { Textarea } from "@/components/base-ui/textarea";
import { DEFAULT_GOOGLE_SHEETS_WEBHOOK_URL } from "@/lib/google-sheets";
import { cn } from "@/lib/utils";
import { AUDIT_FOCUS_OPTIONS, parseWebsiteAudit } from "@/lib/website-audit";

const fieldClass =
  "bg-input text-foreground placeholder:text-muted-foreground focus-visible:ring-primary h-11 w-full rounded-xl border-0 text-sm shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)] focus-visible:ring-1";

type FormState = {
  fullName: string;
  email: string;
  websiteUrl: string;
  company: string;
  focus: string;
  phone: string;
  notes: string;
  fax: string;
};

const emptyForm: FormState = {
  fullName: "",
  email: "",
  websiteUrl: "",
  company: "",
  focus: "whole-site",
  phone: "",
  notes: "",
  fax: "",
};

function readQuery(name: string) {
  try {
    return new URLSearchParams(window.location.search).get(name) ?? "";
  } catch {
    return "";
  }
}

function trackingIds() {
  const tracking = window.UserTracking;
  return {
    userId: tracking?.getUserId?.() ?? "",
    sessionId: tracking?.getSessionId?.() ?? "",
  };
}

function contextFields() {
  return {
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    referrer: document.referrer,
    landingUrl: window.location.href,
    utmSource: readQuery("utm_source"),
    utmMedium: readQuery("utm_medium"),
    utmCampaign: readQuery("utm_campaign"),
    ...trackingIds(),
  };
}

async function sendToGoogleSheets(payload: Record<string, unknown>) {
  await fetch(DEFAULT_GOOGLE_SHEETS_WEBHOOK_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export default function WebsiteAuditForm() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (status !== "idle") {
      setStatus("idle");
      setStatusMessage("");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = parseWebsiteAudit({
      ...form,
      honeypot: form.fax,
      ...contextFields(),
    });

    if ("error" in parsed) {
      if (parsed.error === "spam") {
        setStatus("success");
        return;
      }
      setStatus("error");
      setStatusMessage(parsed.error);
      return;
    }

    setStatus("sending");

    try {
      await sendToGoogleSheets({
        action: "website_audit",
        submittedAt: new Date().toISOString(),
        name: parsed.fullName,
        email: parsed.email,
        company: parsed.company,
        websiteUrl: parsed.websiteUrl,
        focus: parsed.focusLabel,
        phone: parsed.phone,
        notes: parsed.notes,
        timezone: parsed.timezone,
        referrer: parsed.referrer,
        landingUrl: parsed.landingUrl,
        utmSource: parsed.utmSource,
        utmMedium: parsed.utmMedium,
        utmCampaign: parsed.utmCampaign,
        userId: parsed.userId,
        sessionId: parsed.sessionId,
        userAgent: navigator.userAgent,
        acceptLanguage: navigator.language,
      });
      setForm(emptyForm);
      setStatus("success");
    } catch {
      setStatus("error");
      setStatusMessage("Could not save just now. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="aot-audit__done" role="status">
        <p className="aot-audit__done-kicker">Thank you</p>
        <h2>We have it. The review starts now.</h2>
        <p>
          We will read the live site and send written notes — usually within 48 hours.
          No list. No drip.
        </p>
      </div>
    );
  }

  return (
    <form
      id="website-audit-form"
      className="aot-audit__form"
      action="#"
      method="post"
      aria-label="Free website audit"
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="aot-audit__form-head">
        <p className="aot-audit__form-kicker">Request</p>
        <h2>Send the URL</h2>
        <p>About a minute. We write back within 48 hours.</p>
      </div>

      <div
        className={cn("aot-audit__feedback", status === "error" && "is-visible")}
        role="status"
        aria-live="polite"
        hidden={status !== "error"}
      >
        {statusMessage}
      </div>

      <div className="aot-audit__honeypot" aria-hidden="true">
        <label htmlFor="audit-fax">Fax</label>
        <input
          id="audit-fax"
          name="fax"
          tabIndex={-1}
          autoComplete="off"
          value={form.fax}
          onChange={(event) => handleChange("fax", event.target.value)}
        />
      </div>

      <div className="aot-audit__pair">
        <div className="aot-audit__field">
          <Label htmlFor="audit-name">Full name</Label>
          <Input
            id="audit-name"
            name="name"
            autoComplete="name"
            placeholder="Your name"
            value={form.fullName}
            onChange={(event) => handleChange("fullName", event.target.value)}
            required
            aria-required="true"
            className={fieldClass}
          />
        </div>
        <div className="aot-audit__field">
          <Label htmlFor="audit-email">Work email</Label>
          <Input
            id="audit-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={form.email}
            onChange={(event) => handleChange("email", event.target.value)}
            required
            aria-required="true"
            className={fieldClass}
          />
        </div>
      </div>

      <div className="aot-audit__field">
        <Label htmlFor="audit-website">Website URL</Label>
        <Input
          id="audit-website"
          name="website"
          type="text"
          inputMode="url"
          autoComplete="url"
          placeholder="yoursite.com"
          value={form.websiteUrl}
          onChange={(event) => handleChange("websiteUrl", event.target.value)}
          required
          aria-required="true"
          className={fieldClass}
        />
      </div>

      <div className="aot-audit__pair">
        <div className="aot-audit__field">
          <Label htmlFor="audit-company">
            Company <span className="aot-audit__optional">optional</span>
          </Label>
          <Input
            id="audit-company"
            name="company"
            autoComplete="organization"
            placeholder="Brand or company"
            value={form.company}
            onChange={(event) => handleChange("company", event.target.value)}
            className={fieldClass}
          />
        </div>
        <div className="aot-audit__field">
          <Label htmlFor="audit-phone">
            Phone or WhatsApp <span className="aot-audit__optional">optional</span>
          </Label>
          <Input
            id="audit-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="Include country code"
            value={form.phone}
            onChange={(event) => handleChange("phone", event.target.value)}
            className={fieldClass}
          />
        </div>
      </div>

      <div className="aot-audit__field">
        <Label htmlFor="audit-focus">Where should we look first?</Label>
        <Select
          value={form.focus || "whole-site"}
          onValueChange={(value) => handleChange("focus", value)}
        >
          <SelectTrigger
            id="audit-focus"
            className={cn(fieldClass, "data-[size=default]:h-11 w-full justify-between")}
          >
            <SelectValue placeholder="The whole site" />
          </SelectTrigger>
          <SelectContent
            align="start"
            position="popper"
            className="aot-audit__select rounded-xl"
          >
            {AUDIT_FOCUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value} className="text-sm">
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="aot-audit__field">
        <Label htmlFor="audit-notes">
          Anything we should know? <span className="aot-audit__optional">optional</span>
        </Label>
        <Textarea
          id="audit-notes"
          name="notes"
          placeholder="A launch date, a page that worries you, a market you sell to."
          rows={4}
          value={form.notes}
          onChange={(event) => handleChange("notes", event.target.value)}
          className={cn(fieldClass, "h-auto min-h-28 resize-none py-3")}
        />
      </div>

      <Button
        type="submit"
        disabled={status === "sending"}
        className="aot-audit__submit bg-primary text-primary-foreground hover:bg-primary/90 group mt-1 h-auto w-full rounded-xl py-5 text-sm font-semibold"
      >
        {status === "sending" ? "Saving…" : "Request the audit"}
        <FaArrowRight className="ml-2 text-xs transition-transform group-hover:translate-x-1" />
      </Button>

      <p className="aot-audit__legal">
        Used only to review this URL and send the notes. No newsletter.
      </p>
    </form>
  );
}

declare global {
  interface Window {
    UserTracking?: {
      getUserId?: () => string;
      getSessionId?: () => string;
    };
  }
}
