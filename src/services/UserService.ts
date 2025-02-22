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
}
