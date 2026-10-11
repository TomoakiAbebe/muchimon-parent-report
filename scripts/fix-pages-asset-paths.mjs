import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const outputDirectory = path.resolve("dist/client");
const textExtensions = new Set([".css", ".html", ".js"]);

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(entryPath)));
    } else if (textExtensions.has(path.extname(entry.name))) {
      files.push(entryPath);
    }
  }

  return files;
}

for (const filePath of await collectFiles(outputDirectory)) {
  const source = await readFile(filePath, "utf8");
  const updated = source
    .replaceAll('"/assets/', '"/muchimon-parent-report/assets/')
    .replaceAll("'/assets/", "'/muchimon-parent-report/assets/")
    .replaceAll("`/assets/", "`/muchimon-parent-report/assets/");

  if (updated !== source) {
    await writeFile(filePath, updated);
  }
}
