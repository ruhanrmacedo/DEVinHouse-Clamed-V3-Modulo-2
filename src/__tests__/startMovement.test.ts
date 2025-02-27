import request from "supertest";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { Movement } from "../entities/Movement";
import { Driver } from "../entities/Driver";
import { Branch } from "../entities/Branch";
import { Product } from "../entities/Product";
import app from "../app";
import { UserProfileEnum } from "../entities/enums/UserProfileEnum";
import { MovementStatusEnum } from "../entities/enums/MovementStatusEnum";

describe("Teste de Integração - PATCH /movements/:id/start", () => {
    let destinationUser: User;
    let originBranch: Branch;
    let destinationBranch: Branch;
    let product: Product;
    let driverUser: User;
    let driverToken: string;
    let nonDriverToken: string;
    let movement: Movement;

    beforeAll(async () => {
        await AppDataSource.initialize();
    });

    afterAll(async () => {
        await AppDataSource.destroy();
    });

    beforeEach(async () => {
        const userRepository = AppDataSource.getRepository(User);
        const branchRepository = AppDataSource.getRepository(Branch);
        const productRepository = AppDataSource.getRepository(Product);
        const movementRepository = AppDataSource.getRepository(Movement);
        const driverRepository = AppDataSource.getRepository(Driver);

        // Limpar os dados antes de cada teste
        await movementRepository.delete({});
        await productRepository.delete({});
        await branchRepository.delete({});
        await driverRepository.delete({});
        await userRepository.delete({});

        // Criando usuário para FILIAL DE DESTINO
        destinationUser = await userRepository.save({
            name: "Filial Destino",
            email: "destino@email.com",
            password_hash: "password",
            profile: UserProfileEnum.BRANCH,
        });

        console.log("Usuário DESTINO Criado:", destinationUser);

        // Criando FILIAL DE DESTINO e associando ao usuário
        destinationBranch = await branchRepository.save({
            document: "02008993000102",
            full_address: "Rua Destino, 456",
            user: destinationUser,
        });

        destinationUser.branch = destinationBranch;
        await userRepository.save(destinationUser);

        // Criando usuário para FILIAL DE ORIGEM
        const originUser = await userRepository.save({
            name: "Filial Origem",
            email: "origem@email.com",
            password_hash: "password",
            profile: UserProfileEnum.BRANCH,
        });

        // Criando FILIAL DE ORIGEM e associando ao usuário
        originBranch = await branchRepository.save({
            document: "01008993000102",
            full_address: "Rua Origem, 123",
            user: originUser,  // 🔹 Associando a filial ao usuário
        });

        // Atualizando o usuário para incluir a filial
        originUser.branch = originBranch;
        await userRepository.save(originUser);

        // Criando produto na FILIAL DE ORIGEM
        product = await productRepository.save({
            name: "Produto Teste",
            amount: 10,
            description: "Descrição do produto",
            branch: originBranch,
        });

        // Criando usuário MOTORISTA
        driverUser = await userRepository.save({
            name: "Motorista Teste",
            email: "motorista@email.com",
            password_hash: "password",
            profile: UserProfileEnum.DRIVER,
        });

        // Associando motorista ao driver
        const driver = await driverRepository.save({
            document: "12345678900",
            full_address: "Rua Motorista, 100",
            user: driverUser,
        });

        // Gerando token para MOTORISTA
        driverToken = jwt.sign(
            { userId: driverUser.id, profile: driverUser.profile },
            process.env.JWT_SECRET || "secret",
            { expiresIn: "1h" }
        );

        // Criando usuário NÃO-MOTORISTA
        const nonDriverUser = await userRepository.save({
            name: "Filial Teste",
            email: "filial@email.com",
            password_hash: "password",
            profile: UserProfileEnum.BRANCH,
        });

        // Gerando token para usuário SEM permissão
        nonDriverToken = jwt.sign(
            { userId: nonDriverUser.id, profile: nonDriverUser.profile },
            process.env.JWT_SECRET || "secret",
            { expiresIn: "1h" }
        );

        // Criando uma MOVIMENTAÇÃO pendente
        movement = await movementRepository.save({
            destinationBranch,
            product,
            quantity: 3,
            status: MovementStatusEnum.PENDING,
        });
    });

    it("Deve atualizar status para IN_PROGRESS se o usuário for MOTORISTA", async () => {
        const response = await request(app)
            .patch(`/movements/${movement.id}/start`)
            .set("Authorization", `Bearer ${driverToken}`);

        expect(response.status).toBe(200);
        expect(response.body.status).toBe("IN_PROGRESS");
    });

    it("Deve retornar 403 se o usuário não for MOTORISTA", async () => {
        const response = await request(app)
            .patch(`/movements/${movement.id}/start`)
            .set("Authorization", `Bearer ${nonDriverToken}`);

        expect(response.status).toBe(403);
        expect(response.body.message).toBe("Acesso negado. Apenas MOTORISTAS podem acessar este recurso.");
    });
        

    it("Deve retornar 404 se a movimentação não existir", async () => {
        const response = await request(app)
            .patch(`/movements/9999/start`)
            .set("Authorization", `Bearer ${driverToken}`);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Movimentação não encontrada.");
    });
        

});
