import { AppDataSource } from "../data-source";
import { Product } from "../entities/Product";
import { User } from "../entities/User";
import { UserProfileEnum } from "../entities/enums/UserProfileEnum";
import { Repository } from "typeorm";

export class ProductService {
    private productRepository: Repository<Product>;
    private userRepository: Repository<User>;

    constructor() {
        this.productRepository = AppDataSource.getRepository(Product);
        this.userRepository = AppDataSource.getRepository(User);
    }

    async createProduct(userId: number, data: { name: string; amount: number; description: string; url_cover?: string }) {
        const { name, amount, description, url_cover } = data;

        const user = await this.userRepository.findOne({ where: { id: userId }, relations: ["branch"] });

        if (!user) {
            throw new Error("Usuário não encontrado.");
        }

        if (user.profile !== UserProfileEnum.BRANCH || !user.branch) {
            throw new Error("Acesso negado. Apenas FILIAIS podem cadastrar produtos.");
        }

        if (!name || !amount || !description) {
            throw new Error("Os campos name, amount e description são obrigatórios.");
        }

        const parsedAmount = Number(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0 || !Number.isInteger(parsedAmount)) {
            throw new Error("O campo amount deve ser um número inteiro positivo.");
        }

        const newProduct = this.productRepository.create({
            name,
            amount: parsedAmount,
            description,
            url_cover,
            branch: user.branch,
        });

        await this.productRepository.save(newProduct);

        return newProduct;
    }
}
