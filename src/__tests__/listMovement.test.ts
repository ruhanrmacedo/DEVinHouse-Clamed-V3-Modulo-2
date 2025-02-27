import request from "supertest";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import app from "../app";
import { UserProfileEnum } from "../entities/enums/UserProfileEnum";

describe("Teste de Integração - GET /movements", () => {
    let token: string;
    let user: User;

    beforeAll(async () => {
        await AppDataSource.initialize();
    });

    afterAll(async () => {
        await AppDataSource.destroy();
    });

    beforeEach(async () => {
        const userRepository = AppDataSource.getRepository(User);
        await userRepository.delete({});

        user = await userRepository.save({
            name: "Filial Teste",
            email: "filial@email.com",
            password_hash: "password",
            profile: UserProfileEnum.BRANCH,
        });

        token = jwt.sign(
            { userId: user.id, profile: user.profile },
            process.env.JWT_SECRET || "secret",
            { expiresIn: "1h" }
        );
    });

    it("Deve retornar 200 e a lista de movimentações", async () => {
        const response = await request(app)
            .get("/movements")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it("Deve retornar 401 para usuários sem permissão", async () => {
        const response = await request(app).get("/movements");
        expect(response.status).toBe(401);
    });
});
