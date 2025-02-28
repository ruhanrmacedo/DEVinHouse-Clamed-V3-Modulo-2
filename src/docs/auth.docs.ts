export const authDocs = {
    "/login": {
        post: {
            summary: "Realiza login e retorna um token JWT",
            tags: ["Autenticação"],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                email: { type: "string", example: "user@email.com" },
                                password: { type: "string", example: "123456" }
                            },
                            required: ["email", "password"]
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: "Login bem-sucedido. Retorna o token JWT e informações do usuário.",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
                                    user: {
                                        type: "object",
                                        properties: {
                                            id: { type: "number", example: 1 },
                                            name: { type: "string", example: "Usuário Teste" },
                                            profile: { type: "string", example: "ADMIN" }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                400: {
                    description: "Erro de validação. E-mail e senha são obrigatórios.",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: { type: "string", example: "E-mail e senha são obrigatórios" }
                                }
                            }
                        }
                    }
                },
                401: {
                    description: "Credenciais inválidas. E-mail ou senha incorretos.",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: { type: "string", example: "E-mail ou senha inválidos" }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};
