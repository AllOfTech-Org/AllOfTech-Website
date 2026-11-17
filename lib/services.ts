export type ServiceSlug =
  | "ai-development"
  | "web-development"
  | "animation"
  | "branding"
  | "ux-ui-design"
  | "mobile-app-development";

export type ServiceAccent = "cyan" | "purple" | "pink";

export type ServiceIconName =
  | "brain"
  | "globe"
  | "clapperboard"
  | "palette"
  | "layout"
  | "smartphone"
  | "sparkles";

export type ServiceContent = {
  slug: ServiceSlug;
  route: string;
  title: string;
  description: string;
  keywords: string[];
  openGraphTitle: string;
  openGraphDescription: string;
  shortName: string;
  schema: {
    serviceType: string;
    name: string;
    description: string;
  };
};

export type ServiceMediaSlot = {
  title: string;
  meaning: string;
  lead?: string;
  category: string;
  meta: string;
  imageSrc?: string;
  videoSrc?: string;
  imageAlt: string;
  comingSoon?: boolean;
  comingSoonLabel?: string;
};

export type ServiceShowcase = {
  title: string;
  category: string;
  meta: string;
  imageSrc?: string;
  videoSrc?: string;
  imageAlt: string;
  href?: string;
  comingSoon?: boolean;
  comingSoonLabel?: string;
};

export type ServiceFeature = {
  title: string;
  body?: string;
  purpose?: string;
  includes?: string[];
  benefits?: string;
};

export type ServicePageContent = ServiceContent & {
  listingTitle: string;
  listingMeta: string;
  listingImage?: string;
  listingImageAlt: string;
  heroImage?: string;
  heroImageAlt?: string;
  cardSummary: string;
  accent: ServiceAccent;
  icon: ServiceIconName;
  eyebrow: string;
  pageHeading: string;
  pageIntro: string;
  galleryLabel: string;
  galleryHeading: string;
  galleryIntro: string;
  offerLabel: string;
  showcaseLabel: string;
  showcaseHeading: string;
  showcaseIntro: string;
  relatedLabel: string;
  relatedHeading: string;
  features: ServiceFeature[];
  relatedSlugs: ServiceSlug[];
  gallery: ServiceMediaSlot[];
  showcases: ServiceShowcase[];
  ctaHeading: string;
  ctaBody: string;
};

export function serviceAsset(filename: string) {
  const optimized = filename.replace(/\.(png|jpe?g)$/i, ".webp");
  return `/images/Service/${optimized}`;
}

const COMING_DEMO: Pick<ServiceShowcase, "comingSoon" | "comingSoonLabel"> = {
  comingSoon: true,
  comingSoonLabel: "Coming soon",
};

export const SERVICES_INDEX = {
  title: "Services | AllOfTech",
  description:
    "AllOfTech builds AI, websites, animation, brand identity, UX/UI, and mobile apps. See what you get, then book a call.",
  openGraphDescription:
    "Image-led look at AllOfTech AI, web, animation, branding, UX/UI, and mobile — pick a service and go deeper.",
  keywords: [
    "AllOfTech services",
    "AI development agency",
    "web development agency",
    "animation studio",
    "branding agency",
    "UX UI design",
    "mobile app development",
  ],
} as const;

