import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve("public/images");
const TARGETS = ["Service", "Team"];
const RASTER = /\.(png|jpe?g)$/i;

function maxWidthFor(filePath, meta) {
  const name = path.basename(filePath).toLowerCase();
  const isBanner = /banner/.test(name);
  const longEdge = Math.max(meta.width ?? 0, meta.height ?? 0);
  if (isBanner) return Math.min(1920, longEdge || 1920);
  if (name.includes("combine")) return Math.min(1400, longEdge || 1400);
  return Math.min(1280, longEdge || 1280);
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else files.push(full);
  }
  return files;
}

async function convert(file) {
  if (!RASTER.test(file)) return;
  const webpPath = file.replace(RASTER, ".webp");
  const img = sharp(file).rotate();
  const meta = await img.metadata();
  const width = maxWidthFor(file, meta);
  const out = await img
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 82, alphaQuality: 86, effort: 6, smartSubsample: true })
    .toFile(webpPath);
  const src = await stat(file);
  const pct = Math.round((out.size / src.size) * 100);
  console.log(
    `${path.relative(ROOT, file)}  ${src.size} -> ${out.size} (${pct}%)  ${meta.width}x${meta.height} -> w<=${width}`,
  );
}

const files = (await Promise.all(TARGETS.map((folder) => walk(path.join(ROOT, folder))))).flat();
for (const file of files) await convert(file);
