/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");

const file = path.join(process.cwd(), "openapi", "openapi.json");

if (!fs.existsSync(file)) {
  console.error("❌ openapi.json no encontrado");
  process.exit(1);
}

const spec = JSON.parse(fs.readFileSync(file, "utf8"));

function sortObject(obj) {
  return Object.keys(obj)
    .sort()
    .reduce((acc, key) => {
      acc[key] = obj[key];
      return acc;
    }, {});
}

if (spec.paths) {
  const sortedPaths = sortObject(spec.paths);

  for (const pathKey of Object.keys(sortedPaths)) {
    sortedPaths[pathKey] = sortObject(sortedPaths[pathKey]);
  }

  spec.paths = sortedPaths;
}

if (spec.components?.schemas) {
  spec.components.schemas = sortObject(spec.components.schemas);
}

if (spec.components?.responses) {
  spec.components.responses = sortObject(spec.components.responses);
}

if (spec.components?.parameters) {
  spec.components.parameters = sortObject(spec.components.parameters);
}

fs.writeFileSync(file, JSON.stringify(spec, null, 2));

console.log("✅ OpenAPI ordenado automáticamente");