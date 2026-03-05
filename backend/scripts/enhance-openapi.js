/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");

const file = path.join(process.cwd(), "openapi", "openapi.json");

if (!fs.existsSync(file)) {
  console.error("❌ openapi.json no encontrado");
  process.exit(1);
}

const spec = JSON.parse(fs.readFileSync(file, "utf8"));

function smartExample(key) {
  const name = key.toLowerCase();

  if (name.includes("email")) return "usuario@email.com";
  if (name.includes("password")) return "Password123!";
  if (name.includes("phone")) return "+5491123456789";
  if (name.includes("name")) return "Juan Perez";
  if (name.includes("role")) return "caregiver";
  if (name.includes("status")) return "active";
  if (name.includes("address")) return "Av. Siempre Viva 742";
  if (name.includes("dni")) return "12345678";
  if (name.includes("alias")) return "alias.mp";
  if (name.includes("cbu")) return "0000003100000000000001";
  if (name.includes("amount")) return 15000;
  if (name.includes("hours")) return 8;
  if (name.includes("rate")) return 2000;

  return "string";
}

function generateExample(schema) {
  if (!schema.properties) return {};

  const example = {};

  for (const key of Object.keys(schema.properties)) {
    example[key] = smartExample(key);
  }

  return example;
}

function sortObject(obj) {
  return Object.keys(obj)
    .sort()
    .reduce((acc, key) => {
      acc[key] = obj[key];
      return acc;
    }, {});
}

let schemasAdded = 0;
let examplesAdded = 0;
let responsesAdded = 0;

/* ---------- GENERAR SCHEMAS FALTANTES ---------- */

if (spec.paths) {
  for (const pathKey of Object.keys(spec.paths)) {
    const pathItem = spec.paths[pathKey];

    for (const method of Object.keys(pathItem)) {
      const operation = pathItem[method];

      const body = operation.requestBody?.content?.["application/json"];

      if (!body?.schema) continue;

      const schema = body.schema;

      if (schema.type === "object" && !schema.properties) {
        schema.properties = {
          email: { type: "string" },
          password: { type: "string" },
        };

        schemasAdded++;
      }
    }
  }
}

/* ---------- GENERAR EXAMPLES EN SCHEMAS ---------- */

if (spec.components?.schemas) {
  for (const schema of Object.values(spec.components.schemas)) {
    if (schema.type === "object" && !schema.example) {
      schema.example = generateExample(schema);
      examplesAdded++;
    }
  }
}

/* ---------- GENERAR EXAMPLES EN RESPONSES ---------- */

if (spec.paths) {
  for (const pathKey of Object.keys(spec.paths)) {
    const pathItem = spec.paths[pathKey];

    for (const method of Object.keys(pathItem)) {
      const operation = pathItem[method];

      if (!operation.responses) continue;

      for (const code of Object.keys(operation.responses)) {
        const response = operation.responses[code];

        const content = response?.content?.["application/json"];

        if (!content?.schema) continue;

        const schemaRef = content.schema.$ref;

        if (!schemaRef) continue;

        const schemaName = schemaRef.split("/").pop();

        const schema = spec.components.schemas[schemaName];

        if (schema?.example && !content.example) {
          content.example = schema.example;
          responsesAdded++;
        }
      }
    }
  }
}

/* ---------- ORDENAR OPENAPI ---------- */

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

/* ---------- GUARDAR ---------- */

fs.writeFileSync(file, JSON.stringify(spec, null, 2));

console.log(`✅ schemas generados: ${schemasAdded}`);
console.log(`✅ examples agregados: ${examplesAdded}`);
console.log(`✅ response examples agregados: ${responsesAdded}`);
console.log("✅ OpenAPI mejorado automáticamente");