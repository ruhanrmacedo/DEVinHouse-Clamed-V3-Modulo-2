import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import { userDocs } from "../docs/user.docs";
import { productDocs } from "../docs/product.docs";
import { authDocs } from "../docs/auth.docs";
import { movementDocs } from "../docs/movement.docs";

const options: swaggerJsDoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Guarda Chuva",
            version: "1.0.0",
            description: "API RESTful para gerenciamento de usuários, produtos e movimentações entre filiais da rede Guarda-Chuva Farmácias.",
        },
        servers: [{ url: "http://localhost:3000" }],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                }
            }
        },
        security: [{ BearerAuth: [] }],
        paths: {
            ...userDocs,
            ...productDocs,
            ...movementDocs,
            ...authDocs
        }
    },
    apis: ["./src/dto/*.ts"],
};

const swaggerSpec = swaggerJsDoc(options);

export function setupSwagger(app: Express) {
    app.use("/api-swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
