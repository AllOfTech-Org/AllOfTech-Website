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
import { FREE_SAMPLE_VIDEO_PATH, SAMPLE_PLATFORMS } from "@/lib/free-sample-video";
import { DEFAULT_GOOGLE_SHEETS_WEBHOOK_URL } from "@/lib/google-sheets";
import { cn } from "@/lib/utils";

const fieldClass =
  "bg-input text-foreground placeholder:text-muted-foreground focus-visible:ring-primary h-11 w-full rounded-xl border-0 text-sm shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)] focus-visible:ring-1";

type FormState = {
  fullName: string;
  email: string;
  productUrl: string;
  company: string;
  platform: string;
  phone: string;
  goal: string;
  fax: string;
};

const emptyForm: FormState = {
  fullName: "",
  email: "",
  productUrl: "",
  company: "",
  platform: "shopify",
  phone: "",
  goal: "",
  fax: "",
};

function normalizeUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function isValidUrl(value: string) {
  try {
    const url = new URL(normalizeUrl(value));
    return ["http:", "https:"].includes(url.protocol) && url.hostname.includes(".");
  } catch {
    return false;
  }
}

function readQuery(name: string) {
  try {
    return new URLSearchParams(window.location.search).get(name) ?? "";
  } catch {
    return "";
  }
}

export default function FreeSampleVideoForm() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const update = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (status !== "idle") {
      setStatus("idle");
      setMessage("");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (form.fax.trim()) {
      setStatus("success");
      return;
    }
    if (!form.fullName.trim() || !/^\S+@\S+\.\S+$/.test(form.email.trim()) || !isValidUrl(form.productUrl)) {
      setStatus("error");
      setMessage("Please add your name, a valid work email, and a public product URL.");
      return;
    }

    setStatus("sending");
    try {
      const tracking = window.UserTracking;
      await fetch(DEFAULT_GOOGLE_SHEETS_WEBHOOK_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "free_sample_video",
          submittedAt: new Date().toISOString(),
          name: form.fullName.trim().slice(0, 120),
          email: form.email.trim().toLowerCase().slice(0, 200),
          productUrl: normalizeUrl(form.productUrl).slice(0, 500),
          company: form.company.trim().slice(0, 120),
          platform: SAMPLE_PLATFORMS.find((item) => item.value === form.platform)?.label ?? form.platform,
          phone: form.phone.trim().slice(0, 40),
          goal: form.goal.trim().slice(0, 2000),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          referrer: document.referrer,
          landingUrl: window.location.href || FREE_SAMPLE_VIDEO_PATH,
          utmSource: readQuery("utm_source"),
          utmMedium: readQuery("utm_medium"),
          utmCampaign: readQuery("utm_campaign"),
          userId: tracking?.getUserId?.() ?? "",
          sessionId: tracking?.getSessionId?.() ?? "",
          userAgent: navigator.userAgent,
          acceptLanguage: navigator.language,
        }),
      });
      setForm(emptyForm);
      setStatus("success");
    } catch {
      setStatus("error");
      setMessage("Could not save your request just now. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="aot-audit__done" role="status">
        <p className="aot-audit__done-kicker">Request received</p>
        <h2>We have your product page.</h2>
        <p>
          The team will review the listing and reply about sample fit and the recommended video direction.
        </p>
      </div>
    );
  }

  return (
    <form className="aot-audit__form" aria-label="Request a free product video sample" onSubmit={handleSubmit} noValidate>
      <div className="aot-audit__form-head">
        <p className="aot-audit__form-kicker">Sample request</p>
        <h2>Send one product page</h2>
        <p>Amazon, Shopify, or your brand website.</p>
      </div>

      <div className={cn("aot-audit__feedback", status === "error" && "is-visible")} role="status" aria-live="polite" hidden={status !== "error"}>
        {message}
      </div>

      <div className="aot-audit__honeypot" aria-hidden="true">
        <label htmlFor="sample-fax">Fax</label>
        <input id="sample-fax" name="fax" tabIndex={-1} autoComplete="off" value={form.fax} onChange={(event) => update("fax", event.target.value)} />
      </div>

      <div className="aot-audit__pair">
        <div className="aot-audit__field">
          <Label htmlFor="sample-name">Full name</Label>
          <Input id="sample-name" autoComplete="name" placeholder="Your name" value={form.fullName} onChange={(event) => update("fullName", event.target.value)} required className={fieldClass} />
        </div>
        <div className="aot-audit__field">
          <Label htmlFor="sample-email">Work email</Label>
          <Input id="sample-email" type="email" autoComplete="email" placeholder="you@company.com" value={form.email} onChange={(event) => update("email", event.target.value)} required className={fieldClass} />
        </div>
      </div>

      <div className="aot-audit__field">
        <Label htmlFor="sample-product">Product URL</Label>
        <Input id="sample-product" inputMode="url" autoComplete="url" placeholder="https://yourstore.com/products/..." value={form.productUrl} onChange={(event) => update("productUrl", event.target.value)} required className={fieldClass} />
      </div>

      <div className="aot-audit__pair">
        <div className="aot-audit__field">
          <Label htmlFor="sample-company">Brand or company</Label>
          <Input id="sample-company" autoComplete="organization" placeholder="Brand name" value={form.company} onChange={(event) => update("company", event.target.value)} className={fieldClass} />
        </div>
        <div className="aot-audit__field">
          <Label htmlFor="sample-phone">Phone or WhatsApp <span className="aot-audit__optional">optional</span></Label>
          <Input id="sample-phone" type="tel" autoComplete="tel" placeholder="Include country code" value={form.phone} onChange={(event) => update("phone", event.target.value)} className={fieldClass} />
        </div>
      </div>

      <div className="aot-audit__field">
        <Label htmlFor="sample-platform">Where will the video be used?</Label>
        <Select value={form.platform} onValueChange={(value) => update("platform", value)}>
          <SelectTrigger id="sample-platform" className={cn(fieldClass, "data-[size=default]:h-11 w-full justify-between")}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="start" position="popper" className="aot-audit__select rounded-xl">
            {SAMPLE_PLATFORMS.map((option) => (
              <SelectItem key={option.value} value={option.value} className="text-sm">{option.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="aot-audit__field">
        <Label htmlFor="sample-goal">What should buyers notice?</Label>
        <Textarea id="sample-goal" placeholder="A material detail, assembly step, feature, or use case." rows={4} value={form.goal} onChange={(event) => update("goal", event.target.value)} className={cn(fieldClass, "h-auto min-h-28 resize-none py-3")} />
      </div>

      <Button type="submit" disabled={status === "sending"} className="aot-audit__submit bg-primary text-primary-foreground hover:bg-primary/90 group mt-1 h-auto w-full rounded-xl py-5 text-sm font-semibold">
        {status === "sending" ? "Sending…" : "Request the free sample"}
        <FaArrowRight className="ml-2 text-xs transition-transform group-hover:translate-x-1" />
      </Button>
      <p className="aot-audit__legal">Used only to review this product and reply about the sample. No newsletter.</p>
    </form>
  );
}

declare global {
  interface Window {
    UserTracking?: {
      getUserId?: () => string;
      getSessionId?: () => string;
      trackFormSubmission?: (
        formId: string,
        formData: { name: string; email: string },
      ) => void;
    };
  }
}
