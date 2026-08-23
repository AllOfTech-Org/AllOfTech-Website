"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import ServiceLoopVideo from "@/components/services/ServiceLoopVideo";
import { servicesItem } from "@/components/services/motion";
import { IMAGE_SIZES } from "@/lib/image";
import { cn } from "@/lib/utils";

type ServiceStillRowProps = {
  title: string;
  lead?: string;
  meaning: string;
  imageSrc?: string;
  videoSrc?: string;
  imageAlt: string;
  flip?: boolean;
  delayMs?: number;
};

export default function ServiceStillRow({
  title,
  lead,
  meaning,
  imageSrc,
  videoSrc,
  imageAlt,
  flip = false,
  delayMs = 0,
}: ServiceStillRowProps) {
  const reduce = useReducedMotion();
  const hasMedia = Boolean(videoSrc || imageSrc);

  return (
    <motion.article
      className={cn("aot-services-still", flip && "aot-services-still--flip")}
      variants={reduce ? undefined : servicesItem}
      initial={reduce ? false : "hidden"}
      whileInView={reduce ? undefined : "visible"}
      viewport={{ once: true, margin: "-80px" }}
    >
      <div className="aot-services-still__media">
        <div
          className={cn(
            "aot-services-still__frame",
            !hasMedia && "aot-services-still__frame--empty",
          )}
        >
          <div
            className="aot-services-still__reveal"
            style={{ ["--aot-delay" as string]: `${delayMs}ms` }}
          >
            {videoSrc ? (
              <ServiceLoopVideo src={videoSrc} label={imageAlt} />
            ) : imageSrc ? (
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                sizes={IMAGE_SIZES.serviceStill}
                className="aot-services-still__img"
              />
            ) : (
              <div className="aot-services-still__empty" aria-hidden="true" />
            )}
          </div>
        </div>
      </div>
      <div className="aot-services-still__copy">
        <h3>{title}</h3>
        {lead ? <p className="aot-services-still__lead">{lead}</p> : null}
        <p>{meaning}</p>
      </div>
    </motion.article>
  );
}
