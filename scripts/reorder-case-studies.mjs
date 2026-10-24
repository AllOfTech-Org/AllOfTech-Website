import fs from "node:fs";

const path = "app/case-studies/markup.html";
let html = fs.readFileSync(path, "utf8");

function takeSection(source, commentNeedle) {
  const commentAt = source.indexOf(commentNeedle);
  if (commentAt < 0) throw new Error(`Missing comment: ${commentNeedle}`);
  const sectionAt = source.indexOf("<section", commentAt);
  const end = source.indexOf("</section>", sectionAt);
  if (sectionAt < 0 || end < 0) throw new Error(`Missing section for ${commentNeedle}`);
  const sliceEnd = end + "</section>".length;
  const block = source.slice(commentAt, sliceEnd);
  const next = source.slice(0, commentAt) + source.slice(sliceEnd);
  return { block, next };
}

const animationComment = "        <!-- Case Study 5: AllOfTech animation reel -->";
const taken = takeSection(html, animationComment);
html = taken.next;

const insertAfter = html.indexOf(
  "        <!-- Case Study 2: Your Brand — Built for Growth Business Website -->",
);
if (insertAfter < 0) throw new Error("Insert point not found");

html = html.slice(0, insertAfter) + taken.block.trimEnd() + "\n\n" + html.slice(insertAfter);

html = html
  .replace(
    '                    <a href="#case-study-2" class="cs-index-card">\n                        <span class="cs-index-num">02</span>\n                        <span class="cs-index-body">\n                            <span class="cs-index-name">Your Brand</span>\n                            <span class="cs-index-tag">Growth website</span>',
    '                    <a href="#case-study-2" class="cs-index-card">\n                        <span class="cs-index-num">02</span>\n                        <span class="cs-index-body">\n                            <span class="cs-index-name">Animation</span>\n                            <span class="cs-index-tag">3D motion reel</span>',
  )
  .replace(
    '                    <a href="#case-study-3" class="cs-index-card">\n                        <span class="cs-index-num">03</span>\n                        <span class="cs-index-body">\n                            <span class="cs-index-name">Mashover</span>\n                            <span class="cs-index-tag">AI customer service</span>',
    '                    <a href="#case-study-3" class="cs-index-card">\n                        <span class="cs-index-num">03</span>\n                        <span class="cs-index-body">\n                            <span class="cs-index-name">Your Brand</span>\n                            <span class="cs-index-tag">Growth website</span>',
  )
  .replace(
    '                    <a href="#case-study-4" class="cs-index-card">\n                        <span class="cs-index-num">04</span>\n                        <span class="cs-index-body">\n                            <span class="cs-index-name">Brand identity</span>\n                            <span class="cs-index-tag">Graphic design</span>',
    '                    <a href="#case-study-4" class="cs-index-card">\n                        <span class="cs-index-num">04</span>\n                        <span class="cs-index-body">\n                            <span class="cs-index-name">Mashover</span>\n                            <span class="cs-index-tag">AI customer service</span>',
  )
  .replace(
    '                    <a href="#case-study-5" class="cs-index-card">\n                        <span class="cs-index-num">05</span>\n                        <span class="cs-index-body">\n                            <span class="cs-index-name">Animation</span>\n                            <span class="cs-index-tag">3D motion reel</span>',
    '                    <a href="#case-study-5" class="cs-index-card">\n                        <span class="cs-index-num">05</span>\n                        <span class="cs-index-body">\n                            <span class="cs-index-name">Brand identity</span>\n                            <span class="cs-index-tag">Graphic design</span>',
  )
  .replace("<!-- Case Study 5: AllOfTech animation reel -->", "<!-- Case Study 2: AllOfTech animation reel -->")
  .replace(
    "<!-- Case Study 2: Your Brand — Built for Growth Business Website -->",
    "<!-- Case Study 3: Your Brand — Built for Growth Business Website -->",
  )
  .replace("<!-- Case Study 3: Mashover AI customer service -->", "<!-- Case Study 4: Mashover AI customer service -->")
  .replace("<!-- Case Study 4: Graphic Design & Branding -->", "<!-- Case Study 5: Graphic Design & Branding -->")
  .replace('id="case-study-2"', 'id="case-study-tmp-brand"')
  .replace('id="case-study-3"', 'id="case-study-tmp-mash"')
  .replace('id="case-study-4"', 'id="case-study-tmp-ident"')
  .replace('id="case-study-5"', 'id="case-study-2"')
  .replace('id="case-study-tmp-brand"', 'id="case-study-3"')
  .replace('id="case-study-tmp-mash"', 'id="case-study-4"')
  .replace('id="case-study-tmp-ident"', 'id="case-study-5"');

fs.writeFileSync(path, html);
console.log("reordered case studies");
