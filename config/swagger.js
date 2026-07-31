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


        tags: [
            {
                name: "Auth",
                description: "Authentication endpoints",
            },

            {
                name: "Admin",
                description: "Administrative endpoints",
            },

            {
                name: "Campaigns",
                description: "Campaign endpoints",
            },

            {
                name: "Products",
                description: "Product endpoints",
            },

            {
                name: "Perks",
                description: "Perks endpoints",
            },
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