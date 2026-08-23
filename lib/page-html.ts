function stripNested(html: string, tag: string, start: number) {
  const openNeedle = `<${tag}`;
  const closeNeedle = `</${tag}>`;
  let index = html.indexOf(">", start) + 1;
  if (index <= 0) return html;
  let depth = 1;
  const lower = html.toLowerCase();
  const openSearch = openNeedle.toLowerCase();
  const closeSearch = closeNeedle.toLowerCase();
  while (index < html.length && depth > 0) {
    const nextOpen = lower.indexOf(openSearch, index);
    const nextClose = lower.indexOf(closeSearch, index);
    if (nextClose < 0) return html.slice(0, start);
    if (nextOpen >= 0 && nextOpen < nextClose) {
      depth += 1;
      index = nextOpen + openNeedle.length;
    } else {
      depth -= 1;
      index = nextClose + closeNeedle.length;
    }
  }
  return `${html.slice(0, start)}${html.slice(index)}`;
}

function stripById(html: string, id: string) {
  const start = html.search(new RegExp(`<div\\b[^>]*\\bid=["']${id}["']`, "i"));
  if (start < 0) return html;
  return stripNested(html, "div", start);
}

function stripByClass(html: string, className: string) {
  const start = html.search(
    new RegExp(
      `<(div|nav)\\b[^>]*\\bclass=["'](?:[^"']*\\s)?${className}(?:\\s|["'])`,
      "i",
    ),
  );
  if (start < 0) return html;
  const tag = /^<nav\b/i.test(html.slice(start, start + 5)) ? "nav" : "div";
  return stripNested(html, tag, start);
}

function stripByTag(html: string, tag: string) {
  const openPattern = new RegExp(`<${tag}\\b[^>]*>`, "i");
  const closeTag = `</${tag}>`;
  let result = html;
  let match = openPattern.exec(result);
  while (match) {
    const start = match.index;
    const closeIndex = result.toLowerCase().indexOf(closeTag.toLowerCase(), start + match[0].length);
    if (closeIndex < 0) return result.slice(0, start);
    result = `${result.slice(0, start)}${result.slice(closeIndex + closeTag.length)}`;
    openPattern.lastIndex = 0;
    match = openPattern.exec(result);
  }
  return result;
}

export function preparePageHtml(html: string) {
  const withoutChrome = stripByTag(
    stripByClass(
      stripByClass(
        stripById(
          html.replace(/<noscript[\s\S]*?<\/noscript>/gi, "").replace(/<script[\s\S]*?<\/script>/gi, ""),
          "sitePreloader",
        ),
        "mobile-menu",
      ),
      "mobile-menu-overlay",
    ),
    "nav",
  );
  return stripByTag(withoutChrome, "footer");
}
