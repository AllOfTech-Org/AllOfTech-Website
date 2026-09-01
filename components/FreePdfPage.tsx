import {
  CURRENT_PDF,
  pdfDownloadHref,
} from "@/lib/free-pdf";
import styles from "./free-pdf.module.css";

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

export default function FreePdfPage() {
  return (
    <main className={styles.page} id="free-guide">
      <div className={styles.inner}>
        <section className={styles.split}>
          <header className={styles.hero}>
            <p className={styles.badge}>
              <span className={styles.badgeDot} aria-hidden="true" />
              {CURRENT_PDF.badge}
            </p>
            <h1>
              {accentHeading(CURRENT_PDF.heading, CURRENT_PDF.headingAccent)}
            </h1>
            <p className={styles.lede}>{CURRENT_PDF.lede}</p>
            <div className={styles.read}>
              {CURRENT_PDF.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </header>

          <aside className={styles.file} aria-label="Download PDF">
            <div className={styles.sheet}>
              <p className={styles.sheetKicker}>PDF</p>
              <p className={styles.sheetName}>{CURRENT_PDF.heading}</p>
              <p className={styles.sheetMeta}>{CURRENT_PDF.fileNote}</p>
              <a
                className={`btn-primary ${styles.download}`}
                href={pdfDownloadHref()}
                download={CURRENT_PDF.downloadName}
                type="application/pdf"
              >
                <svg
                  aria-hidden="true"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M8 2v8m0 0 3-3m-3 3L5 7M3 12.5h10"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {CURRENT_PDF.downloadLabel}
              </a>
            </div>
          </aside>
        </section>

        <section className={styles.cta} aria-labelledby="pdf-cta-heading">
          <p className={styles.label}>{CURRENT_PDF.ctaKicker}</p>
          <h2 id="pdf-cta-heading">{CURRENT_PDF.ctaHeading}</h2>
          <p className={styles.ctaBody}>{CURRENT_PDF.ctaBody}</p>
          <ol className={styles.points}>
            {CURRENT_PDF.ctaPoints.map((point, index) => (
              <li key={point.title}>
                <span aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3>{point.title}</h3>
                  <p>{point.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <a
            className="btn-secondary"
            href={CURRENT_PDF.ctaButtonHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            {CURRENT_PDF.ctaButtonLabel}
          </a>
        </section>
      </div>
    </main>
  );
}
