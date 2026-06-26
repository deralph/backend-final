const swaggerJsDoc = require("swagger-jsdoc")


const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "IntelliMerch API",
            version: "1.0.0",
            description: "API documentation for IntelliMerch"
        },
        servers: [
            {
                url: "http://localhost:7000/api/v1"
            },
            {
                url: "http://localhost:7000/api/v1"
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