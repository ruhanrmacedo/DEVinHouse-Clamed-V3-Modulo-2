import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { Driver } from "../entities/Driver";
import { Branch } from "../entities/Branch";
import { UserProfileEnum } from "../entities/enums/UserProfileEnum";
import bcrypt from "bcrypt";
import { validateCNPJ, validateCPF } from "../utils/validateDocument";

export class UserService {
    private userRepository = AppDataSource.getRepository(User);
    private driverRepository = AppDataSource.getRepository(Driver);
    private branchRepository = AppDataSource.getRepository(Branch);

    async createUser(data: any): Promise<User> {
        const { name, profile, email, password, document, full_address } = data;

        // Verificar se o e-mail já existe
        const emailExists = await this.userRepository.findOneBy({ email });
        if (emailExists) {
            throw new Error("E-mail já cadastrado");
        }

        if (profile === UserProfileEnum.DRIVER && !validateCPF(document)) {
            throw new Error("CPF inválido");
        }
        if (profile === UserProfileEnum.BRANCH && !validateCNPJ(document)) {
            throw new Error("CNPJ inválido");
        }

        // Criptografar a senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Criar usuário na tabela `users`
        const newUser = this.userRepository.create({
            name,
            profile,
            email,
            password_hash: hashedPassword,
        });

        await this.userRepository.save(newUser);

        // Se for DRIVER, criar na tabela `drivers`
        if (profile === UserProfileEnum.DRIVER) {
            const newDriver = this.driverRepository.create({
                user: newUser,
                document,
                full_address,
            });
            await this.driverRepository.save(newDriver);
        }

        // Se for BRANCH, criar na tabela `branches`
        if (profile === UserProfileEnum.BRANCH) {
            const newBranch = this.branchRepository.create({
                user: newUser,
                document,
                full_address,
            });
            await this.branchRepository.save(newBranch);
        }

        return newUser;
    }

    async listUsers(profile?: UserProfileEnum) {
        const query = this.userRepository
            .createQueryBuilder("user")
            .select(["user.id", "user.name", "user.profile", "user.status"]);

        if (profile) {
            query.where("user.profile = :profile", { profile });
        }

        return await query.getMany();
    }

    async getUserById(userId: number) {
        const user = await this.userRepository
            .createQueryBuilder("user")
            .leftJoinAndSelect("user.driver", "driver")
            .leftJoinAndSelect("user.branch", "branch")
            .select([
                "user.id",
                "user.name",
                "user.status",
                "driver.full_address",
                "branch.full_address",
                "user.profile",
            ])
            .where("user.id = :userId", { userId })
            .getOne();

        if (!user) {
            throw new Error("Usuário não encontrado");
        }

        const fullAddress =
            user.profile === UserProfileEnum.DRIVER
                ? user.driver?.full_address
                : user.profile === UserProfileEnum.BRANCH
                ? user.branch?.full_address
                : null;

        return {
            id: user.id,
            name: user.name,
            status: user.status,
            profile: user.profile,
            full_address: fullAddress,
        };
    }

    // Método para atualizar um usuário
    async updateUser(userId: number, data: any, loggedUser: { id: number, profile: UserProfileEnum }) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
    
        if (!user) {
            throw new Error("Usuário não encontrado");
        }
    
        if (loggedUser.profile !== UserProfileEnum.ADMIN && loggedUser.id !== userId) {
            throw new Error("Acesso negado.");
        }
    
        const forbiddenFields = ["id", "created_at", "updated_at", "status", "profile"];
        if (Object.keys(data).some(field => forbiddenFields.includes(field))) {
            throw new Error("Atualização de campo proibido.");
        }
    
        if (data.name) user.name = data.name;
        if (data.email) user.email = data.email;
        if (data.password) user.password_hash = await bcrypt.hash(data.password, 10);
    
        await this.userRepository.save(user);
    
        if (user.profile === UserProfileEnum.DRIVER && data.full_address) {
            const driver = await this.driverRepository.findOne({ where: { user: { id: userId } } });
            if (driver) {
                driver.full_address = data.full_address;
                await this.driverRepository.save(driver);
            }
        }
    
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            profile: user.profile,
            full_address: user.profile === UserProfileEnum.DRIVER ? data.full_address || null : null
        };
    }

    // Método para atualizar o status de um usuário
    async updateUserStatus(userId: number, status: boolean, loggedUser: { id: number, profile: UserProfileEnum }) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
    
        if (!user) {
            throw new Error("Usuário não encontrado");
        }
    
        if (loggedUser.profile !== UserProfileEnum.ADMIN) {
            throw new Error("Acesso negado.");
        }
    
        user.status = status;
        await this.userRepository.save(user);
    
        return { message: "Status atualizado com sucesso." };
    }
}
