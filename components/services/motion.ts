import type { Variants } from "framer-motion";

export const servicesEase = [0.16, 1, 0.3, 1] as const;

export const servicesItem: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: servicesEase },
  },
};

export const servicesRise: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: servicesEase },
  },
};
