"use client";

import { useLayoutEffect, useState, type FormEvent } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Input } from "@/components/base-ui/input";
import { Textarea } from "@/components/base-ui/textarea";
import { Button } from "@/components/base-ui/button";
import { Label } from "@/components/base-ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/base-ui/select";
import { Card, CardContent } from "@/components/base-ui/card";
import { Separator } from "@/components/base-ui/separator";
import { Badge } from "@/components/base-ui/badge";
import { FaEnvelope, FaPhoneAlt, FaArrowRight } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { sendContactForm } from "@/lib/emailjs-client";
import { SERVICES } from "@/lib/services";
import { BOOK_A_CALL_URL, CONTACT_EMAIL } from "@/lib/site";

interface ContactInfo {
  email: string;
  phone: string;
  emailHref?: string;
  phoneHref?: string;
  emailLabel?: string;
  phoneLabel?: string;
}

interface ServiceOption {
  value: string;
  label: string;
}

interface ContactFormValues {
  fullName: string;
  email: string;
  service: string;
  message: string;
}

interface ContactFormProps {
  id?: string;
  headingId?: string;
  className?: string;
  badge?: string;
  headline?: string;
  headlineAccent?: string;
  subheadline?: string;
  contactInfo?: ContactInfo;
  serviceOptions?: ServiceOption[];
  ctaLabel?: string;
  onSubmit?: (data: ContactFormValues) => void;
}

const defaultServiceOptions: ServiceOption[] = [
  ...SERVICES.map((service) => ({
    value: service.slug,
    label: service.shortName,
  })),
  { value: "other", label: "Something else" },
];

const defaultContactInfo: ContactInfo = {
  email: CONTACT_EMAIL,
  phone: "Book a call",
  emailHref: `mailto:${CONTACT_EMAIL}`,
  phoneHref: BOOK_A_CALL_URL,
  emailLabel: "Email",
  phoneLabel: "Call",
};

const defaultProps = {
  id: "contact",
  headingId: "contact-heading",
  badge: "Contact",
  headline: "Ready to Transform",
  headlineAccent: "Your Business",
  subheadline:
    "Get in touch for a free consultation and we will map the first useful step — not a science project. We reply within 24 hours.",
  contactInfo: defaultContactInfo,
  serviceOptions: defaultServiceOptions,
  ctaLabel: "Send Message",
};

const ease = [0.16, 1, 0.3, 1] as const;

const fieldClass =
  "bg-input text-foreground placeholder:text-muted-foreground focus-visible:ring-primary h-11 w-full rounded-xl border-0 text-sm shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)] focus-visible:ring-1";

function matchInterest(selected: string, options: ServiceOption[]) {
  const query = selected.toLowerCase();
  let best: ServiceOption | undefined;
  let bestScore = 0;

  for (const option of options) {
    if (option.value === "other") continue;
    const label = option.label.toLowerCase();
    const value = option.value.toLowerCase().replace(/-/g, " ");
    let score = 0;
    if (query.includes(value) || value.includes(query)) score += 4;
    if (query.includes(label) || label.includes(query)) score += 4;
    for (const token of value.split(/[\s/&]+/)) {
      if (token.length > 2 && query.includes(token)) score += 1;
    }
    if (score > bestScore) {
      best = option;
      bestScore = score;
    }
  }

  return bestScore > 0 ? best?.value ?? "" : "";
}


