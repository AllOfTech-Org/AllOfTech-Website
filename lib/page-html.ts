function stripById(html: string, id: string) {
  const start = html.search(new RegExp(`<div\\b[^>]*\\bid=["']${id}["']`, "i"));
  if (start < 0) return html;
  let index = html.indexOf(">", start) + 1;
  let depth = 1;
  while (index < html.length && depth > 0) {
    const nextOpen = html.indexOf("<div", index);
    const nextClose = html.indexOf("</div>", index);
    if (nextClose < 0) return html.slice(0, start);
    if (nextOpen >= 0 && nextOpen < nextClose) {
      depth += 1;
      index = nextOpen + 4;
    } else {
      depth -= 1;
      index = nextClose + 6;
    }
  }
  return `${html.slice(0, start)}${html.slice(index)}`;
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
  return stripByTag(
    stripById(
      html.replace(/<noscript[\s\S]*?<\/noscript>/gi, "").replace(/<script[\s\S]*?<\/script>/gi, ""),
      "sitePreloader",
    ),
    "footer",
  );
}
