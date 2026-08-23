"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

type ServiceLoopVideoProps = {
  src: string;
  label: string;
  className?: string;
};

export default function ServiceLoopVideo({ src, label, className }: ServiceLoopVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let visible = false;
    let pageVisible = !document.hidden;

    const play = () => {
      el.defaultMuted = true;
      el.muted = true;
      el.playsInline = true;
      const attempt = el.play();
      if (attempt) void attempt.catch(() => undefined);
    };

    const sync = () => {
      if (visible && pageVisible) play();
      else el.pause();
    };

    const io =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(
            (entries) => {
              visible = entries.some((entry) => entry.isIntersecting);
              sync();
            },
            { rootMargin: "80px 0px", threshold: 0.01 },
          );

    if (io) io.observe(el);
    else {
      visible = true;
      sync();
    }

    const onVis = () => {
      pageVisible = !document.hidden;
      sync();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      io?.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      el.pause();
    };
  }, [src]);

  return (
    <video
      ref={ref}
      className={cn("aot-services-still__video", className)}
      src={src}
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      disablePictureInPicture
      disableRemotePlayback
      controls={false}
      controlsList="nodownload nofullscreen noremoteplayback"
      aria-label={label}
      title={label}
      tabIndex={-1}
    />
  );
}
