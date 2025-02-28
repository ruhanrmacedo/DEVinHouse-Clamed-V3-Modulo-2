/**
 * @swagger
 * components:
 *   schemas:
 *     CreateMovementDTO:
 *       type: object
 *       required:
 *         - destination_branch_id
 *         - product_id
 *         - quantity
 *       properties:
 *         destination_branch_id:
 *           type: integer
 *           example: 2
 *         product_id:
 *           type: integer
 *           example: 1
 *         quantity:
 *           type: integer
 *           example: 10
 *
 *     MovementResponseDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         quantity:
 *           type: integer
 *           example: 10
 *         status:
 *           type: string
 *           enum: [PENDING, IN_PROGRESS, FINISHED]
 *           example: "PENDING"
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2025-02-27T00:44:44.144Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           example: "2025-02-27T00:44:44.144Z"
 *         driver:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 1
 *             document:
 *               type: string
 *               example: "999.999.999-99"
 *             full_address:
 *               type: string
 *               example: "Endereço do usuário, 123"
 *         destinationBranch:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 2
 *             document:
 *               type: string
 *               example: "99.999.999/9999-99"
 *             full_address:
 *               type: string
 *               example: "Endereço do usuário, 123"
 *         product:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 1
 *             name:
 *               type: string
 *               example: "Nome Produto"
 *             amount:
 *               type: integer
 *               example: 100
 *             description:
 *               type: string
 *               example: "Descrição Produto"
 *             url_cover:
 *               type: string
 *               format: uri
 *               example: "https://imagem.com/produto.jpg"
 */
