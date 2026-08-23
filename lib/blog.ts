export const BLOG_INDEX = {
  title: "Tech Agency Blog | Technology Insights | AllOfTech",
  description:
    "Expert insights from a leading tech agency on AI development, web development, blockchain, mobile apps, and digital transformation. Stay updated with the latest technology trends and best practices.",
  keywords: [
    "tech agency blog",
    "technology blog",
    "AI development blog",
    "web development blog",
    "tech agency insights",
    "technology trends",
    "digital transformation blog",
  ],
  canonical: "/blog/",
};

export type BlogPost = {
  slug: "how-to-choose-tech-agency" | "ai-agency-services-guide";
  route: string;
  title: string;
  description: string;
  keywords: string[];
  datePublished: string;
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "how-to-choose-tech-agency",
    route: "/blog/how-to-choose-tech-agency",
    title: "How to Choose the Right Tech Agency | AllOfTech",
    description:
      "Complete guide to choosing the right tech agency for your business. Learn what to look for in a technology agency, how to evaluate their expertise, and ensure project success.",
    keywords: [
      "choose tech agency",
      "select technology agency",
      "tech agency guide",
      "how to hire tech agency",
      "technology agency selection",
    ],
    datePublished: "2025-01-20",
  },
  {
    slug: "ai-agency-services-guide",
    route: "/blog/ai-agency-services-guide",
    title: "AI Agency Services: Guide to AI Development | AllOfTech",
    description:
      "Complete guide to AI agency services. Learn about AI/ML development, machine learning solutions, predictive analytics, and how an AI agency can transform your business.",
    keywords: [
      "AI agency services",
      "AI development guide",
      "machine learning services",
      "AI agency benefits",
      "artificial intelligence solutions",
      "AI consulting",
    ],
    datePublished: "2025-01-18",
  },
];

export function getBlogPost(slug: BlogPost["slug"]): BlogPost {
  const post = BLOG_POSTS.find((entry) => entry.slug === slug);
  if (!post) throw new Error(`Unknown blog slug: ${slug}`);
  return post;
}
