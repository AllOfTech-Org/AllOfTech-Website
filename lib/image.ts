/** `sizes` values matched to on-page layout so phones skip desktop rasters. */
export const IMAGE_SIZES = {
  homeCard: "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 360px",
  serviceHero: "(max-width: 1180px) 100vw, 1180px",
  serviceCard: "(max-width: 760px) 100vw, 50vw",
  serviceStill: "(max-width: 839px) 46vw, 540px",
} as const;
