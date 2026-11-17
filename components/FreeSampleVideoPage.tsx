"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import FreeSampleVideoForm from "@/components/FreeSampleVideoForm";
import { SAMPLE_DELIVERABLES, SAMPLE_FAQS, SAMPLE_STEPS } from "@/lib/free-sample-video";

const ease = [0.16, 1, 0.3, 1] as const;

export default function FreeSampleVideoPage() {
  const reduce = useReducedMotion();
  const rise: Variants = reduce
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : { hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease } } };
  const group: Variants = reduce
    ? { hidden: {}, visible: {} }
    : { hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.04 } } };

  return (
    <main className="aot-audit dark" id="free-sample-video">
      <motion.div className="aot-audit__inner" variants={group} initial={reduce ? false : "hidden"} animate={reduce ? undefined : "visible"}>
        <motion.header className="aot-audit__hero" variants={rise}>
          <p className="aot-audit__badge"><span className="aot-audit__badge-dot" aria-hidden="true" />Free 3D product-animation concept</p>
          <h1>Get a free <span className="aot-audit__accent">sample video</span></h1>
          <p className="aot-audit__lede">
            Send one Amazon, Shopify, or brand product page. We will review the listing and, if it is a fit, shape a short tailored concept sample that shows what motion can clarify.
          </p>
          <ul className="aot-audit__proof">
            <li>Physical products</li>
            <li>Any digital channel</li>
            <li>No commitment</li>
          </ul>
        </motion.header>

        <div className="aot-audit__layout">
          <motion.div className="aot-audit__story" variants={rise}>
            <section className="aot-audit__block" aria-labelledby="sample-get">
              <p className="aot-audit__label">What you receive</p>
              <h2 id="sample-get">One useful direction—not a template.</h2>
              <ol className="aot-audit__points">
                {SAMPLE_DELIVERABLES.map((item, index) => <li key={item.title}><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><div><h3>{item.title}</h3><p>{item.body}</p></div></li>)}
              </ol>
            </section>
            <section className="aot-audit__block" aria-labelledby="sample-how">
              <p className="aot-audit__label">How it works</p>
              <h2 id="sample-how">From product page to sample direction.</h2>
              <ol className="aot-audit__steps">
                {SAMPLE_STEPS.map((step) => <li key={step.n}><span aria-hidden="true">{step.n}</span><div><h3>{step.title}</h3><p>{step.body}</p></div></li>)}
              </ol>
            </section>
          </motion.div>
          <motion.aside className="aot-audit__form-wrap" variants={rise} aria-label="Free product video sample form">
            <div className="aot-audit__card"><FreeSampleVideoForm /></div>
          </motion.aside>
        </div>

        <motion.section className="aot-audit__faq" aria-labelledby="sample-faq" variants={rise}>
          <p className="aot-audit__label">Before you send it</p>
          <h2 id="sample-faq">Short answers</h2>
          <div className="aot-audit__faq-grid">
            {SAMPLE_FAQS.map((faq) => <article key={faq.question}><h3>{faq.question}</h3><p>{faq.answer}</p></article>)}
          </div>
        </motion.section>
      </motion.div>
    </main>
  );
}
