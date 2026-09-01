import { MONTHLY_PDF } from "@/lib/monthly-pdf";
import MonthlyPdfDownload from "@/components/MonthlyPdfDownload";
import styles from "./monthly-pdf.module.css";

function accentHeading(heading: string, accent: string) {
  const index = heading.toLowerCase().indexOf(accent.toLowerCase());
  if (index < 0) return heading;
  return (
    <>
      {heading.slice(0, index)}
      <span className={styles.accent}>
        {heading.slice(index, index + accent.length)}
      </span>
      {heading.slice(index + accent.length)}
    </>
  );
}

export default function MonthlyPdfPage() {
  return (
    <main className={styles.page} id="free-pdf">
      <div className={styles.inner}>
        <header className={styles.hero}>
          <p className={styles.badge}>
            <span className={styles.badgeDot} aria-hidden="true" />
            {MONTHLY_PDF.badge}
          </p>
          <h1>{accentHeading(MONTHLY_PDF.heading, MONTHLY_PDF.headingAccent)}</h1>
          <p className={styles.lede}>{MONTHLY_PDF.lede}</p>
        </header>

        <div className={styles.layout}>
          <div className={styles.read}>
            {MONTHLY_PDF.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <aside className={styles.gate} aria-label="Download PDF">
            <MonthlyPdfDownload />
          </aside>
        </div>

        <section className={styles.cta} aria-labelledby="monthly-pdf-cta">
          <p className={styles.label}>{MONTHLY_PDF.ctaKicker}</p>
          <h2 id="monthly-pdf-cta">{MONTHLY_PDF.ctaHeading}</h2>
          <p className={styles.ctaBody}>{MONTHLY_PDF.ctaBody}</p>
          <ol className={styles.points}>
            {MONTHLY_PDF.ctaPoints.map((point, index) => (
              <li key={point.title}>
                <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{point.title}</h3>
                  <p>{point.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <a
            className="btn-secondary"
            href={MONTHLY_PDF.ctaButtonHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            {MONTHLY_PDF.ctaButtonLabel}
          </a>
        </section>
      </div>
    </main>
  );
}
