"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Brain,
  Clapperboard,
  Globe,
  LayoutTemplate,
  Palette,
  Smartphone,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import { Card, CardContent } from "@/components/base-ui/card";
import ServiceLoopVideo from "@/components/services/ServiceLoopVideo";
import { servicesItem } from "@/components/services/motion";
import { cn } from "@/lib/utils";
import type { ServiceAccent, ServiceIconName } from "@/lib/services";

const ICONS: Record<ServiceIconName, LucideIcon> = {
  brain: Brain,
  globe: Globe,
  clapperboard: Clapperboard,
  palette: Palette,
  layout: LayoutTemplate,
  smartphone: Smartphone,
  sparkles: Sparkles,
};

export type ServiceMediaCardProps = {
  title: string;
  category: string;
  meta: string;
  imageSrc?: string;
  videoSrc?: string;
  imageAlt: string;
  href?: string;
  accent?: ServiceAccent;
  icon?: ServiceIconName;
  ctaLabel?: string;
  comingSoon?: boolean;
  comingSoonLabel?: string;
  className?: string;
  priority?: boolean;
  delayMs?: number;
};

export default function ServiceMediaCard({
  title,
  category,
  meta,
  imageSrc,
  videoSrc,
  imageAlt,
  href,
  accent = "cyan",
  icon = "sparkles",
  ctaLabel,
  comingSoon = false,
  comingSoonLabel = "Coming soon",
  className,
  priority = false,
  delayMs = 0,
}: ServiceMediaCardProps) {
  const reduce = useReducedMotion();
  const Icon = ICONS[icon];

  const card = (
    <Card
      className={cn(
        "aot-services-card group flex h-full flex-col overflow-hidden rounded-2xl pt-0 pb-4 gap-3 shadow-sm",
        className,
      )}
    >
      <div className="aot-services-card__frame relative overflow-hidden">
        <div
          className="aot-services-card__reveal"
          style={{ ["--aot-delay" as string]: `${delayMs}ms` }}
        >
          {videoSrc ? (
            <ServiceLoopVideo
              src={videoSrc}
              label={imageAlt}
              className="aot-services-card__img aot-services-card__video"
            />
          ) : imageSrc ? (
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              sizes="(max-width: 760px) 100vw, 50vw"
              className="aot-services-card__img size-full object-cover"
              priority={priority}
            />
          ) : (
            <div className="aot-services-card__stage" aria-hidden="true" />
          )}
        </div>

        {comingSoon ? (
          <div className="aot-services-card__soon">
            <span>{comingSoonLabel}</span>
          </div>
        ) : null}

        <div className="aot-services-card__orb" aria-hidden="true">
          <Icon className="size-5" strokeWidth={1.7} />
        </div>
      </div>

      <CardContent className="flex flex-1 flex-col">
        <div className="flex items-center justify-between gap-2">
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <span
              className={cn("aot-services-card__dot", `aot-services-card__dot--${accent}`)}
            />
            <span className="font-medium">{category}</span>
          </div>
          <span className="text-muted-foreground shrink-0 text-sm">{meta}</span>
        </div>

        <h3 className="text-foreground mt-2 mb-2 text-xl font-semibold tracking-tight">
          {title}
        </h3>

        {ctaLabel ? (
          <div className="mt-auto">
            <span className="aot-services-card__cta flex items-center gap-0.5">
              {ctaLabel}
              <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
            </span>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );

  const framed = (
    <motion.div
      className="h-full"
      variants={reduce ? undefined : servicesItem}
      initial={reduce ? false : "hidden"}
      whileInView={reduce ? undefined : "visible"}
      viewport={{ once: true, margin: "-80px" }}
    >
      {href ? (
        <Link
          href={href}
          className="aot-services-card-link"
          {...(href.startsWith("http://") || href.startsWith("https://")
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {card}
        </Link>
      ) : (
        card
      )}
    </motion.div>
  );

  return framed;
}
