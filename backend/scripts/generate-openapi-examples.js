/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");

const file = path.join(process.cwd(), "openapi", "openapi.json");

if (!fs.existsSync(file)) {
  console.error("❌ openapi.json no encontrado");
  process.exit(1);
}

const spec = JSON.parse(fs.readFileSync(file, "utf8"));

function smartExample(key, schema) {
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

  if (schema.format === "email") return "usuario@email.com";
  if (schema.format === "date-time") return "2025-01-01T10:00:00Z";
  if (schema.format === "date") return "2025-01-01";

  if (schema.type === "integer") return 1;
  if (schema.type === "number") return 10.5;
  if (schema.type === "boolean") return true;

  if (schema.enum) return schema.enum[0];

  if (schema.type === "array") return [];

  return "string";
}

function generateExample(schema) {
  if (!schema.properties) return {};

  const example = {};

  for (const [key, value] of Object.entries(schema.properties)) {
    example[key] = smartExample(key, value);
  }

  return example;
}

let schemasUpdated = 0;
let responsesUpdated = 0;

if (spec.components?.schemas) {
  for (const [name, schema] of Object.entries(spec.components.schemas)) {
    if (schema.type === "object" && !schema.example) {
      schema.example = generateExample(schema);
      schemasUpdated++;
    }
  }
}

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
          responsesUpdated++;
        }
      }
    }
  }
}

fs.writeFileSync(file, JSON.stringify(spec, null, 2));

console.log(`✅ schemas con examples: ${schemasUpdated}`);
console.log(`✅ responses con examples: ${responsesUpdated}`);