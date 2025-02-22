import { UserService } from "../services/UserService";
import { AppDataSource } from "../data-source";
import { UserProfileEnum } from "../entities/enums/UserProfileEnum";
import { User } from "../entities/User";
import { validateCPF, validateCNPJ } from "../utils/validateDocument";
import bcrypt from "bcrypt";
import { Driver } from "../entities/Driver";
import { Branch } from "../entities/Branch";
import request from "supertest";
import app from "../index";

describe("UserService - Testes Unitários", () => {
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


    // Hash de senha com bcrypt
    it("Deve armazenar a senha em hash", async () => {
        const password = "senha123";
        const hashedPassword = await bcrypt.hash(password, 10);

        expect(await bcrypt.compare(password, hashedPassword)).toBe(true);
    });

    // Verificar se o e-mail já está cadastrado
    it("Deve retornar erro ao cadastrar um email já existente", async () => {
        const userRepository = AppDataSource.getRepository(User);
        await userRepository.save({
            name: "Usuário Teste",
            email: "teste@email.com",
            password_hash: await bcrypt.hash("senha123", 10),
            profile: UserProfileEnum.ADMIN,
        });

        await expect(
            userService.createUser({
                name: "Usuário Duplicado",
                email: "teste@email.com",
                password: "senha123",
                profile: UserProfileEnum.ADMIN,
            })
        ).rejects.toThrow("E-mail já cadastrado");
    });

    // Middleware bloqueando acesso para não-ADMIN
    it("Deve impedir que um usuário sem perfil ADMIN cadastre novos usuários", async () => {
        // Criando um usuário DRIVER no banco
        const driverUser = await userService.createUser({
            name: "Usuário DRIVER",
            email: "driver@email.com",
            password: "senha123",
            profile: UserProfileEnum.DRIVER,
            document: "123.456.789-09",
            full_address: "Rua Teste, 123",
        });

        const loginResponse = await request(app)
            .post("/login")
            .send({
                email: "driver@email.com",
                password: "senha123",
            });

        const driverToken = loginResponse.body.token;

        const newUser = {
            name: "Novo Usuário",
            email: "novo@email.com",
            password: "senha123",
            profile: UserProfileEnum.BRANCH,
        };

        const response = await request(app)
            .post("/users")
            .set("Authorization", `Bearer ${driverToken}`) 
            .send(newUser);

        expect(response.status).toBe(403);
        expect(response.body.message).toBe("Acesso negado. Apenas ADMIN pode cadastrar usuários");
    });

    // Salvamento de usuários nas tabelas corretas
    it("Deve salvar um usuário ADMIN na tabela correta", async () => {
        const user = await userService.createUser({
            name: "Admin Teste",
            email: "admin@email.com",
            password: "senha123",
            profile: UserProfileEnum.ADMIN,
        });

        expect(user).toHaveProperty("id");
        expect(user.profile).toBe(UserProfileEnum.ADMIN);
    });

    it("Deve salvar um usuário DRIVER na tabela correta", async () => {
        const user = await userService.createUser({
            name: "Motorista Teste",
            email: "driver@email.com",
            password: "senha123",
            profile: UserProfileEnum.DRIVER,
            document: "123.456.789-09",
            full_address: "Rua Teste, 123",
        });

        expect(user).toHaveProperty("id");
        expect(user.profile).toBe(UserProfileEnum.DRIVER);
    });

    it("Deve salvar um usuário BRANCH na tabela correta", async () => {
        const user = await userService.createUser({
            name: "Filial Teste",
            email: "branch@email.com",
            password: "senha123",
            profile: UserProfileEnum.BRANCH,
            document: "12.345.678/0001-95",
            full_address: "Avenida Central, 100",
        });

        expect(user).toHaveProperty("id");
        expect(user.profile).toBe(UserProfileEnum.BRANCH);
    });
});
