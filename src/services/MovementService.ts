import { AppDataSource } from "../data-source";
import { Movement } from "../entities/Movement";
import { User } from "../entities/User";
import { Product } from "../entities/Product";
import { Branch } from "../entities/Branch";
import { UserProfileEnum } from "../entities/enums/UserProfileEnum";
import { MovementStatusEnum } from "../entities/enums/MovementStatusEnum";
import { Repository } from "typeorm";

export class MovementService {
    private movementRepository: Repository<Movement>;
    private userRepository: Repository<User>;
    private productRepository: Repository<Product>;
    private branchRepository: Repository<Branch>;

    constructor() {
        this.movementRepository = AppDataSource.getRepository(Movement);
        this.userRepository = AppDataSource.getRepository(User);
        this.productRepository = AppDataSource.getRepository(Product);
        this.branchRepository = AppDataSource.getRepository(Branch);
    }

    async createMovement(userId: number, data: { destination_branch_id: number; product_id: number; quantity: number }) {
        const { destination_branch_id, product_id, quantity } = data;
    
        const user = await this.userRepository.findOne({ where: { id: userId }, relations: ["branch"] });
    
        if (!user) {
            throw new Error("Usuário não encontrado.");
        }
    
        if (user.profile !== UserProfileEnum.BRANCH || !user.branch) {
            throw new Error("Acesso negado. Apenas FILIAIS podem movimentar produtos.");
        }
    
        const product = await this.productRepository.findOne({ where: { id: product_id }, relations: ["branch"] });
    
        if (!product) {
            throw new Error("Produto não encontrado.");
        }
    
        const destinationBranch = await this.branchRepository.findOne({ where: { id: destination_branch_id } });
    
        if (!destinationBranch) {
            throw new Error("Filial de destino não encontrada.");
        }
    
        if (product.branch.id !== user.branch.id) {
            throw new Error("Você só pode movimentar produtos da sua própria filial.");
        }

        if (product.branch.id === destinationBranch.id) {
            throw new Error("A filial de origem não pode ser a mesma que a filial de destino.");
        }

        if (quantity <= 0 || quantity > product.amount) {
            throw new Error("Estoque insuficiente para essa movimentação.");
        }

        product.amount -= quantity;
        await this.productRepository.save(product);
    
        const newMovement = this.movementRepository.create({
            destinationBranch,
            product,
            quantity,
            status: MovementStatusEnum.PENDING,
        });
    
        await this.movementRepository.save(newMovement);
    
        return newMovement;
    }

    async listMovements(userId: number) {
        const user = await this.userRepository.findOne({ where: { id: userId } });

        if (!user) {
            throw new Error("Usuário não encontrado.");
        }

        if (user.profile !== UserProfileEnum.BRANCH && user.profile !== UserProfileEnum.DRIVER) {
            throw new Error("Acesso negado. Apenas FILIAIS e MOTORISTAS podem visualizar movimentações.");
        }

        return this.movementRepository.find({
            relations: ["destinationBranch", "product"],
            order: { created_at: "DESC" }
        });
    }

    async startMovement(userId: number, movementId: number) {
        const user = await this.userRepository.findOne({ where: { id: userId }, relations: ["driver"] });
    
        if (!user || user.profile !== UserProfileEnum.DRIVER) {
            throw new Error("Acesso negado. Apenas MOTORISTAS podem iniciar a movimentação.");
        }
    
        const movement = await this.movementRepository.findOne({ where: { id: movementId }, relations: ["driver"] });
    
        if (!movement) {
            throw new Error("Movimentação não encontrada.");
        }
    
        movement.status = MovementStatusEnum.IN_PROGRESS;
        movement.driver = user.driver;
    
        await this.movementRepository.save(movement);
    
        return movement;
    }
}
