export const productDocs = {
    "/products": {
        get: {
            summary: "Retorna a lista de produtos",
            tags: ["Produtos"],
            security: [{ BearerAuth: [] }],
            responses: {
                200: {
                    description: "Lista de produtos disponíveis",
                    content: {
                        "application/json": {
                            schema: {
                                type: "array",
                                items: { $ref: "#/components/schemas/ProductResponseDTO" }
                            }
                        }
                    }
                },
                401: { description: "Não autorizado - Token inválido ou ausente" }
            }
        },
        post: {
            summary: "Cria um novo produto",
            tags: ["Produtos"],
            security: [{ BearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/CreateProductDTO" }
                    }
                }
            },
            responses: {
                201: { description: "Produto criado com sucesso" },
                400: { description: "Erro na validação dos dados" },
                401: { description: "Acesso negado. Apenas FILIAIS podem cadastrar produtos." }
            }
        }
    }
};
