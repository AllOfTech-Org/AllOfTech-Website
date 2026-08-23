"use client";

import emailjs from "@emailjs/browser";
import {
  CONTACT_EMAILJS_SERVICE_ID,
  CONTACT_EMAILJS_TEMPLATE_ID,
  EMAILJS_PUBLIC_KEY,
} from "@/lib/emailjs";

let initialized = false;

function ensureEmailJs() {
  if (initialized) return;
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  initialized = true;
}

export async function sendContactForm(form: HTMLFormElement) {
  ensureEmailJs();
  await emailjs.sendForm(CONTACT_EMAILJS_SERVICE_ID, CONTACT_EMAILJS_TEMPLATE_ID, form);
}
