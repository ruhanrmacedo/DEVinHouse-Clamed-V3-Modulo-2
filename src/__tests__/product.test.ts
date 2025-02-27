import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../app";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { Branch } from "../entities/Branch";
import { UserProfileEnum } from "../entities/enums/UserProfileEnum";

describe("ProductController - Testes de Integração", () => {
    let branchUser: User;
    let tokenBranch: string;
    let tokenDriver: string;

    beforeAll(async () => {
        await AppDataSource.initialize();
    });

    afterAll(async () => {
        await AppDataSource.destroy();
    });

    beforeEach(async () => {
        const userRepository = AppDataSource.getRepository(User);
        const branchRepository = AppDataSource.getRepository(Branch);
        await branchRepository.delete({});
        await userRepository.delete({});

        // Usuário Branch com filial associada
        branchUser = await userRepository.save({
            name: "Filial Teste",
            email: "filial@email.com",
            password_hash: "password",
            profile: UserProfileEnum.BRANCH,
        });

        const branch = await branchRepository.save({
            document: "01008993000102",
            full_address: "Rua Teste, 123",
            user: branchUser,
        });

        branchUser.branch = branch;
        await userRepository.save(branchUser);

        // Gerar token JWT para Branch
        tokenBranch = jwt.sign({ userId: branchUser.id, profile: branchUser.profile }, process.env.JWT_SECRET || "secret", {
            expiresIn: "1h",
        });

        // Usuário Driver (para teste Unauthorized)
        const driverUser = await userRepository.save({
            name: "Driver Teste",
            email: "driver@email.com",
            password_hash: "password",
            profile: UserProfileEnum.DRIVER,
        });

        tokenDriver = jwt.sign({ userId: driverUser.id, profile: driverUser.profile }, process.env.JWT_SECRET || "secret", {
            expiresIn: "1h",
        });
    });

    it("Deve cadastrar produto com sucesso (201 Created)", async () => {
        const response = await request(app)
            .post("/products")
            .set("Authorization", `Bearer ${tokenBranch}`)
            .send({
                name: "Produto Integração",
                amount: 10,
                description: "Descrição Integração",
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body.name).toBe("Produto Integração");
    });

    it("Deve retornar 400 Bad Request quando faltar campo obrigatório", async () => {
        const response = await request(app)
            .post("/products")
            .set("Authorization", `Bearer ${tokenBranch}`)
            .send({
                amount: 10,
                description: "Faltando nome",
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Os campos name, amount e description são obrigatórios.");
    });

    it("Deve retornar 401 Unauthorized para usuário que não seja FILIAL", async () => {
        const response = await request(app)
            .post("/products")
            .set("Authorization", `Bearer ${tokenDriver}`)
            .send({
                name: "Produto Inválido",
                amount: 10,
                description: "Tentativa com Driver",
            });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Acesso negado. Apenas FILIAIS podem cadastrar produtos.");
    });
});
