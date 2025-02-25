import { UserService } from "../services/UserService";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { UserProfileEnum } from "../entities/enums/UserProfileEnum";
import jwt from "jsonwebtoken";
import request from "supertest";
import app from "../app";
import { Driver } from "../entities/Driver";
import { Branch } from "../entities/Branch";

describe("GET /users/:id - Testes de Integração", () => {
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

    it("Deve retornar os dados do usuário corretamente (ADMIN acessando outro usuário)", async () => {
        const userRepository = AppDataSource.getRepository(User);
        const driverRepository = AppDataSource.getRepository(Driver);

        const savedUser = await userRepository.save({
            name: "Driver Teste",
            email: "driver@email.com",
            password_hash: "password",
            profile: UserProfileEnum.DRIVER,
            status: true,
        });

        await driverRepository.save({
            user: savedUser,
            document: "12345678900",
            full_address: "Rua Driver, 123",
        });

        const adminUser = await userRepository.save({
            name: "Admin Teste",
            email: "admin@email.com",
            password_hash: "password",
            profile: UserProfileEnum.ADMIN,
            status: true,
        });

        const token = jwt.sign(
            { userId: adminUser.id, profile: adminUser.profile },
            process.env.JWT_SECRET || "secret",
            { expiresIn: "1h" }
        );

        const response = await request(app)
            .get(`/users/${savedUser.id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            id: savedUser.id,
            name: savedUser.name,
            profile: savedUser.profile,
            status: savedUser.status,
            full_address: "Rua Driver, 123",
        });
    });

    it("Deve permitir MOTORISTA acessar os próprios dados", async () => {
        const userRepository = AppDataSource.getRepository(User);
        const driverRepository = AppDataSource.getRepository(Driver);

        const savedUser = await userRepository.save({
            name: "Driver Self",
            email: "driver@email.com",
            password_hash: "password",
            profile: UserProfileEnum.DRIVER,
            status: true,
        });

        await driverRepository.save({
            user: savedUser,
            document: "12345678900",
            full_address: "Rua Driver, 123",
        });

        const token = jwt.sign(
            { userId: savedUser.id, profile: savedUser.profile },
            process.env.JWT_SECRET || "secret",
            { expiresIn: "1h" }
        );

        const response = await request(app)
            .get(`/users/${savedUser.id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            id: savedUser.id,
            name: savedUser.name,
            profile: savedUser.profile,
            status: savedUser.status,
            full_address: "Rua Driver, 123",
        });
    });

    it("Deve retornar 401 se MOTORISTA tentar acessar outro usuário", async () => {
        const userRepository = AppDataSource.getRepository(User);

        const otherUser = await userRepository.save({
            name: "Outro Motorista",
            email: "outro@email.com",
            password_hash: "password",
            profile: UserProfileEnum.DRIVER,
            status: true,
        });

        const driverUser = await userRepository.save({
            name: "Motorista Logado",
            email: "driver@email.com",
            password_hash: "password",
            profile: UserProfileEnum.DRIVER,
            status: true,
        });

        const token = jwt.sign(
            { userId: driverUser.id, profile: driverUser.profile },
            process.env.JWT_SECRET || "secret",
            { expiresIn: "1h" }
        );

        const response = await request(app)
            .get(`/users/${otherUser.id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Acesso negado.");
    });

    it("Deve retornar 404 quando o usuário solicitado não existir", async () => {
        const userRepository = AppDataSource.getRepository(User);

        const adminUser = await userRepository.save({
            name: "Admin Teste",
            email: "admin@email.com",
            password_hash: "password",
            profile: UserProfileEnum.ADMIN,
            status: true,
        });

        const token = jwt.sign(
            { userId: adminUser.id, profile: adminUser.profile },
            process.env.JWT_SECRET || "secret",
            { expiresIn: "1h" }
        );

        const originalConsoleError = console.error;
        console.error = jest.fn();

        const response = await request(app)
            .get("/users/999")
            .set("Authorization", `Bearer ${token}`);

        console.error = originalConsoleError;

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Usuário não encontrado");
    });

});
