"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import ServiceMediaCard from "@/components/services/ServiceMediaCard";
import ServiceStillRow from "@/components/services/ServiceStillRow";
import { servicesItem, servicesRise } from "@/components/services/motion";
import { IMAGE_SIZES } from "@/lib/image";
import { getRelatedServices, type ServicePageContent } from "@/lib/services";
import { BOOK_A_CALL_URL } from "@/lib/site";

function titleLead(title: string) {
  const parts = title.split(" ");
  if (parts.length < 2) return { rest: "", last: title };
  return { rest: parts.slice(0, -1).join(" "), last: parts[parts.length - 1] };
}

export default function ServicePage({ service }: { service: ServicePageContent }) {
  const reduce = useReducedMotion();
  const related = getRelatedServices(service.slug);
  const view = reduce ? undefined : { once: true, margin: "-70px" as const };
  const heading = titleLead(service.listingTitle);
  const heroImage = service.heroImage ?? service.listingImage;
  const heroImageAlt = service.heroImageAlt ?? service.listingImageAlt;

  return (
    <main className="aot-services dark">
      <div className="aot-services__inner">
        <section className="aot-services-hero" aria-labelledby="service-heading">
          <div className="aot-services-hero__media">
            {heroImage ? (
              <Image
                src={heroImage}
                alt={heroImageAlt}
                fill
                priority
                sizes={IMAGE_SIZES.serviceHero}
                className="aot-services-hero__img"
              />
            ) : (
              <div className="aot-services-hero__stage" aria-hidden="true" />
            )}
          </div>
          <div className="aot-services-hero__wash" aria-hidden="true" />
          {!heroImage ? (
            <div className="aot-services-hero__soon">
              <span>Coming soon</span>
            </div>
          ) : null}
          <div className="aot-services-hero__copy">
            <p className="aot-services__badge">
              <span className="aot-services__badge-dot" aria-hidden="true" />
              {service.eyebrow}
            </p>
            <h1 id="service-heading" className="aot-services__title">
              {heading.rest ? (
                <>
                  {heading.rest} <span className="hero-flow">{heading.last}</span>
                </>
              ) : (
                <span className="hero-flow">{heading.last}</span>
              )}
            </h1>
            <p className="aot-services-hero__get">{service.pageHeading}</p>
          </div>
        </section>

        <motion.section
          className="aot-services-section"
          aria-labelledby="gallery-heading"
          variants={reduce ? undefined : servicesRise}
          initial={reduce ? false : "hidden"}
          whileInView={reduce ? undefined : "visible"}
          viewport={view}
        >
          <p className="aot-services-section__label">{service.galleryLabel}</p>
          <h2 id="gallery-heading">{service.galleryHeading}</h2>
          <p>{service.galleryIntro}</p>
          <div className="aot-services-stills">
            {service.gallery.map((slot, index) => (
              <ServiceStillRow
                key={`${slot.title}-${index}`}
                title={slot.title}
                lead={slot.lead}
                meaning={slot.meaning}
                imageSrc={slot.imageSrc}
                videoSrc={slot.videoSrc}
                imageAlt={slot.imageAlt}
                flip={index % 2 === 1}
                delayMs={index * 80}
              />
            ))}
          </div>
        </motion.section>

        <motion.section
          className="aot-services-section"
          aria-labelledby="offer-heading"
          variants={reduce ? undefined : servicesItem}
          initial={reduce ? false : "hidden"}
          whileInView={reduce ? undefined : "visible"}
          viewport={view}
        >
          <p className="aot-services-section__label">{service.offerLabel}</p>
          <h2 id="offer-heading">{service.pageHeading}</h2>
          <p>{service.pageIntro}</p>
          <div className="aot-services-features">
            {service.features.map((feature, index) => (
              <motion.article
                key={feature.title}
                className="aot-services-feature"
                variants={reduce ? undefined : servicesItem}
                initial={reduce ? false : "hidden"}
                whileInView={reduce ? undefined : "visible"}
                viewport={view}
                style={{ ["--aot-delay" as string]: `${index * 70}ms` }}
              >
                <h3>{feature.title}</h3>
                {feature.body ? <p>{feature.body}</p> : null}
                {feature.purpose ? (
                  <p>
                    <em>Purpose:</em> {feature.purpose}
                  </p>
                ) : null}
                {feature.includes?.length ? (
                  <>
                    <p>
                      <strong>Includes:</strong>
                    </p>
                    <ul>
                      {feature.includes.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </>
                ) : null}
                {feature.benefits ? (
                  <p>
                    <strong>Benefits:</strong> {feature.benefits}
                  </p>
                ) : null}
              </motion.article>
            ))}
          </div>
        </motion.section>

        {service.showcases.length > 0 ? (
          <motion.section
            className="aot-services-section"
            aria-labelledby="showcase-heading"
            variants={reduce ? undefined : servicesRise}
            initial={reduce ? false : "hidden"}
            whileInView={reduce ? undefined : "visible"}
            viewport={view}
          >
            <p className="aot-services-section__label">{service.showcaseLabel}</p>
            <h2 id="showcase-heading">{service.showcaseHeading}</h2>
            <p>{service.showcaseIntro}</p>
            <div className="aot-services__grid">
              {service.showcases.map((item, index) => (
                <ServiceMediaCard
                  key={`${item.title}-${index}`}
                  title={item.title}
                  category={item.category}
                  meta={item.meta}
                  imageSrc={item.imageSrc}
                  videoSrc={item.videoSrc}
                  imageAlt={item.imageAlt}
                  href={item.href}
                  accent={service.accent}
                  icon={item.comingSoon ? "sparkles" : service.icon}
                  ctaLabel={item.href ? "See the work" : undefined}
                  comingSoon={item.comingSoon || (!item.imageSrc && !item.videoSrc)}
                  comingSoonLabel={item.comingSoonLabel ?? "Coming soon"}
                  delayMs={index * 80}
                />
              ))}
            </div>
          </motion.section>
        ) : null}

        <motion.div
          className="aot-services-cta"
          variants={reduce ? undefined : servicesRise}
          initial={reduce ? false : "hidden"}
          whileInView={reduce ? undefined : "visible"}
          viewport={view}
        >
          <h2>{service.ctaHeading}</h2>
          <p>{service.ctaBody}</p>
          <div className="hero-buttons">
            <a
              href={BOOK_A_CALL_URL}
              className="btn-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Book a call
            </a>
          </div>
        </motion.div>

        <motion.section
          className="aot-services-section"
          aria-labelledby="related-heading"
          variants={reduce ? undefined : servicesRise}
          initial={reduce ? false : "hidden"}
          whileInView={reduce ? undefined : "visible"}
          viewport={view}
        >
          <p className="aot-services-section__label">{service.relatedLabel}</p>
          <h2 id="related-heading">{service.relatedHeading}</h2>
          <div className="aot-services__grid aot-services__grid--related">
            {related.map((item, index) => (
              <ServiceMediaCard
                key={item.slug}
                title={item.listingTitle}
                category={item.shortName}
                meta={item.listingMeta}
                imageSrc={item.listingImage}
                imageAlt={item.listingImageAlt}
                href={item.route}
                accent={item.accent}
                icon={item.icon}
                ctaLabel="View service"
                comingSoon={!item.listingImage}
                comingSoonLabel="Coming soon"
                delayMs={index * 70}
              />
            ))}
          </div>
        </motion.section>
      </div>
    </main>
  );
}
