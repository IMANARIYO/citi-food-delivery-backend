import ${modelName}, { modelName } from "../models/${modelName}.js";
import express from "express";
import express from "express";
import { createModelHandler, deleteModelHandler, readModelHandler, updateModelHandler } from "../controllers/crud.js";

const fs = require('fs');
const path = require('path');

const models = [
  'User',
  'foodItem',
  'Category',
  'Subscription',
  'Order',
  'Review',
  'Payment',
  'Favorite',
  'Cart',
  'Notification'
];

const template = (modelName) => `

const ${modelName.toLowerCase()}Router = express.Router();

${modelName.toLowerCase()}Router.post('/', createModelHandler(${modelName}));
${modelName.toLowerCase()}Router.get('/', readModelHandler(${modelName}));
${modelName.toLowerCase()}Router.put('/:id', updateModelHandler(${modelName}));
${modelName.toLowerCase()}Router.delete('/:id', deleteModelHandler(${modelName}));

export default ${modelName.toLowerCase()}Router;
`.trim();

const endpointsDirectory = path.join(__dirname, 'src', 'endpoints');

if (!fs.existsSync(endpointsDirectory)) {
  fs.mkdirSync(endpointsDirectory, { recursive: true });
}

models.forEach(modelName => {
  const endpointContent = template(modelName);
  const endpointPath = path.join(endpointsDirectory, `${modelName.toLowerCase()}Endpoints.js`);
  fs.writeFileSync(endpointPath, endpointContent);
  console.log(`Endpoint ${modelName} created at ${endpointPath}`);
});

const indexContent = `
${models.map(modelName => `import ${modelName.toLowerCase()}Router from './${modelName.toLowerCase()}Endpoints.js';`).join('\n')}

const mainRouter = express.Router();

${models.map(modelName => `mainRouter.use('/${modelName.toLowerCase()}', ${modelName.toLowerCase()}Router);`).join('\n')}

export default mainRouter;
`.trim();

const indexPath = path.join(endpointsDirectory, 'index.js');
fs.writeFileSync(indexPath, indexContent);
console.log(`Main router created at ${indexPath}`);