export default function ContactSolutionForm(props: ContactFormProps = {}) {
  const merged = { ...defaultProps, ...props };
  const {
    id,
    headingId,
    className,
    badge,
    headline,
    headlineAccent,
    subheadline,
    ctaLabel,
    onSubmit,
  } = merged;
  const contactInfo = { ...defaultContactInfo, ...props.contactInfo };
  const serviceOptions = props.serviceOptions ?? defaultServiceOptions;

  const reduce = useReducedMotion();
  const [form, setForm] = useState<ContactFormValues>({
    fullName: "",
    email: "",
    service: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  useLayoutEffect(() => {
    const selected = sessionStorage.getItem("selectedService");
    if (!selected) return;

    setForm((prev) => ({
      ...prev,
      service: prev.service || matchInterest(selected, serviceOptions),
      message: prev.message.trim()
        ? prev.message
        : `I'm interested in learning more about: ${selected}\n\n`,
    }));
  }, [serviceOptions]);

  const handleChange = (field: keyof ContactFormValues, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (status !== "idle") {
      setStatus("idle");
      setStatusMessage("");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const fullName = form.fullName.trim();
    const email = form.email.trim();
    const message = form.message.trim();

    if (!fullName || !email || !message) {
      setStatus("error");
      setStatusMessage("Please fill out your name, email, and message.");
      return;
    }

    setStatus("sending");
    setStatusMessage("Sending…");

    const formEl = event.currentTarget;
    const messageField = formEl.elements.namedItem("message");
    const interest = serviceOptions.find((option) => option.value === form.service)?.label;
    if (messageField instanceof HTMLTextAreaElement) {
      messageField.value = interest ? `Area of interest: ${interest}\n\n${message}` : message;
    }

    try {
      await sendContactForm(formEl);
      onSubmit?.({ ...form, fullName, email, message });
      sessionStorage.removeItem("selectedService");
      setForm({ fullName: "", email: "", service: "", message: "" });
      setStatus("success");
      setStatusMessage("Message sent — we'll reply within 24 hours.");
    } catch (error) {
      if (messageField instanceof HTMLTextAreaElement) {
        messageField.value = message;
      }
      console.error("Contact send failed");
      setStatus("error");
      setStatusMessage(
        `Failed to send. Please try again or email ${CONTACT_EMAIL}.`,
      );
    }
  };

  const rise: Variants = reduce
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 22 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.8, ease },
        },
      };

  const group: Variants = reduce
    ? { hidden: {}, visible: {} }
    : {
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.12, delayChildren: 0.05 },
        },
      };

  return (
    <section
      id={id}
      className={cn("aot-contact dark fade-up section-major", className)}
      aria-labelledby={headingId}
    >
      <motion.div
        className="aot-contact__layout grid w-full max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]"
        variants={group}
        initial={reduce ? false : "hidden"}
        whileInView={reduce ? undefined : "visible"}
        viewport={{ once: true, amount: 0.22 }}
      >
        <motion.div className="flex flex-col gap-6" variants={rise}>
          {badge && (
            <Badge variant="outline" className="aot-contact__badge">
              <Sparkles className="size-3.5" aria-hidden="true" />
              {badge}
            </Badge>
          )}

          <h2
            id={headingId}
            className="aot-contact__title text-foreground text-4xl leading-tight font-extrabold tracking-tight sm:text-5xl"
          >
            {headline}{" "}
            <span className="aot-contact__title-accent text-primary block">
              {headlineAccent}
            </span>
          </h2>

          <p className="aot-contact__copy text-muted-foreground leading-relaxed">
            {subheadline}
          </p>

          <Separator className="aot-contact__rule border-primary/40 my-2 w-16" />

          <div className="aot-contact__chips">
            <a
              href={contactInfo.emailHref ?? `mailto:${contactInfo.email}`}
              className="aot-contact__chip bg-muted flex items-center"
              aria-label={`Email ${contactInfo.email}`}
            >
              <div className="aot-contact__chip-icon bg-card flex shrink-0 items-center justify-center">
                <FaEnvelope className="text-primary" aria-hidden="true" />
              </div>
              <div className="aot-contact__chip-copy min-w-0">
                <p className="aot-contact__chip-label text-muted-foreground font-medium tracking-wider">
                  {contactInfo.emailLabel ?? "Email"}
                </p>
                <p className="aot-contact__chip-value aot-contact__chip-value--email text-foreground font-semibold">
                  {contactInfo.email}
                </p>
              </div>
            </a>

            <a
              href={contactInfo.phoneHref ?? BOOK_A_CALL_URL}
              className="aot-contact__chip bg-muted flex items-center"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Book a call with AllOfTech"
            >
              <div className="aot-contact__chip-icon bg-card flex shrink-0 items-center justify-center">
                <FaPhoneAlt className="text-primary" aria-hidden="true" />
              </div>
              <div className="aot-contact__chip-copy min-w-0">
                <p className="aot-contact__chip-label text-muted-foreground font-medium tracking-wider">
                  {contactInfo.phoneLabel ?? "Phone"}
                </p>
                <p className="aot-contact__chip-value text-foreground font-semibold">
                  {contactInfo.phone}
                </p>
              </div>
            </a>
          </div>
        </motion.div>

        <motion.div variants={rise}>
          <Card className="aot-contact__card bg-muted rounded-4xl shadow-sm ring-0">
            <CardContent className="flex flex-col gap-5 p-8">
              <form
                id="contact-form"
                className="flex flex-col gap-5"
                action="#"
                method="post"
                aria-label="Contact Form"
                data-aot-bound="1"
                onSubmit={handleSubmit}
              >
                <div
                  className={cn(
                    "aot-contact__feedback",
                    status === "success" && "is-success is-visible",
                    (status === "error" || status === "sending") && "is-visible",
                  )}
                  id="contactFormFeedback"
                  role="status"
                  aria-live="polite"
                  hidden={status === "idle"}
                >
                  {statusMessage}
                </div>

                <div className="flex flex-col gap-0.5">
                  <Label htmlFor="name" className="text-foreground text-sm font-medium">
                    Full Name
                  </Label>
                  <Input
                    id="name"
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

                <div className="flex flex-col gap-0.5">
                  <Label htmlFor="email" className="text-foreground text-sm font-medium">
                    Work Email
                  </Label>
                  <Input
                    id="email"
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

                <div className="flex flex-col gap-0.5">
                  <Label htmlFor="service" className="text-foreground text-sm font-medium">
                    Area of Interest
                  </Label>
                  <Select
                    value={form.service || undefined}
                    onValueChange={(value) => handleChange("service", value)}
                  >
                    <SelectTrigger
                      id="service"
                      className={cn(
                        fieldClass,
                        "text-muted-foreground data-[size=default]:h-11 w-full justify-between",
                      )}
                    >
                      <SelectValue placeholder="Choose a service" />
                    </SelectTrigger>
                    <SelectContent
                      align="start"
                      position="popper"
                      className="aot-contact__select rounded-xl"
                    >
                      {serviceOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value} className="text-sm">
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-0.5">
                  <Label htmlFor="message" className="text-foreground text-sm font-medium">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us about the project, the deadline, and what good looks like."
                    rows={4}
                    value={form.message}
                    onChange={(event) => handleChange("message", event.target.value)}
                    required
                    aria-required="true"
                    className={cn(fieldClass, "h-auto min-h-28 resize-none py-3")}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={status === "sending"}
                  className="aot-contact__submit bg-primary text-primary-foreground hover:bg-primary/90 group mt-1 h-auto w-full rounded-xl py-5 text-sm font-semibold shadow-[inset_0_2px_0_0_rgba(255,255,255,0.28),inset_0_-2px_0_0_rgba(0,0,0,0.2)] transition-all"
                >
                  {status === "sending" ? "Sending…" : ctaLabel}
                  <FaArrowRight className="ml-2 text-xs transition-transform group-hover:translate-x-1" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </section>
  );
}
