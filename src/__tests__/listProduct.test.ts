import { ProductService } from "../services/ProductService";
import { AppDataSource } from "../data-source";
import { Product } from "../entities/Product";
import { User } from "../entities/User";
import { Branch } from "../entities/Branch";
import { UserProfileEnum } from "../entities/enums/UserProfileEnum";

describe("ProductService - Testes de Unidade", () => {
    let productService: ProductService;

    beforeAll(async () => {
        await AppDataSource.initialize();
        productService = new ProductService();
    });

    afterAll(async () => {
        await AppDataSource.destroy();
    });

    beforeEach(async () => {
        const productRepository = AppDataSource.getRepository(Product);
        const userRepository = AppDataSource.getRepository(User);
        const branchRepository = AppDataSource.getRepository(Branch);
        await productRepository.delete({});
        await branchRepository.delete({});
        await userRepository.delete({});
    });

    it("Deve listar os produtos corretamente para uma FILIAL", async () => {
        const userRepository = AppDataSource.getRepository(User);
        const branchRepository = AppDataSource.getRepository(Branch);
        const productRepository = AppDataSource.getRepository(Product);

        // Criar usuário primeiro
        const branchUser = await userRepository.save({
            name: "Filial Teste",
            email: "filial@email.com",
            password_hash: "password",
            profile: UserProfileEnum.BRANCH,
        });

        // Criar a filial e associar ao usuário
        const branch = await branchRepository.save({
            document: "01008993000102",
            full_address: "Rua Teste, 123",
            user: branchUser,
        });

        // Atualizar o usuário com a filial vinculada
        branchUser.branch = branch;
        await userRepository.save(branchUser);

        // Criar produto vinculado à filial
        await productRepository.save({
            name: "Produto Teste",
            amount: 10,
            description: "Descrição do produto",
            url_cover: "https://imagem.com/produto.jpg",
            branch: branch,
        });

        // Buscar produtos
        const products = await productService.listProducts(branchUser.id);
        expect(products.length).toBeGreaterThan(0);
        expect(products[0]).toHaveProperty("id");
        expect(products[0].branch.id).toBe(branch.id);
    });

    it("Deve falhar ao tentar listar produtos sem ser FILIAL", async () => {
        const userRepository = AppDataSource.getRepository(User);

        const nonBranchUser = await userRepository.save({
            name: "Usuário Comum",
            email: "usuario@email.com",
            password_hash: "password",
            profile: UserProfileEnum.DRIVER,
        });

        await expect(productService.listProducts(nonBranchUser.id))
            .rejects.toThrow("Acesso negado. Apenas FILIAIS podem visualizar produtos.");
    });
});
