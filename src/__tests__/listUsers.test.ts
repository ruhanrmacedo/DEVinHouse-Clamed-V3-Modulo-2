import { UserService } from "../services/UserService";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { UserProfileEnum } from "../entities/enums/UserProfileEnum";
import { Branch } from "../entities/Branch";
import { Driver } from "../entities/Driver";
import jwt from "jsonwebtoken";
import app from "../app";
import request from "supertest";

describe("UserService - Testes de Listagem", () => {
    let userService: UserService;

    beforeAll(async () => {
        await AppDataSource.initialize();
        userService = new UserService();
    });

    afterAll(async () => {
        await AppDataSource.destroy();
    });

    beforeEach(async () => {
        const driverRepository = AppDataSource.getRepository(Driver);
        const branchRepository = AppDataSource.getRepository(Branch);
        const userRepository = AppDataSource.getRepository(User);
    
        await driverRepository.delete({});
        await branchRepository.delete({});
        await userRepository.delete({});
    });

    it("Deve retornar a lista de usuários corretamente", async () => {
        const userRepository = AppDataSource.getRepository(User);
        await userRepository.save([
            { name: "Admin Teste", email: "admin@email.com", password_hash: "passwordHash", profile: UserProfileEnum.ADMIN, status: true },
            { name: "Driver Teste", email: "driver@email.com", password_hash: "passwordHash", profile: UserProfileEnum.DRIVER, status: true },
        ]);

        const users = await userService.listUsers();
        expect(users).toHaveLength(2);
        expect(users[0]).toHaveProperty("id");
        expect(users[0]).toHaveProperty("name");
        expect(users[0]).toHaveProperty("profile");
        expect(users[0]).toHaveProperty("status");
    });

    it("Deve filtrar os usuários pelo perfil", async () => {
        const userRepository = AppDataSource.getRepository(User);
        await userRepository.save([
            { name: "Admin Teste", email: "admin@email.com", password_hash: "passwordHash", profile: UserProfileEnum.ADMIN, status: true },
            { name: "Driver Teste", email: "driver@email.com", password_hash: "passwordHash", profile: UserProfileEnum.DRIVER, status: true },
        ]);

        const users = await userService.listUsers(UserProfileEnum.ADMIN);
        expect(users).toHaveLength(1);
        expect(users[0].profile).toBe(UserProfileEnum.ADMIN);
    });

    it("Deve retornar 403 se o usuário não for ADMIN", async () => {
        const userRepository = AppDataSource.getRepository(User);
        
        const user = await userRepository.save({
            name: "Driver Teste",
            email: "driver@email.com",
            password_hash: "password",
            profile: UserProfileEnum.DRIVER,
            status: true,
        });
        
        const token = jwt.sign(
            { userId: user.id, profile: user.profile },
            process.env.JWT_SECRET || "secret",
            { expiresIn: "1h" }
        );

        const response = await request(app)
            .get("/users")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(403);
        expect(response.body.message).toBe("Acesso negado. Apenas ADMIN pode acessar esse recurso");
    });

});
