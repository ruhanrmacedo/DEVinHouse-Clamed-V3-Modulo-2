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

describe("Teste de Integração - PATCH /movements/:id/end", () => {
    let originBranch: Branch;
    let destinationBranch: Branch;
    let product: Product;
    let driverUser: User;
    let driverToken: string;
    let otherDriverToken: string;
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

        // Criando FILIAL DE ORIGEM
        const originUser = await userRepository.save({
            name: "Filial Origem",
            email: "origem@email.com",
            password_hash: "password",
            profile: UserProfileEnum.BRANCH,
        });

        originBranch = await branchRepository.save({
            document: "01008993000102",
            full_address: "Rua Origem, 123",
            user: originUser,
        });

        // Criando FILIAL DE DESTINO
        const destinationUser = await userRepository.save({
            name: "Filial Destino",
            email: "destino@email.com",
            password_hash: "password",
            profile: UserProfileEnum.BRANCH,
        });

        destinationBranch = await branchRepository.save({
            document: "02008993000102",
            full_address: "Rua Destino, 456",
            user: destinationUser,
        });

        // Criando produto na FILIAL DE ORIGEM
        product = await productRepository.save({
            name: "Produto Teste",
            amount: 10,
            description: "Descrição do produto",
            branch: originBranch,
            url_cover: "https://imagem.com/produto.jpg",
        });

        // Criando usuário MOTORISTA
        driverUser = await userRepository.save({
            name: "Motorista Teste",
            email: "motorista@email.com",
            password_hash: "password",
            profile: UserProfileEnum.DRIVER,
        });

        const driver = await driverRepository.save({
            document: "12345678900",
            full_address: "Rua Motorista, 100",
            user: driverUser,
        });

        // Gerando token para MOTORISTA responsável
        driverToken = jwt.sign(
            { userId: driverUser.id, profile: driverUser.profile },
            process.env.JWT_SECRET || "secret",
            { expiresIn: "1h" }
        );

        // Criando outro MOTORISTA para testar acesso negado
        const otherDriverUser = await userRepository.save({
            name: "Outro Motorista",
            email: "outro_motorista@email.com",
            password_hash: "password",
            profile: UserProfileEnum.DRIVER,
        });

        await driverRepository.save({
            document: "98765432100",
            full_address: "Rua Outro Motorista, 200",
            user: otherDriverUser,
        });

        otherDriverToken = jwt.sign(
            { userId: otherDriverUser.id, profile: otherDriverUser.profile },
            process.env.JWT_SECRET || "secret",
            { expiresIn: "1h" }
        );

        // Criando uma MOVIMENTAÇÃO e atribuindo ao motorista
        movement = await movementRepository.save({
            destinationBranch,
            product,
            quantity: 3,
            status: MovementStatusEnum.IN_PROGRESS,
            driver: driver,
        });
    });

    it("Deve atualizar status para FINISHED e registrar o produto na filial de destino", async () => {
        const response = await request(app)
            .patch(`/movements/${movement.id}/end`)
            .set("Authorization", `Bearer ${driverToken}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Movimentação finalizada com sucesso.");
        expect(response.body.movement.status).toBe("FINISHED");


        await new Promise((resolve) => setTimeout(resolve, 1000));

        console.log("Movimento Finalizado:", movement);

        const createdProduct = await AppDataSource.getRepository(Product).findOne({
            where: { name: movement.product.name, branch: { id: movement.destinationBranch.id } },
            relations: ["branch"],
        });

        console.log("Produto Criado:", createdProduct);

        expect(createdProduct).toBeDefined();
        expect(createdProduct?.amount).toBe(movement.quantity);
        expect(createdProduct?.url_cover).toBe("https://imagem.com/produto.jpg");
    });

    it("Deve retornar 403 se outro motorista tentar finalizar a movimentação", async () => {
        const response = await request(app)
            .patch(`/movements/${movement.id}/end`)
            .set("Authorization", `Bearer ${otherDriverToken}`);

        expect(response.status).toBe(403);
        expect(response.body.message).toBe("Apenas o MOTORISTA responsável pela movimentação pode finalizá-la.");
    });

    it("Deve retornar 404 se a movimentação não existir", async () => {
        const response = await request(app)
            .patch(`/movements/9999/end`)
            .set("Authorization", `Bearer ${driverToken}`);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Movimentação não encontrada.");
    });
});
