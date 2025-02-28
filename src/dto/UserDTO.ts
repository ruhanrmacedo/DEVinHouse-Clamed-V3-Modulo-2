import { UserProfileEnum } from "../entities/enums/UserProfileEnum";

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateUserDTO:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - profile
 *         - document
 *       properties:
 *         name:
 *           type: string
 *           example: "Nome Usuário"
 *         email:
 *           type: string
 *           format: email
 *           example: "email@email.com"
 *         password:
 *           type: string
 *           format: password
 *           example: "senha123"
 *         profile:
 *           type: string
 *           enum: [DRIVER, BRANCH, ADMIN]
 *           example: "BRANCH"
 *         document:
 *           type: string
 *           example: "99.999.999/9999-99"
 *         full_address:
 *           type: string
 *           example: "Endereço do usuário, 123"
 *
 *     UpdateUserDTO:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "Nome Usuário"
 *         email:
 *           type: string
 *           format: email
 *           example: "email@email.com"
 *         password:
 *           type: string
 *           format: password
 *           example: "novaSenha123"
 *         full_address:
 *           type: string
 *           example: "Endereço do usuário, 123"
 *
 *     UpdateUserStatusDTO:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: boolean
 *           example: true
 *
 *     UserResponseDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           example: 1
 *         name:
 *           type: string
 *           example: "Nome Usuário"
 *         email:
 *           type: string
 *           format: email
 *           example: "email@email.com"
 *         profile:
 *           type: string
 *           enum: [DRIVER, BRANCH, ADMIN]
 *           example: "BRANCH"
 *         full_address:
 *           type: string
 *           example: "Endereço do usuário, 123"
 */
