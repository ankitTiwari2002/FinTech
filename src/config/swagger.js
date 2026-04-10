const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'FinTech Dashboard API',
            version: '1.0.0',
            description: 'API for Finance Dashboard System',
        },
        servers: [
            {
                url: 'https://fin-tech-rho.vercel.app',
                description: 'Live Vercel Server'
            },
            {
                url: 'http://localhost:3000',
                description: 'Local Development Server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        },
        security: [{
            bearerAuth: []
        }]
    },
    apis: ['./src/routes/*.js', './src/controllers/*.js'],
};

const specs = swaggerJsDoc(options);

const SWAGGER_ASSETS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5";
const CSS_URL = `${SWAGGER_ASSETS_URL}/swagger-ui.min.css`;
const JS_URLS = [
    `${SWAGGER_ASSETS_URL}/swagger-ui-bundle.js`,
    `${SWAGGER_ASSETS_URL}/swagger-ui-standalone-preset.js`
];

module.exports = { swaggerUi, specs, CSS_URL, JS_URLS };
