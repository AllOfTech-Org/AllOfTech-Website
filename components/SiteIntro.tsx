import type { CSSProperties } from "react";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

const SPARKS = [
  ["12%", "22%"],
  ["84%", "18%"],
  ["18%", "68%"],
  ["78%", "72%"],
  ["8%", "48%"],
  ["92%", "44%"],
  ["36%", "14%"],
  ["62%", "84%"],
] as const;

export default function SiteIntro() {
  return (
    <div id="aotIntro" className="aot-intro" aria-hidden="true">
      <div className="aot-intro__veil" />
      <div className="aot-intro__grid" />
      <div className="aot-intro__glow" />
      <div className="aot-intro__scan" />
      <div className="aot-intro__cross">
        <span className="aot-intro__cross-x" />
        <span className="aot-intro__cross-y" />
      </div>
      <div className="aot-intro__sparks">
        {SPARKS.map(([left, top], index) => (
          <i
            key={`${left}-${top}`}
            style={{ left, top, animationDelay: `${180 + index * 110}ms` }}
          />
        ))}
      </div>
      <div className="aot-intro__frame">
        <span className="aot-intro__corner aot-intro__corner--tl" />
        <span className="aot-intro__corner aot-intro__corner--tr" />
        <span className="aot-intro__corner aot-intro__corner--bl" />
        <span className="aot-intro__corner aot-intro__corner--br" />
      </div>
      <div className="aot-intro__panel aot-intro__panel--top" />
      <div className="aot-intro__panel aot-intro__panel--bottom" />
      <div className="aot-intro__seam" />
      <div className="aot-intro__stage">
        <div className="aot-intro__mark">
          <span className="aot-intro__pulse aot-intro__pulse--a" />
          <span className="aot-intro__pulse aot-intro__pulse--b" />
          <div className="aot-intro__ticks">
            {Array.from({ length: 12 }, (_, index) => (
              <i
                key={index}
                style={{ "--i": index, animationDelay: `${320 + index * 38}ms` } as CSSProperties}
              />
            ))}
          </div>
          <div className="aot-intro__orbit">
            <i />
            <i />
            <i />
          </div>
          <svg className="aot-intro__ring aot-intro__ring--spin" viewBox="0 0 100 100">
            <circle className="aot-intro__ring-dash" cx="50" cy="50" r="46" />
          </svg>
          <svg className="aot-intro__ring" viewBox="0 0 100 100">
            <circle className="aot-intro__ring-track" cx="50" cy="50" r="42" />
            <circle className="aot-intro__ring-draw" cx="50" cy="50" r="42" />
          </svg>
          <div className="aot-intro__nucleus">
            <div className="aot-intro__nucleus-stage">
              <span className="aot-intro__nucleus-ring aot-intro__nucleus-ring--a" />
              <span className="aot-intro__nucleus-ring aot-intro__nucleus-ring--b" />
              <span className="aot-intro__nucleus-ring aot-intro__nucleus-ring--c" />
              <span className="aot-intro__nucleus-core" />
            </div>
          </div>
        </div>
        <p className="aot-intro__name">
          {Array.from(SITE_NAME).map((letter, index) => (
            <span
              key={`${letter}-${index}`}
              style={{
                animationDelay: `${460 + index * 70}ms`,
                color: letter === "A" ? "#335FC1" : letter === "T" ? "#743CC6" : "#ffffff",
              }}
            >
              {letter}
            </span>
          ))}
        </p>
        <span className="aot-intro__rule" />
        <p className="aot-intro__tag">{SITE_TAGLINE}</p>
      </div>
      <div className="aot-intro__progress">
        <i />
      </div>
    </div>
  );
}
