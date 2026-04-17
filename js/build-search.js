const fs = require("fs");
const path = require("path");

const folders = ["languages", "writing"];
const ignoreFiles = new Set(["index.html", "families.html"]);

function cleanName(file) {
  return file
    .replace(".html", "")
    .replace("_languages", "")
    .replaceAll("_", " ")
    .toLowerCase();
}

function getHtmlFiles(dir, base = "") {
  let results = [];
  if (!fs.existsSync(dir)) return results;

  const files = fs.readdirSync(dir);
  for (let file of files) {
    const fullPath = path.join(dir, file);
    const relativePath = path.join(base, file);

    if (ignoreFiles.has(file)) continue;

    if (fs.statSync(fullPath).isDirectory()) {
      results = results.concat(getHtmlFiles(fullPath, relativePath));
    } else if (file.endsWith(".html")) {
      results.push({
        name: cleanName(file),
        file: "/" + relativePath.replaceAll("\\", "/")
      });
    }
  }
  return results;
}

let results = [];
folders.forEach(folder => {
  const dir = path.join(__dirname, "..", folder);
  results = results.concat(getHtmlFiles(dir, folder));
});

const outputPath = path.join(__dirname, "..", "search-index.json");
fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

console.log(`index built: ${results.length} files`);