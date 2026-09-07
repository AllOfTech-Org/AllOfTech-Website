export type PublishedReview = {
  author: string;
  client: string;
  service: string;
  rating: number;
  body: string;
};

export const PUBLISHED_REVIEWS: PublishedReview[] = [
  {
    author: "Tanvir Islam",
    client: "O.T METAL STEEL(PVT)LIMITED",
    service: "ERP Development",
    rating: 5,
    body: "They have developed a marvelous ERP for my company. Honestly, it has made my life easier. I can monitor everything so easily with this ERP system. It has everything from invoice to inventory. It works seamlessly. Will recommend them for their professionalism and honesty.",
  },
  {
    author: "Raima Akter",
    client: "Anzaras Cake",
    service: "Website Development",
    rating: 5,
    body: "Since launching my website with this team, my business has transformed. My customers can now see my cake designs clearly before purchasing, and that visual connection has directly boosted my sales. The website makes my work shine online. I'm genuinely grateful for the professional quality they delivered.",
  },
  {
    author: "Saidur Rahman",
    client: "Mashover",
    service: "AI Chatbot",
    rating: 5,
    body: "The AI chatbot has been a game-changer for my business. Customers get instant answers about my products, they feel heard, and their satisfaction has noticeably increased. It's helped me serve better while saving time. Highly recommend their service.",
  },
  {
    author: "Goodben47",
    client: "Video Production Animation",
    service: "Video Production Animation",
    rating: 5,
    body: "They created exactly what I envisioned. The quality is outstanding, and the turnaround was faster than expected. Highly recommended.",
  },
  {
    author: "Triishac",
    client: "Custom Marble Animation",
    service: "Custom Marble Animation",
    rating: 5,
    body: "They delivered a polished custom marble animation that looked exactly as discussed. The communication was smooth, timelines were respected, and the final result felt premium from start to finish.",
  },
];
