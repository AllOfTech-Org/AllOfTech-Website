"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

interface ExpandableCardProps {
  id: string;
  imageSrc: string;
  title: string;
  subtitle: string;
  content: ReactNode;
  imageClassName?: string;
  imageWidth?: number;
  imageHeight?: number;
  className?: string;
}

export default function ExpandableProfileCard({
  id,
  imageSrc,
  title,
  subtitle,
  content,
  imageClassName,
  imageWidth,
  imageHeight,
  className,
}: ExpandableCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const layoutId = `expandable-profile-card-${id}`;
  const titleId = `expandable-profile-title-${id}`;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const overlay = isOpen ? (
      <div key={layoutId} className="aot-epc-overlay">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="aot-epc-backdrop"
        />
        <motion.div
          layoutId={layoutId}
          className="aot-epc-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="aot-epc-close"
            aria-label="Close profile"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>

          <div className="aot-epc-photo">
            <motion.img
              layoutId={`image-${layoutId}`}
              src={imageSrc}
              alt={title}
              width={imageWidth}
              height={imageHeight}
              className={cn("h-full w-full object-cover", imageClassName)}
              decoding="async"
            />
            <div className="aot-epc-photo-wash" />
          </div>

          <div className="aot-epc-copy">
            <motion.p
              layoutId={`subtitle-${layoutId}`}
              className="aot-epc-subtitle"
            >
              {subtitle}
            </motion.p>
            <motion.h3
              layoutId={`title-${layoutId}`}
              id={titleId}
              className="aot-epc-title"
            >
              {title}
            </motion.h3>
            <div className="aot-epc-body">{content}</div>
          </div>
        </motion.div>
      </div>
    ) : null;

  return (
    <>
      <motion.div
        layoutId={layoutId}
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        aria-label={`${title} — view profile`}
        onClick={() => setIsOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setIsOpen(true);
          }
        }}
        className={cn(
          "aot-team-grid__card aot-epc group relative h-full min-h-0 overflow-hidden rounded-[1.15rem] border-[2px] focus-within:ring-2 focus-within:ring-offset-2",
          className,
        )}
      >
        <motion.img
          layoutId={`image-${layoutId}`}
          src={imageSrc}
          alt={title}
          width={imageWidth}
          height={imageHeight}
          className={cn(
            "absolute inset-0 h-full w-full object-cover",
            imageClassName,
          )}
          loading="lazy"
          decoding="async"
          draggable={false}
        />
        <div className="aot-team-grid__wash absolute inset-0 opacity-80" />
        <div className="aot-team-grid__meta absolute inset-0 z-[2] flex flex-col justify-end p-3 md:p-3.5">
          <motion.h3
            layoutId={`title-${layoutId}`}
            className="aot-team-grid__name text-lg font-semibold tracking-tight text-white md:text-xl"
          >
            {title}
          </motion.h3>
          <motion.p
            layoutId={`subtitle-${layoutId}`}
            className="aot-team-grid__role text-[0.65rem] font-medium tracking-[0.08em] uppercase"
          >
            {subtitle}
          </motion.p>
        </div>
      </motion.div>

      {mounted
        ? createPortal(
            <AnimatePresence>{overlay}</AnimatePresence>,
            document.body,
          )
        : null}
    </>
  );
}
