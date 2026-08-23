import type { TeamMember } from "@/components/ui/team-1";

function teamImage(file: string) {
  return encodeURI(`/images/Team/${file}`);
}

export const TEAM_PHOTOS = {
  ceo: teamImage("CEO image .png"),
  coo: teamImage("COO.jpeg"),
  combine1: teamImage("Combine1 .jpg"),
  combine2: teamImage("Combine2.jpg"),
  combine3: teamImage("Combine3.jpg"),
  combine4: teamImage("COMBINE4.jpeg"),
} as const;

export const TEAM_LEADERSHIP: TeamMember[] = [
  {
    id: "ceo",
    name: "Mohammod Ibrahim Hossain",
    role: "Founder & CEO",
    image: TEAM_PHOTOS.ceo,
    imageClassName: "object-[center_18%]",
    imageWidth: 865,
    imageHeight: 1082,
    skill: "AI / ML / turning data into decisions.",
    vision: "We build what your business runs on.",
    email: "ibrahim@alloftech.site",
    signals: ["AI/ML", "Systems", "Web"],
    socials: [
      {
        icon: "linkedin",
        url: "https://www.linkedin.com/in/ibrahim-hossain-554198285/",
      },
    ],
  },
  {
    id: "coo",
    name: "Tamzid Rahman",
    role: "Co-Founder & COO",
    image: TEAM_PHOTOS.coo,
    imageClassName: "object-center",
    imageWidth: 2360,
    imageHeight: 2360,
    skill: "3D animation — clean product motion, lighting, and presentation.",
    vision: "Bring Your Imagination To Life",
    email: "tamzid@alloftech.site",
    signals: ["Animation", "Motion", "Light"],
    socials: [
      {
        icon: "linkedin",
        url: "https://www.linkedin.com/in/tamzid-rahman-8a3b2a2a1/",
      },
    ],
  },
];

export type TeamGroupShot = {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  tile: string;
  caption: string;
};

export const TEAM_GROUP_SHOTS: TeamGroupShot[] = [
  {
    id: "combine1",
    src: TEAM_PHOTOS.combine1,
    alt: "AllOfTech team working together",
    width: 4064,
    height: 3048,
    tile: "c1",
    caption: "In session",
  },
  {
    id: "combine2",
    src: TEAM_PHOTOS.combine2,
    alt: "AllOfTech team standing together",
    width: 3048,
    height: 4064,
    tile: "c2",
    caption: "On site",
  },
  {
    id: "combine3",
    src: TEAM_PHOTOS.combine3,
    alt: "AllOfTech team together in the city",
    width: 4064,
    height: 3048,
    tile: "c3",
    caption: "After hours",
  },
  {
    id: "combine4",
    src: TEAM_PHOTOS.combine4,
    alt: "AllOfTech team together on the coast",
    width: 960,
    height: 1280,
    tile: "c4",
    caption: "The studio",
  },
];
