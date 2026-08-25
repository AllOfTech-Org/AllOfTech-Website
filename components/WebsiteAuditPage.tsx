"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import WebsiteAuditForm from "@/components/WebsiteAuditForm";
import {
  AUDIT_DELIVERABLES,
  AUDIT_FAQS,
  AUDIT_PROOF,
  AUDIT_STEPS,
} from "@/lib/website-audit";

const ease = [0.16, 1, 0.3, 1] as const;

export default function WebsiteAuditPage() {
  const reduce = useReducedMotion();

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
        visible: { transition: { staggerChildren: 0.1, delayChildren: 0.04 } },
      };

  return (
    <main className="aot-audit dark" id="free-website-audit">
      <motion.div
        className="aot-audit__inner"
        variants={group}
        initial={reduce ? false : "hidden"}
        animate={reduce ? undefined : "visible"}
      >
        <motion.header className="aot-audit__hero" variants={rise}>
          <p className="aot-audit__badge">
            <span className="aot-audit__badge-dot" aria-hidden="true" />
            Free review
          </p>
          <h1>
            Free website <span className="aot-audit__accent">audit</span>
          </h1>
          <p className="aot-audit__lede">
            Send the live URL. We will look at speed, trust, SEO, and the pages
            that lose people — then email you what to fix first. Usually within
            48 hours. Nothing to buy.
          </p>
          <ul className="aot-audit__proof">
            {AUDIT_PROOF.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </motion.header>

        <div className="aot-audit__layout">
          <motion.div className="aot-audit__story" variants={rise}>
            <section className="aot-audit__block" aria-labelledby="audit-get">
              <p className="aot-audit__label">What you receive</p>
              <h2 id="audit-get">Written notes. Not a score.</h2>
              <ol className="aot-audit__points">
                {AUDIT_DELIVERABLES.map((item, index) => (
                  <li key={item.title}>
                    <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section className="aot-audit__block" aria-labelledby="audit-how">
              <p className="aot-audit__label">How it works</p>
              <h2 id="audit-how">Three steps. Then the notes.</h2>
              <ol className="aot-audit__steps">
                {AUDIT_STEPS.map((step) => (
                  <li key={step.n}>
                    <span aria-hidden="true">{step.n}</span>
                    <div>
                      <h3>{step.title}</h3>
                      <p>{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          </motion.div>

          <motion.aside className="aot-audit__form-wrap" variants={rise} aria-label="Audit form">
            <div className="aot-audit__card">
              <WebsiteAuditForm />
            </div>
          </motion.aside>
        </div>

        <motion.section className="aot-audit__faq" aria-labelledby="audit-faq" variants={rise}>
          <p className="aot-audit__label">Before you send it</p>
          <h2 id="audit-faq">Short answers</h2>
          <div className="aot-audit__faq-grid">
            {AUDIT_FAQS.map((faq) => (
              <article key={faq.question}>
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </article>
            ))}
          </div>
        </motion.section>
      </motion.div>
    </main>
  );
}
