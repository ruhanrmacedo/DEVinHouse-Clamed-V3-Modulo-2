import { UserService } from "../services/UserService";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { UserProfileEnum } from "../entities/enums/UserProfileEnum";
import request from "supertest";
import app from "../app";
import jwt from "jsonwebtoken";

describe("PATCH /users/:id/status - Testes de Unidade e Integração", () => {
    let userService: UserService;

    beforeAll(async () => {
        await AppDataSource.initialize();
        userService = new UserService();
    });

    afterAll(async () => {
        await AppDataSource.destroy();
    });

    beforeEach(async () => {
        const userRepository = AppDataSource.getRepository(User);
        await userRepository.delete({});
    });

    it("Deve permitir ADMIN atualizar o status de um usuário", async () => {
        const userRepository = AppDataSource.getRepository(User);

        const user = await userRepository.save({
            name: "Usuário Teste",
            email: "usuario@email.com",
            password_hash: "password",
            profile: UserProfileEnum.DRIVER,
            status: true,
        });

        const adminUser = await userRepository.save({
            name: "Admin",
            email: "admin@email.com",
            password_hash: "password",
            profile: UserProfileEnum.ADMIN,
            status: true,
        });

        const response = await userService.updateUserStatus(user.id, false, {
            id: adminUser.id,
            profile: adminUser.profile,
        });

        expect(response).toEqual({ message: "Status atualizado com sucesso." });

        const updatedUser = await userRepository.findOne({ where: { id: user.id } });
        expect(updatedUser?.status).toBe(false);
    });

    it("Deve retornar erro 401 se um usuário sem permissão tentar atualizar o status", async () => {
        const userRepository = AppDataSource.getRepository(User);

        const user = await userRepository.save({
            name: "Usuário Teste",
            email: "usuario@email.com",
            password_hash: "password",
            profile: UserProfileEnum.DRIVER,
            status: true,
        });

        const unauthorizedUser = await userRepository.save({
            name: "Outro Usuário",
            email: "outro@email.com",
            password_hash: "password",
            profile: UserProfileEnum.DRIVER,
            status: true,
        });

        await expect(
            userService.updateUserStatus(user.id, false, {
                id: unauthorizedUser.id,
                profile: unauthorizedUser.profile,
            })
        ).rejects.toThrow("Acesso negado.");
    });

});
