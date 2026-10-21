import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { AREA_NAMES, CATEGORY_NAMES } from '../utils/validationData.js';

// The OpenAPI document lives in the root of the project so that it can be
// linted, reviewed and consumed by other tools without starting the server.
const specPath = fileURLToPath(new URL('../../swagger.json', import.meta.url));
const baseSpec = JSON.parse(readFileSync(specPath, 'utf8'));

// The `category` and `area` enums are not hardcoded in the application: they
// are read from the database when the server starts. Every schema that carries
// the `x-dynamic-enum` marker is refreshed with the live values before the
// document is served.
const dynamicEnums = {
  CATEGORY_NAMES: () => CATEGORY_NAMES,
  AREA_NAMES: () => AREA_NAMES,
};

const applyDynamicEnums = (node) => {
  if (Array.isArray(node)) {
    node.forEach(applyDynamicEnums);
    return;
  }

  if (!node || typeof node !== 'object') {
    return;
  }

  const source = node['x-dynamic-enum'];

  if (source && dynamicEnums[source]) {
    const values = dynamicEnums[source]();

    if (values.length > 0) {
      node.enum = [...values];
    }
  }

  Object.values(node).forEach(applyDynamicEnums);
};

export const buildSpec = () => {
  const spec = structuredClone(baseSpec);

  applyDynamicEnums(spec);

  return spec;
};

const router = Router();

const swaggerUiOptions = {
  customSiteTitle: 'Yumio API',
  swaggerOptions: {
    displayRequestDuration: true,
    docExpansion: 'list',
    filter: true,
    persistAuthorization: true,
    tryItOutEnabled: true,
    defaultModelsExpandDepth: 1,
    defaultModelExpandDepth: 3,
  },
};

// Swagger UI points to its assets with relative URLs, so they are resolved
// against the URL of the page. Rewriting them to absolute paths keeps the
// documentation working on `/api-docs` and on `/api-docs/` alike.
const withAbsoluteAssetPaths = (html) =>
  html
    .replaceAll('"./swagger-ui', '"/api-docs/swagger-ui')
    .replaceAll('"./favicon-', '"/api-docs/favicon-');

// Initialise the assets handler, so that `/api-docs/swagger-ui-init.js` is
// available even before the documentation page has been opened once.
swaggerUi.generateHTML(baseSpec, swaggerUiOptions);

// The raw OpenAPI document.
router.get('/api-docs.json', (req, res) => {
  res.status(200).json(buildSpec());
});

// The interactive documentation.
router.get('/api-docs', (req, res) => {
  const html = swaggerUi.generateHTML(buildSpec(), swaggerUiOptions);

  res.type('html').send(withAbsoluteAssetPaths(html));
});

// The assets of Swagger UI (stylesheets, scripts, favicon).
router.use('/api-docs', swaggerUi.serve);

export default router;
