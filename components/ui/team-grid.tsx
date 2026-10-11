import React from "react";
import { Globe, Mail } from "lucide-react";
import { FaDribbble, FaGithub, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { cn } from "@/lib/utils";

export type SocialIconType =
  | "twitter"
  | "linkedin"
  | "github"
  | "dribbble"
  | "website"
  | "email";

export interface SocialLink {
  icon: SocialIconType;
  url: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  skill?: string;
  vision?: string;
  email?: string;
  signals?: string[];
  bio?: string;
  socials?: SocialLink[];
  imageClassName?: string;
  imageWidth?: number;
  imageHeight?: number;
}

export interface TeamGridProps {
  badge?: string;
  heading?: string;
  headingId?: string;
  description?: string;
  members?: TeamMember[];
  className?: string;
}

export const IconMap: Record<SocialIconType, React.ElementType> = {
  twitter: FaXTwitter,
  linkedin: FaLinkedinIn,
  github: FaGithub,
  dribbble: FaDribbble,
  website: Globe,
  email: Mail,
};

export function TeamCard({
  member,
  className,
}: {
  member: TeamMember;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "aot-team-grid__card group relative h-full min-h-0 overflow-hidden rounded-[1.15rem] border-[2px] focus-within:ring-2 focus-within:ring-offset-2",
        className,
      )}
      tabIndex={0}
    >
      <img
        src={member.image}
        alt={member.name}
        width={member.imageWidth}
        height={member.imageHeight}
        className={cn(
          "absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-hover:mask-b-from-100% group-focus-within:scale-105",
          member.imageClassName,
        )}
        loading="lazy"
        decoding="async"
      />

      <div
        className="aot-team-grid__blur absolute inset-0 rounded-[1.15rem] opacity-0 backdrop-blur-md transition-opacity duration-500 group-focus-within:opacity-100 group-hover:opacity-100"
        style={{
          WebkitMaskImage: "linear-gradient(to top, black 12%, transparent 72%)",
          maskImage: "linear-gradient(to top, black 12%, transparent 72%)",
        }}
      />

      <div className="aot-team-grid__wash absolute inset-0 opacity-80 transition-opacity duration-500 group-focus-within:opacity-95 group-hover:opacity-95" />

      <div className="aot-team-grid__meta absolute inset-0 z-[2] flex flex-col justify-end p-3 md:p-3.5">
        <h3 className="aot-team-grid__name text-lg font-semibold tracking-tight text-white md:text-xl">
          {member.name}
        </h3>
        <p className="aot-team-grid__role text-[0.65rem] font-medium tracking-[0.08em] uppercase">
          {member.role}
        </p>

        <div className="grid grid-rows-[0fr] opacity-0 transition-all duration-300 ease-out group-focus-within:grid-rows-[1fr] group-focus-within:opacity-100 group-hover:grid-rows-[1fr] group-hover:opacity-100">
          <div className="overflow-hidden">
            <div className="flex flex-col gap-2 pt-2">
              {member.bio && (
                <p className="line-clamp-3 text-xs leading-relaxed text-white/80">
                  {member.bio}
                </p>
              )}
              {member.socials && member.socials.length > 0 && (
                <div className="mb-0.5 flex items-center gap-2">
                  {member.socials.map((social, idx) => {
                    const Icon = IconMap[social.icon];
                    const external = social.url.startsWith("http");
                    return (
                      <a
                        key={idx}
                        href={social.url}
                        className="aot-team-grid__social flex h-8 w-8 items-center justify-center rounded-full text-white backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2"
                        aria-label={`${member.name} — ${social.icon}`}
                        {...(external
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TeamGrid({
  badge = "Our Team",
  heading = "The people behind AllOfTech",
  headingId,
  description = "Leadership you can meet, and a studio that ships the work together.",
  members = [],
  className,
}: TeamGridProps) {
  return (
    <div className={cn("aot-team-grid", className)}>
      <div className="aot-team-grid__intro mx-auto mb-8 flex max-w-2xl flex-col items-center text-center md:mb-10">
        {badge && (
          <div className="aot-team-grid__badge mb-4 inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-[0.08em] uppercase">
            {badge}
          </div>
        )}
        {heading && (
          <h2
            id={headingId}
            className="aot-team-grid__heading relative mb-5 text-3xl font-bold tracking-tight md:text-4xl"
          >
            {heading}
          </h2>
        )}
        {description && (
          <p className="aot-team-grid__description text-base leading-relaxed md:text-lg">
            {description}
          </p>
        )}
      </div>

      {members.length > 0 && (
        <div className="aot-team-grid__grid mx-auto grid max-w-[640px] grid-cols-1 gap-4 sm:grid-cols-2">
          {members.map((member) => (
            <TeamCard key={member.id} member={member} className="aspect-[3/4] max-h-[320px]" />
          ))}
        </div>
      )}
    </div>
  );
}
