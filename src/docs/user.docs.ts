export const userDocs = {
    "/users": {
        get: {
            summary: "Retorna a lista de usuários",
            tags: ["Usuários"],
            security: [{ BearerAuth: [] }],
            responses: {
                200: {
                    description: "Lista de usuários cadastrados",
                    content: {
                        "application/json": {
                            schema: {
                                type: "array",
                                items: { $ref: "#/components/schemas/UserResponseDTO" }
                            }
                        }
                    }
                },
                401: { description: "Não autorizado - Token inválido ou ausente" }
            }
        },
        post: {
            summary: "Cria um novo usuário",
            tags: ["Usuários"],
            security: [{ BearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/CreateUserDTO" }
                    }
                }
            },
            responses: {
                201: { description: "Usuário criado com sucesso" },
                400: { description: "Erro na validação dos dados" },
                409: { description: "E-mail já cadastrado" }
            }
        }
    },
    "/users/{id}": {
        get: {
            summary: "Obtém detalhes de um usuário por ID",
            tags: ["Usuários"],
            security: [{ BearerAuth: [] }],
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: { type: "number" }
                }
            ],
            responses: {
                200: {
                    description: "Detalhes do usuário",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/UserResponseDTO" }
                        }
                    }
                },
                400: { description: "ID inválido" },
                404: { description: "Usuário não encontrado" }
            }
        },
        put: {
            summary: "Atualiza um usuário por ID",
            tags: ["Usuários"],
            security: [{ BearerAuth: [] }],
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: { type: "number" }
                }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/UpdateUserDTO" }
                    }
                }
            },
            responses: {
                200: { description: "Usuário atualizado com sucesso" },
                400: { description: "Erro na validação dos dados" },
                401: { description: "Acesso negado" },
                404: { description: "Usuário não encontrado" }
            }
        }
    },
    "/users/{id}/status": {
        patch: {
            summary: "Atualiza o status de um usuário",
            tags: ["Usuários"],
            security: [{ BearerAuth: [] }],
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: { type: "number" }
                }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/UpdateUserStatusDTO" }
                    }
                }
            },
            responses: {
                200: { description: "Status atualizado com sucesso" },
                400: { description: "ID inválido ou status incorreto" },
                401: { description: "Acesso negado" },
                404: { description: "Usuário não encontrado" }
            }
        }
    }
};
