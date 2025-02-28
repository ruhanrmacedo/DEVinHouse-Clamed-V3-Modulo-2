/**
 * @swagger
 * components:
 *   schemas:
 *     CreateProductDTO:
 *       type: object
 *       required:
 *         - name
 *         - amount
 *         - description
 *       properties:
 *         name:
 *           type: string
 *           example: "Nome Produto"
 *         amount:
 *           type: integer
 *           example: 100
 *         description:
 *           type: string
 *           example: "Descrição Produto"
 *         url_cover:
 *           type: string
 *           format: uri
 *           example: "https://imagem.com/produto.jpg"
 *
 *     ProductResponseDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           example: 1
 *         name:
 *           type: string
 *           example: "Nome Produto"
 *         amount:
 *           type: integer
 *           example: 100
 *         description:
 *           type: string
 *           example: "Descrição Produto"
 *         url_cover:
 *           type: string
 *           format: uri
 *           example: "https://imagem.com/produto.jpg"
 *         branch:
 *           type: object
 *           properties:
 *             id:
 *               type: number
 *               example: 10
 *             document:
 *               type: string
 *               example: "99.999.999/9999-99"
 *             full_address:
 *               type: string
 *               example: "Endereço do usuário, 123"
 */
