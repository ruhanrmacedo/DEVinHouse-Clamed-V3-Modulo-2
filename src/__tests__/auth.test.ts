import request from "supertest";
import bcrypt from "bcrypt";
import { AppDataSource } from "../data-source";
import app from "../app";
import { User } from "../entities/User";
import { UserProfileEnum } from "../entities/enums/UserProfileEnum";
import { Driver } from "../entities/Driver";
import { Branch } from "../entities/Branch";

beforeAll(async () => {
    await AppDataSource.initialize();
});

beforeEach(async () => {
    const driverRepository = AppDataSource.getRepository(Driver);
    const branchRepository = AppDataSource.getRepository(Branch);
    const userRepository = AppDataSource.getRepository(User);

    await driverRepository.delete({});
    await branchRepository.delete({});
    
    await userRepository.delete({});
});

afterAll(async () => {
    try {
        await AppDataSource.destroy();
    } catch (error) {
        console.error("Erro ao destruir a conexão do banco de dados:", error);
    }
});

describe("Teste de login", () => {
    it("Deve fazer login corretamente e retornar o token", async () => {
        const userRepository = AppDataSource.getRepository(User);

        // Criar usuário ADMIN de teste
        const hashedPassword = await bcrypt.hash("senhaTeste", 10);
        const user = userRepository.create({
            name: "Admin",
            email: "admin@email.com",
            password_hash: hashedPassword,
            profile: UserProfileEnum.ADMIN,
        });

        await userRepository.save(user);

        const response = await request(app)
            .post("/login")
            .send({
                email: "admin@email.com",
                password: "senhaTeste",
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("token");
        expect(response.body.user.name).toBe("Admin");
        expect(response.body.user.profile).toBe("ADMIN");
    });

    it("Deve retornar erro 400 se email ou senha estiverem ausentes", async () => {
        const response = await request(app).post("/login").send({});
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("E-mail e senha são obrigatórios");
    });

    it("Deve retornar erro 401 se o email não existir", async () => {
        const response = await request(app).post("/login").send({
            email: "naoexiste@email.com",
            password: "senha123",
        });
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("E-mail ou senha inválidos");
    });

    it("Deve retornar erro 401 se a senha estiver incorreta", async () => {
        const response = await request(app).post("/login").send({
            email: "admin@email.com",
            password: "senhaerrada",
        });
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("E-mail ou senha inválidos");
    });
});