export const SERVICES: ServicePageContent[] = [
  {
    slug: "ai-development",
    route: "/services/ai-development",
    title: "AI Customer Support for Shopify & Amazon | AllOfTech",
    description:
      "AI customer support for US Shopify stores and Amazon sellers: product answers, order FAQs, smart handoff, and measurable support performance.",
    keywords: [
      "AI customer support for Shopify stores",
      "AI customer support for Amazon sellers",
      "Shopify customer service chatbot",
      "Amazon seller customer support automation",
      "ecommerce AI support",
    ],
    openGraphTitle: "AI Customer Support for Shopify & Amazon | AllOfTech",
    openGraphDescription:
      "AI support that answers product, order, and policy questions for Shopify and Amazon commerce teams, with human handoff when it matters.",
    shortName: "AI Customer Support",
    schema: {
      serviceType: "AI Customer Support",
      name: "AI Customer Support for Shopify and Amazon Sellers",
      description:
        "AI customer-support systems for US Shopify stores and Amazon sellers, including product answers, order FAQs, policy guidance, analytics, and human handoff.",
    },
    listingTitle: "AI Customer Support",
    listingMeta: "Shopify & Amazon",
    listingImage: serviceAsset("AI service 2.png"),
    listingImageAlt: "AllOfTech AI service visual: a studio robot working after hours",
    heroImage: serviceAsset("AI service Banner.png"),
    heroImageAlt: "AllOfTech AI banner: a mechanical eye with AI in the iris",
    cardSummary:
      "Give shoppers accurate product, order, and policy answers before they leave—then hand complex conversations to a person with context.",
    accent: "cyan",
    icon: "brain",
    eyebrow: "Commerce AI",
    pageHeading: "AI support that answers before shoppers leave",
    pageIntro:
      "Built for US Shopify and Amazon teams that repeat the same product, delivery, return, and order answers all day. In one e-commerce engagement, the client reported a 66% better response rate and a 23% sales increase. Results vary by store, traffic, offer, and implementation.",
    galleryLabel: "Systems",
    galleryHeading: "Support shoppers can actually use",
    galleryIntro:
      "Accurate answers, clear guardrails, and a clean handoff to your team—built around the store's real catalog and policies.",
    offerLabel: "What you get",
    showcaseLabel: "Results",
    showcaseHeading: "Live AI for real customers",
    showcaseIntro:
      "Open a live product to see how we put AI into a working product — not a demo that dies after the pitch.",
    relatedLabel: "Go further",
    relatedHeading: "Product video and web systems that support the sale",
    features: [
      {
        title: "Product questions answered",
        body: "Use approved catalog, sizing, material, care, and compatibility information to answer the questions that block a purchase.",
      },
      {
        title: "Order and policy guidance",
        body: "Handle common delivery, return, warranty, and order-status questions while keeping policy wording under your control.",
      },
      {
        title: "Human handoff with context",
        body: "Escalate edge cases to a person and carry the conversation context forward instead of making shoppers repeat themselves.",
      },
      {
        title: "Guardrails and source control",
        body: "Define what the assistant may answer, which source is authoritative, and when it must stop and ask a person.",
      },
      {
        title: "Questions you can measure",
        body: "Review common questions, failed answers, handoffs, and conversion opportunities so the system improves from real customer behavior.",
      },
    ],
    relatedSlugs: ["animation", "web-development"],
    gallery: [
      {
        title: "Automation",
        meaning:
          "Intelligent automation for the work that eats the week. We map the routine steps, then build AI that runs them — one request in, the next jobs done — so your team stays on the work that needs a person.",
        category: "AI / ML",
        meta: "Studio still",
        imageSrc: serviceAsset("Automation card.png"),
        imageAlt: "Automation diagram of one request processed into multiple completed tasks",
      },
      {
        title: "Always answering",
        meaning:
          "24/7 customer support that is always answering — common questions get an instant reply, and your team spends time on the work that needs a person.",
        category: "AI / ML",
        meta: "Studio still",
        imageSrc: serviceAsset("AI service 2.png"),
        imageAlt: "AllOfTech AI visual of a robot on a laptop",
      },
      {
        title: "Built with purpose",
        meaning:
          "AI you can actually see: a system built with a job. We map the first useful system so your team stops guessing and starts deciding — not a science project.",
        category: "AI / ML",
        meta: "Studio still",
        imageSrc: serviceAsset("AI service 3.png"),
        imageAlt: "AllOfTech AI visual of a cinematic robot bust",
      },
    ],
    showcases: [
      {
        title: "AI-powered customer service chatbot",
        category: "Live work",
        meta: "Mashover",
        href: "https://ai.alloftech.site/",
        imageSrc: "/images/case-studie/cs3.webp",
        imageAlt: "Mashover AI customer service chatbot",
      },
      {
        title: "Propulse AI — private Florida concierge",
        category: "Live work",
        meta: "Propulse",
        href: "https://propulse-ai.alloftech.site/",
        imageSrc: serviceAsset("ai 2nd product.png"),
        imageAlt: "Propulse AI luxury Florida real-estate concierge",
      },
    ],
    ctaHeading: "Ready to shorten the wait for an answer?",
    ctaBody: "Book a US-friendly call and we will map the first support flow, the approved sources, and the human handoff.",
  },
  {
    slug: "web-development",
    route: "/services/web-development",
    title: "Web & Web App Development Services | AllOfTech",
    description:
      "Custom websites, Shopify storefronts, and web applications built around your business goals, operations, customers, and growth plans.",
    keywords: [
      "custom web development agency",
      "web application development",
      "Shopify website development",
      "conversion focused website development",
      "custom web application development",
    ],
    openGraphTitle: "Web & Web App Development Services | AllOfTech",
    openGraphDescription:
      "Websites, storefronts, and custom web systems designed around how your business works and how your customers buy.",
    shortName: "Web Development",
    schema: {
      serviceType: "Web Development",
      name: "Web Development Services",
      description:
        "Custom websites, Shopify storefronts, and web applications, including AI, analytics, commerce, and business-system integrations.",
    },
    listingTitle: "Web Development",
    listingMeta: "Websites & web apps",
    listingImage: serviceAsset("Web development.png"),
    listingImageAlt: "AllOfTech web development card: laptop with a live site mockup",
    heroImage: serviceAsset("Web development 2.jpg"),
    heroImageAlt:
      "AllOfTech web development banner: laptop and phone showing a conversion-focused site",
    cardSummary:
      "Build a website or web application around the way your business sells, serves customers, and manages day-to-day work.",
    accent: "purple",
    icon: "globe",
    eyebrow: "Web agency",
    pageHeading: "A web system built around your business",
    pageIntro:
      "We build websites, Shopify storefronts, portals, dashboards, and web apps around your actual workflow. The result is fast, clear, manageable, and ready to grow with the business.",
    galleryLabel: "Sites",
    galleryHeading: "Websites built to sell",
    galleryIntro:
      "Every still here is from a site designed to load fast, look right on every screen, and turn a visit into a customer.",
    offerLabel: "What you get",
    showcaseLabel: "Results",
    showcaseHeading: "Live sites, shipped and working",
    showcaseIntro:
      "Real websites we rebuilt and launched — from local businesses to brand sites built to grow.",
    relatedLabel: "Go further",
    relatedHeading: "AI, design, and 3D animation that strengthen the experience",
    features: [
      {
        title: "Mobile product pages",
        body: "Give shoppers a clear path through dimensions, materials, delivery details, media, and calls to action on smaller screens.",
      },
      {
        title: "Shopify and commerce integrations",
        body: "Connect the catalog, checkout, analytics, product video, and support tools without turning the storefront into a slow plugin stack.",
      },
      {
        title: "Product content that answers questions",
        body: "Structure product information so shoppers and AI support can use the same accurate source for materials, care, fit, and policy details.",
      },
      {
        title: "A team-manageable content system",
        body: "Update products, prices, media, and campaign pages without waiting on a developer for routine changes.",
      },
      {
        title: "Performance measured before launch",
        body: "Audit the real mobile experience, compress visual assets, and avoid loading video until the shopper is ready to see it.",
      },
    ],
    relatedSlugs: ["ai-development", "animation"],
    gallery: [
      {
        title: "Screens that sell",
        meaning:
          "Turn visitors into customers. This still is a rebuild: screens built to load fast, look right on every device, and convert a visit into a sale.",
        category: "Web",
        meta: "Studio still",
        imageSrc: serviceAsset("web development 3.png"),
        imageAlt: "AllOfTech before-and-after website redesign still",
      },
      {
        title: "More than a brochure",
        meaning:
          "Your website is more than a brochure. It should look great and actually help you make more sales and grow — with room to go from 10 visitors to 10,000 without rebuilding.",
        category: "Web",
        meta: "Studio still",
        imageSrc: serviceAsset("43.png"),
        imageAlt: "AllOfTech web visual of a laptop on a stone plinth",
      },
    ],
    showcases: [
      {
        title: "PB(973) — Play The Code",
        category: "Live work",
        meta: "Flanders, NJ",
        href: "/case-studies#case-study-1",
        imageSrc: "/images/case-studie/After.webp",
        imageAlt: "PB(973) transformed website after AllOfTech rebuild",
      },
      {
        title: "Your Brand — Built for Growth",
        category: "Live work",
        meta: "Agency site",
        href: "/case-studies#case-study-2",
        imageSrc: "/images/case-studie/cs2-After.webp",
        imageAlt: "Your Brand business website after AllOfTech build",
      },
    ],
    ctaHeading: "Ready for a site that actually works?",
    ctaBody: "Book a call and we will sketch the right build for the way you sell.",
  },
  {
    slug: "animation",
    route: "/services/animation",
    title: "3D Product Animation Services | AllOfTech",
    description:
      "3D product animation and visualization for products, campaigns, presentations, ecommerce, and brand storytelling across digital channels.",
    keywords: [
      "3D product animation",
      "product animation studio",
      "3D product visualization",
      "CGI product video",
      "Amazon and Shopify product animation",
    ],
    openGraphTitle: "3D Product Animation Services | AllOfTech",
    openGraphDescription:
      "3D product animation that explains materials, movement, assembly, features, and product value with clarity.",
    shortName: "3D Product Animation",
    schema: {
      serviceType: "3D Product Animation",
      name: "3D Product Animation Services",
      description:
        "3D product animation and visualization for ecommerce, advertising, product launches, presentations, and brand storytelling.",
    },
    listingTitle: "3D Product Animation",
    listingMeta: "Products & brands",
    listingImage: serviceAsset("Animation 1.png"),
    listingImageAlt: "AllOfTech product animation of DualSense-style controllers",
    heroImage: serviceAsset("Animation Banner .png"),
    heroImageAlt: "AllOfTech animation banner: DualSense-style controllers, product animation",
    cardSummary:
      "Show materials, movement, scale, assembly, features, and use with polished 3D visuals that make complex products easy to understand.",
    accent: "pink",
    icon: "clapperboard",
    eyebrow: "3D product animation studio",
    pageHeading: "Show the product in ways a camera cannot",
    pageIntro:
      "We turn product ideas, CAD files, references, and existing assets into polished 3D animation. Use it to explain materials, dimensions, movement, assembly, internal details, or real-world use across any digital channel.",
    galleryLabel: "Frames",
    galleryHeading: "Motion built around a buying question",
    galleryIntro:
      "Every shot should answer something a static image cannot: how it moves, how it fits, what it is made from, or why the detail matters.",
    offerLabel: "What you get",
    showcaseLabel: "Results",
    showcaseHeading: "Animation already in the market",
    showcaseIntro:
      "Open the reel to see how we put animation into a working product — not a demo that dies after the pitch.",
    relatedLabel: "Go further",
    relatedHeading: "AI support and web systems around the product",
    features: [
      {
        title: "Amazon listing video",
        body: "A concise product story designed around the listing context, approved assets, and the features buyers need to understand quickly.",
      },
      {
        title: "Shopify product-page video",
        body: "A web-ready product film or loop that supports the product page without forcing every visitor to download a heavy video on first load.",
      },
      {
        title: "Material and feature callouts",
        body: "Show finish, texture, hardware, movement, modularity, assembly, internal parts, or functional details that are difficult to explain in a still image.",
      },
      {
        title: "3D product visualization",
        body: "Create controlled camera, lighting, exploded views, or environment shots when traditional production cannot show the product clearly enough.",
      },
      {
        title: "Channel-ready delivery",
        body: "Prepare the agreed aspect ratios, cuts, captions, and compressed web versions for the channels in the production scope.",
      },
      {
        title: "A defined production process",
        body: "Align on the product, message, storyboard, look, review stages, and delivery files before full production begins.",
      },
      {
        title: "USD project scoping",
        body: "US projects are quoted in USD after the format, asset quality, runtime, revisions, and delivery channels are clear.",
      },
    ],
    relatedSlugs: ["ai-development", "web-development"],
    gallery: [
      {
        title: "Social loops",
        meaning:
          "Short clips for the product and the brand — motion that holds attention on a feed without turning the story into a spectacle.",
        category: "Animation",
        meta: "Short-form",
        imageSrc: serviceAsset("Animation 2.png"),
        imageAlt: "Close-up AllOfTech product still of controller face buttons",
      },
      {
        title: "Brand films",
        meaning:
          "A process film: from a first shape to a finished product people remember — corporate and brand motion that makes the offer feel real.",
        category: "Animation",
        meta: "Story",
        imageSrc: serviceAsset("Animation 3.png"),
        imageAlt: "AllOfTech 3D process from a cube to a finished office chair",
      },
      {
        title: "Custom 3D scenes",
        meaning:
          "Product and environment in 3D — scenes you can show, explain, and sell, kept in a professional register.",
        category: "Animation",
        meta: "Concept",
        videoSrc: serviceAsset("Animation 4.mp4"),
        imageAlt: "AllOfTech custom 3D animation in motion",
      },
    ],
    showcases: [
      {
        title: "Animation reel",
        category: "Live work",
        meta: "Motion reel",
        href: "/case-studies#case-study-5",
        videoSrc: serviceAsset("animation.mp4"),
        imageAlt: "AllOfTech animation reel in motion",
      },
      {
        ...COMING_DEMO,
        title: "Product visualization",
        category: "Case study",
        meta: "3D product",
        imageAlt: "Upcoming AllOfTech product visualization case study",
      },
    ],
    ctaHeading: "Want to see the product in motion first?",
    ctaBody: "Send one public product page and request a free tailored concept sample before discussing full production.",
  },
  {
    slug: "branding",
    route: "/services/branding",
    title: "Logo, Brand Identity and Graphic Design | AllOfTech",
    description:
      "AllOfTech designs logos, brand identities, and marketing graphics for US businesses. Memorable branding that helps you stand out and sell.",
    keywords: [
      "graphics and branding agency",
      "logo design",
      "brand identity design",
      "marketing graphics",
      "packaging design",
      "custom illustration",
      "branding agency USA",
    ],
    openGraphTitle: "Graphics & Branding Services | Brand Agency | AllOfTech",
    openGraphDescription:
      "Logo design, complete brand identity systems, marketing graphics, and packaging that help your business stand out and sell.",
    shortName: "Graphics & Branding",
    schema: {
      serviceType: "Graphics & Branding",
      name: "Graphics & Branding Services",
      description:
        "Logo design, complete brand identity systems, marketing graphics, and packaging design that help US and global businesses stand out and build recognition.",
    },
    listingTitle: "Graphics & Branding",
    listingMeta: "Five-second read",
    listingImage: serviceAsset("Brand identity.png"),
    listingImageAlt: "AllOfTech branding visual: a figure that stands out from the crowd",
    heroImage: serviceAsset("Brand identity Banner.png"),
    heroImageAlt: "AllOfTech branding banner: a blue figure standing out from the crowd",
    cardSummary:
      "Make your business unforgettable with professional logos, consistent branding, and eye-catching marketing materials. Stand out from competitors and build a memorable brand.",
    accent: "cyan",
    icon: "palette",
    eyebrow: "Brand agency",
    pageHeading: "Make Your Business Unforgettable",
    pageIntro:
      "Your brand is how customers remember you. Create a visual identity that stands out from competitors and makes people think of you first. From your logo to your social media posts, we make everything look professional and memorable.",
    galleryLabel: "Identity",
    galleryHeading: "Identity in five seconds",
    galleryIntro:
      "Logos, campaigns, and brand systems designed so people recognize you on a card, a website, a shelf, or a feed.",
    offerLabel: "What you get",
    showcaseLabel: "Results",
    showcaseHeading: "Brands already in use",
    showcaseIntro:
      "Identity and graphics from live work — including brands you can see working on the websites we built.",
    relatedLabel: "Go further",
    relatedHeading: "UX, web, apps, and motion for the identity",
    features: [
      {
        title: "Logo That People Remember",
        body: "A unique logo that instantly tells customers who you are. Something they'll recognize on a business card, website, or storefront.",
      },
      {
        title: "Complete Brand Package",
        body: "Colors, fonts, and style guidelines that work everywhere. Use them on your website, business cards, signs, and social media for a professional, consistent look.",
      },
      {
        title: "Marketing Materials That Sell",
        body: "Eye-catching flyers, social media posts, and promotional graphics that grab attention and drive customers to your business.",
      },
      {
        title: "Custom Artwork That Tells Your Story",
        body: "Original illustrations and graphics that show what makes your business special. Stand out from competitors using stock photos.",
      },
      {
        title: "Packaging That Sells Itself",
        body: "Product packaging so attractive that customers notice it on shelves and want to buy. Great packaging can justify higher prices and build brand loyalty.",
      },
    ],
    relatedSlugs: ["ux-ui-design", "web-development", "mobile-app-development", "animation"],
    gallery: [
      {
        title: "Stand out in the crowd",
        meaning:
          "Your brand is how customers remember you. This identity is built to stand out from competitors and make people think of you first — on a card, a site, a shelf, or a feed.",
        category: "Branding",
        meta: "Studio still",
        imageSrc: serviceAsset("Brand identity.png"),
        imageAlt: "AllOfTech branding visual of a figure in a crowd",
      },
      {
        title: "Identity, not a stamp",
        meaning:
          "A unique logo that instantly tells customers who you are — recognized on a business card, website, or storefront — with colors, fonts, and guidelines that work everywhere.",
        category: "Branding",
        meta: "Studio still",
        imageSrc: serviceAsset("Brand identity 2.png"),
        imageAlt: "AllOfTech brand identity still with a distinct logo mark",
      },
      {
        title: "Five seconds.",
        lead: "That's all it takes",
        meaning:
          "In those few seconds, the customer decides whether to move forward with your product; or leave without a second thought.",
        category: "Branding",
        meta: "Studio still",
        imageSrc: serviceAsset("Brand identity 3.png"),
        imageAlt: "AllOfTech branding visual of an hourglass and a few seconds to decide",
      },
    ],
    showcases: [
      {
        title: "Brands that stand out",
        category: "Live work",
        meta: "Identity & graphics",
        href: "/case-studies#case-study-4",
        imageSrc: "/images/case-studie/34.webp",
        imageAlt: "AllOfTech graphic design and brand identity portfolio",
      },
      {
        title: "Your Brand — identity in the site",
        category: "Live work",
        meta: "Brand + web",
        href: "/case-studies#case-study-2",
        imageSrc: "/images/case-studie/cs2-After.webp",
        imageAlt: "Your Brand identity expressed on the live website",
      },
    ],
    ctaHeading: "Ready to look like the one they remember?",
    ctaBody: "Book a call and we will outline the identity your business can actually wear.",
  },
  {
    slug: "ux-ui-design",
    route: "/services/ux-ui-design",
    title: "UX/UI Design Services | Product Design | AllOfTech",
    description:
      "AllOfTech designs websites and apps that are easy to use and beautiful. Research, prototypes, and interfaces that turn visitors into customers.",
    keywords: [
      "UX UI design agency",
      "user experience design",
      "user interface design",
      "product design",
      "website UX",
      "app UI design",
      "UX design USA",
    ],
    openGraphTitle: "UX/UI Design Services | Product Design | AllOfTech",
    openGraphDescription:
      "Research, prototypes, and interface design that make websites and apps easy to use — and convert confused visitors into customers.",
    shortName: "UX/UI Design",
    schema: {
      serviceType: "UX/UI Design",
      name: "UX/UI Design Services",
      description:
        "User research, prototyping, interface design, and usability testing that make websites and apps easy to use and beautiful for US and global businesses.",
    },
    listingTitle: "UX/UI Design",
    listingMeta: "Easy to use",
    listingImage: serviceAsset("UI UX 1.png"),
    listingImageAlt: "AllOfTech UX/UI design: wireframe, tools, and interface layout",
    heroImage: serviceAsset("UI UX banner .png"),
    heroImageAlt: "AllOfTech UX/UI banner: interface components and design tools",
    cardSummary:
      "Make your website and app easy to use and beautiful. Great design turns confused visitors into happy customers who buy more and recommend you to others.",
    accent: "purple",
    icon: "layout",
    eyebrow: "Product design",
    pageHeading: "Make Your Digital Presence Easy & Beautiful",
    pageIntro:
      "First impressions matter. When customers visit your website or app, they should immediately understand how to use it and want to stay. Great design turns confused visitors into happy customers who buy more and tell their friends about you.",
    galleryLabel: "Screens",
    galleryHeading: "Design people can finish",
    galleryIntro:
      "Research, prototypes, and interface systems — so customers know what to do the first time they land, and they actually do it.",
    offerLabel: "What you get",
    showcaseLabel: "Results",
    showcaseHeading: "UX that made it to production",
    showcaseIntro:
      "Product design from live websites and apps — tested with real users before you spend on development.",
    relatedLabel: "Go further",
    relatedHeading: "Web, apps, brand, and AI after the design",
    features: [
      {
        title: "Understand What Your Customers Want",
        body: "We talk to your actual customers to learn what they need. No guessing - we design based on real feedback from people who use your business.",
      },
      {
        title: "Test Before You Build",
        body: "See exactly how your website or app will work before spending money on development. Make changes early when they're cheap and easy.",
      },
      {
        title: "Professional Look That Builds Trust",
        body: "Beautiful colors, clear fonts, and smart layouts make your business look professional and trustworthy. Customers feel confident buying from you.",
      },
      {
        title: "Fix Problems Before They Cost You Sales",
        body: "We test your design with real users to find confusing parts. Fix issues before customers get frustrated and leave.",
      },
      {
        title: "Consistent Brand Everywhere",
        body: "Your website, app, and marketing materials all look like they belong together. Build a strong, recognizable brand that customers remember.",
      },
    ],
    relatedSlugs: ["web-development", "mobile-app-development", "branding", "ai-development"],
    gallery: [
      {
        title: "Research & flows",
        meaning:
          "We talk to your actual customers to learn what they need. No guessing — we design from real feedback so people know what to do the first time they land.",
        category: "UX / UI",
        meta: "Studio still",
        imageSrc: serviceAsset("UI UX 1.png"),
        imageAlt: "AllOfTech UX/UI visual of a wireframe, design tools, and layout",
      },
      {
        title: "Prototype screens",
        meaning:
          "See exactly how the website or app will work before spending money on development. Make changes early, when they are cheap and easy.",
        category: "UX / UI",
        meta: "Studio still",
        imageSrc: serviceAsset("UI UX 2.png"),
        imageAlt: "AllOfTech UX/UI visual of a vector canvas and interface components",
      },
      {
        title: "Interface system",
        meaning:
          "Beautiful colors, clear fonts, and smart layouts make the business look professional and trustworthy — with website, app, and marketing that belong together.",
        category: "UX / UI",
        meta: "Studio still",
        imageSrc: serviceAsset("UI UX 3.png"),
        imageAlt: "AllOfTech UX/UI visual of screens from wireframe to finished interface",
      },
    ],
    showcases: [],
    ctaHeading: "Ready to make it easy to buy?",
    ctaBody: "Book a call and we will map the first screens your customers should see.",
  },
  {
    slug: "mobile-app-development",
    route: "/services/mobile-app-development",
    title: "iOS and Android App Development | AllOfTech",
    description:
      "AllOfTech builds iPhone and Android apps that make buying, booking, and staying connected effortless. Put your business in customers' pockets.",
    keywords: [
      "mobile app development agency",
      "iPhone app development",
      "Android app development",
      "cross platform apps",
      "mobile application development",
      "app development USA",
    ],
    openGraphTitle: "Mobile App Development Services | App Agency | AllOfTech",
    openGraphDescription:
      "iPhone and Android apps with a fast, smooth experience, bank-level security, and app store listing support.",
    shortName: "Mobile App Development",
    schema: {
      serviceType: "Mobile App Development",
      name: "Mobile App Development Services",
      description:
        "Cross-platform iPhone and Android app development with secure payments, push notifications, and app store listing for US and global businesses.",
    },
    listingTitle: "Mobile App Development",
    listingMeta: "In their pocket",
    listingImage: serviceAsset("Mobile App Development 1.png"),
    listingImageAlt: "AllOfTech mobile app blueprint: phone screens, charts, and flows",
    heroImage: serviceAsset("Mobile App development banner .png"),
    heroImageAlt: "AllOfTech mobile development banner: phone with layered app UI",
    cardSummary:
      "Put your business in customers' pockets with mobile apps that make buying, booking, and staying connected effortless. Keep your brand top-of-mind every day.",
    accent: "pink",
    icon: "smartphone",
    eyebrow: "App studio",
    pageHeading: "Put Your Business in Your Customers' Pockets",
    pageIntro:
      "Your customers are on their phones all day. Give them an app that makes it easy to buy from you, book services, track orders, or stay connected with your brand. Mobile apps keep your business top-of-mind and make repeat purchases effortless.",
    galleryLabel: "Apps",
    galleryHeading: "Apps built for the pocket",
    galleryIntro:
      "iPhone and Android screens for buying, booking, and staying connected — fast, secure, and ready for the store.",
    offerLabel: "What you get",
    showcaseLabel: "Results",
    showcaseHeading: "Mobile products in the wild",
    showcaseIntro:
      "Apps designed to live on the home screen — the ones customers open again because the job is easier on a phone.",
    relatedLabel: "Go further",
    relatedHeading: "Web, UX, AI, and brand around the app",
    features: [
      {
        title: "Works on iPhone & Android",
        body: "One app that works perfectly on both platforms. Reach all your customers without building separate apps for each system.",
      },
      {
        title: "Fast & Smooth Experience",
        body: "Your app responds instantly, just like apps from big companies. No lag, no crashes - just a great experience that keeps customers coming back.",
      },
      {
        title: "Bank-Level Security",
        body: "Protect customer payment information and personal data with the same security banks use. Your customers can trust you with their information.",
      },
      {
        title: "Instant Updates & Notifications",
        body: "Send special offers, order updates, or important messages directly to customers' phones. Keep them engaged and informed in real-time.",
      },
      {
        title: "Get Listed in App Stores",
        body: "We handle all the technical requirements to get your app approved and listed. Your customers can find and download your app easily.",
      },
    ],
    relatedSlugs: ["web-development", "ux-ui-design", "ai-development", "branding"],
    gallery: [
      {
        title: "iPhone & Android",
        meaning:
          "One app that works on both platforms. Reach every customer without building separate apps for each system.",
        category: "Mobile",
        meta: "Studio still",
        imageSrc: serviceAsset("Mobile App Development 1.png"),
        imageAlt: "AllOfTech mobile visual of a phone blueprint with screens and flows",
      },
      {
        title: "Smooth flows",
        meaning:
          "Buying, booking, tracking orders, and staying connected — with an app that responds instantly. No lag, no crashes: a fast, smooth experience that keeps customers coming back.",
        category: "Mobile",
        meta: "Studio still",
        imageSrc: serviceAsset("Mobile app development 2.png"),
        imageAlt: "AllOfTech mobile visual of a phone with floating app interface pieces",
      },
    ],
    showcases: [],
    ctaHeading: "Ready to live on the home screen?",
    ctaBody: "Book a call and we will outline the first version your customers will actually use.",
  },
];

export function getService(slug: ServiceContent["slug"]): ServicePageContent {
  const service = SERVICES.find((entry) => entry.slug === slug);
  if (!service) throw new Error(`Unknown service slug: ${slug}`);
  return service;
}

export function getRelatedServices(slug: ServiceSlug): ServicePageContent[] {
  return getService(slug).relatedSlugs.map(getService);
}
