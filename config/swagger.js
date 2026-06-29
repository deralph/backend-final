const swaggerJsDoc = require("swagger-jsdoc")


const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Intelimerch API",
            version: "1.0.0",
            description: "API documentation for IntelliMerch"
        },
        servers: [
            {
                url: "http://localhost:7000/api/v1"  //development
            },
            {
                url: "https://intelimerch-api-production.up.railway.app/api/v1"  //production 
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        }
    },

    apis: ["./modules/**/*.routes.js"]
};


module.exports = swaggerJsDoc(options)