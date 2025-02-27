import request from "supertest";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { Branch } from "../entities/Branch";
import { Product } from "../entities/Product";
import { UserProfileEnum } from "../entities/enums/UserProfileEnum";
import app from "../app";

describe("Teste Isolado - MovementService", () => {
    let tokenOriginBranch: string;
    let originUser: User;
    let destinationUser: User;
    let originBranch: Branch;
    let destinationBranch: Branch;
    let product: Product;

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

        await productRepository.delete({});
        await branchRepository.delete({});
        await userRepository.delete({});

        // Criando usuário para FILIAL DE ORIGEM
        originUser = await userRepository.save({
            name: "Filial Origem",
            email: "origem@email.com",
            password_hash: "password",
            profile: UserProfileEnum.BRANCH,
        });

        console.log("Usuário ORIGEM Criado:", originUser);

        // Criando FILIAL DE ORIGEM e associando ao usuário
        originBranch = await branchRepository.save({
            document: "01008993000102",
            full_address: "Rua Origem, 123",
            user: originUser, 
        });

        originUser.branch = originBranch;
        await userRepository.save(originUser);

        console.log("Filial ORIGEM Criada:", originBranch);

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

        console.log("Filial DESTINO Criada:", destinationBranch);

        // Criando produto na FILIAL DE ORIGEM
        product = await productRepository.save({
            name: "Produto Teste",
            amount: 10,
            description: "Descrição do produto",
            branch: originBranch,
        });

        console.log("Produto Criado:", product);

        // Gerando token JWT para o usuário da FILIAL DE ORIGEM
        tokenOriginBranch = jwt.sign(
            { userId: originUser.id, profile: originUser.profile },
            process.env.JWT_SECRET || "secret",
            { expiresIn: "1h" }
        );

    });

    it("Deve falhar ao tentar movimentar produto com estoque insuficiente", async () => {
        console.log("\n--- Iniciando Teste ---\n");

        const response = await request(app)
            .post("/movements")
            .set("Authorization", `Bearer ${tokenOriginBranch}`)
            .send({
                destination_branch_id: destinationBranch.id, // Certificando-se de que o ID existe
                product_id: product.id,
                quantity: 20, // Maior que o estoque disponível (10)
            });

        console.log("Resposta da API:", response.body);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Estoque insuficiente para essa movimentação.");
    });

    it ("Deve movimentar produto com sucesso", async () => {
        console.log("\n--- Iniciando Teste ---\n");

        const response = await request(app)
            .post("/movements")
            .set("Authorization", `Bearer ${tokenOriginBranch}`)
            .send({
                destination_branch_id: destinationBranch.id,
                product_id: product.id,
                quantity: 5,
            });

        console.log("Resposta da API:", response.body);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body.status).toBe("PENDING");
    });

    it("Deve falhar ao tentar movimentar produto para a mesma filial", async () => {
        console.log("\n--- Iniciando Teste ---\n");

        const response = await request(app)
            .post("/movements")
            .set("Authorization", `Bearer ${tokenOriginBranch}`)
            .send({
                destination_branch_id: originBranch.id, // Mesma filial
                product_id: product.id,
                quantity: 5,
            });

        console.log("Resposta da API:", response.body);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("A filial de origem não pode ser a mesma que a filial de destino.");
    });

    it("Deve subtrair a quantidade movimentada do estoque da filial de origem", async () => {
        console.log("\n--- Iniciando Teste de Atualização de Estoque ---\n");
    
        await request(app)
            .post("/movements")
            .set("Authorization", `Bearer ${tokenOriginBranch}`)
            .send({
                destination_branch_id: destinationBranch.id,
                product_id: product.id,
                quantity: 5,
            });
    
        const updatedProduct = await AppDataSource.getRepository(Product).findOne({
            where: { id: product.id },
        });
    
        console.log("Produto atualizado:", updatedProduct);
    
        expect(updatedProduct?.amount).toBe(5);
    });
});
