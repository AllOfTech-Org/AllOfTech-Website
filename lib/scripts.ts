const HOME_SCRIPTS = [
  "https://cdn.jsdelivr.net/npm/marked/marked.min.js",
  "/js/site-core.js",
  "/js/motion-system.js",
  "/js/button-motion.js",
  "/js/hero-lookat.js",
  "/js/chatbot.js",
  "/js/user-tracking.js",
  "/js/home-autofill.js",
] as const;

const PAGE_SCRIPTS = [
  "/js/site-core.js",
  "/js/motion-system.js",
  "/js/button-motion.js",
] as const;

const CASE_STUDY_SCRIPTS = [
  "/js/site-core.js",
  "/js/motion-system.js",
  "/js/button-motion.js",
  "/js/case-studies-extras.js",
] as const;

export { HOME_SCRIPTS, PAGE_SCRIPTS, CASE_STUDY_SCRIPTS };
