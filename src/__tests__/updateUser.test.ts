import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { UserProfileEnum } from "../entities/enums/UserProfileEnum";
import jwt from "jsonwebtoken";
import request from "supertest";
import app from "../app";
import { Driver } from "../entities/Driver";

describe("PUT /users/:id - Testes de Integração", () => {
    beforeAll(async () => {
        await AppDataSource.initialize();
    });

    afterAll(async () => {
        await AppDataSource.destroy();
    });

    beforeEach(async () => {
        const driverRepository = AppDataSource.getRepository(Driver);
        const userRepository = AppDataSource.getRepository(User);
        await driverRepository.delete({});
        await userRepository.delete({});
    });

    it("Deve permitir ADMIN atualizar qualquer usuário", async () => {
        const userRepository = AppDataSource.getRepository(User);

        const user = await userRepository.save({
            name: "User Teste",
            email: "user@email.com",
            password_hash: "password",
            profile: UserProfileEnum.DRIVER,
            status: true,
        });

        const admin = await userRepository.save({
            name: "Admin Teste",
            email: "admin@email.com",
            password_hash: "password",
            profile: UserProfileEnum.ADMIN,
            status: true,
        });

        const token = jwt.sign({ userId: admin.id, profile: admin.profile }, process.env.JWT_SECRET || "secret", {
            expiresIn: "1h",
        });

        const response = await request(app)
            .put(`/users/${user.id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "Novo Nome" });

        expect(response.status).toBe(200);
        expect(response.body.name).toBe("Novo Nome");
    });

    it("Deve impedir atualização de campos proibidos", async () => {
        const userRepository = AppDataSource.getRepository(User);

        const user = await userRepository.save({
            name: "User Teste",
            email: "user@email.com",
            password_hash: "password",
            profile: UserProfileEnum.DRIVER,
            status: true,
        });

        const token = jwt.sign({ userId: user.id, profile: user.profile }, process.env.JWT_SECRET || "secret", {
            expiresIn: "1h",
        });

        const response = await request(app)
            .put(`/users/${user.id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ id: 99, profile: UserProfileEnum.ADMIN });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Atualização de campo proibido.");
    });

    it("Deve impedir um MOTORISTA de atualizar os dados de outro usuário", async () => {
        const userRepository = AppDataSource.getRepository(User);
    
        const driver1 = await userRepository.save({
            name: "Motorista 1",
            email: "driver1@email.com",
            password_hash: "password",
            profile: UserProfileEnum.DRIVER,
            status: true,
        });
    
        const driver2 = await userRepository.save({
            name: "Motorista 2",
            email: "driver2@email.com",
            password_hash: "password",
            profile: UserProfileEnum.DRIVER,
            status: true,
        });
    
        const token = jwt.sign(
            { userId: driver1.id, profile: driver1.profile },
            process.env.JWT_SECRET || "secret",
            { expiresIn: "1h" }
        );
    
        const response = await request(app)
            .put(`/users/${driver2.id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "Nome Alterado" });
    
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Acesso negado.");
    });

    it("Deve impedir atualização sem autenticação", async () => {
        const userRepository = AppDataSource.getRepository(User);
    
        const user = await userRepository.save({
            name: "Usuário Teste",
            email: "user@email.com",
            password_hash: "password",
            profile: UserProfileEnum.ADMIN,
            status: true,
        });
    
        const response = await request(app)
            .put(`/users/${user.id}`)
            .send({ name: "Novo Nome" });
    
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Usuário não autenticado.");
    });

    it("Deve permitir que um MOTORISTA atualize seu próprio endereço", async () => {
        const userRepository = AppDataSource.getRepository(User);
        const driverRepository = AppDataSource.getRepository(Driver);
    
        const driverUser = await userRepository.save({
            name: "Motorista",
            email: "driver@email.com",
            password_hash: "password",
            profile: UserProfileEnum.DRIVER,
            status: true,
        });
    
        await driverRepository.save({
            user: driverUser,
            document: "12345678900",
            full_address: "Rua Antiga, 123",
        });
    
        const token = jwt.sign(
            { userId: driverUser.id, profile: driverUser.profile },
            process.env.JWT_SECRET || "secret",
            { expiresIn: "1h" }
        );
    
        const response = await request(app)
            .put(`/users/${driverUser.id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ full_address: "Rua Nova, 456" });
    
        expect(response.status).toBe(200);
        expect(response.body.full_address).toBe("Rua Nova, 456");
    });
});
