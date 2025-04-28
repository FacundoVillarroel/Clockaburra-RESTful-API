const path = require("path");
const fs = require("fs");
const SwaggerParser = require("@apidevtools/swagger-parser");

async function generateSwaggerJSON() {
  try {
    const inputPath = path.join(
      __dirname,
      "..",
      "public",
      "openapi",
      "openapi.yaml"
    );
    const outputPath = path.join(
      __dirname,
      "..",
      "public",
      "openapi",
      "swagger.json"
    );

    console.log("🔄 Cargando OpenAPI YAML desde:", inputPath);

    // Parsear y resolver todos los $ref
    const api = await SwaggerParser.dereference(inputPath);

    console.log("✅ Referencias resueltas correctamente");

    // Guardar el resultado como JSON bonito
    fs.writeFileSync(outputPath, JSON.stringify(api, null, 2));

    console.log("✅ swagger.json generado en:", outputPath);
  } catch (error) {
    console.error("❌ Error generando swagger.json:", error);
    process.exit(1);
  }
}

generateSwaggerJSON();
