export const movementDocs = {
    "/movements": {
        get: {
            summary: "Retorna a lista de movimentações",
            tags: ["Movimentações"],
            security: [{ BearerAuth: [] }],
            responses: {
                200: {
                    description: "Lista de movimentações registradas",
                    content: {
                        "application/json": {
                            schema: {
                                type: "array",
                                items: { $ref: "#/components/schemas/MovementResponseDTO" }
                            }
                        }
                    }
                },
                401: { description: "Não autorizado - Token inválido ou ausente" }
            }
        },
        post: {
            summary: "Cria uma nova movimentação",
            tags: ["Movimentações"],
            security: [{ BearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/CreateMovementDTO" }
                    }
                }
            },
            responses: {
                201: { description: "Movimentação criada com sucesso" },
                400: { description: "Erro na validação dos dados" },
                401: { description: "Acesso negado. Apenas FILIAIS podem movimentar produtos." }
            }
        }
    },
    "/movements/{id}/start": {
        patch: {
            summary: "Inicia uma movimentação",
            tags: ["Movimentações"],
            security: [{ BearerAuth: [] }],
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: { type: "integer" }
                }
            ],
            responses: {
                200: {
                    description: "Movimentação iniciada com sucesso",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/MovementResponseDTO" }
                        }
                    }
                },
                401: { description: "Acesso negado" },
                404: { description: "Movimentação não encontrada" }
            }
        }
    },
    "/movements/{id}/end": {
        patch: {
            summary: "Finaliza uma movimentação",
            tags: ["Movimentações"],
            security: [{ BearerAuth: [] }],
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: { type: "integer" }
                }
            ],
            responses: {
                200: {
                    description: "Movimentação finalizada com sucesso",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/MovementResponseDTO" }
                        }
                    }
                },
                401: { description: "Acesso negado" },
                403: { description: "Apenas o motorista responsável pode finalizar a movimentação" },
                404: { description: "Movimentação não encontrada" }
            }
        }
    }
};
