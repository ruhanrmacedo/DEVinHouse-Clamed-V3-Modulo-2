# API Guarda-Chuva 

API RESTful para gerenciamento de usuários, produtos e movimentações entre filiais da rede **Guarda-Chuva Farmácias**.

## Tecnologias Utilizadas
- **Node.js** (Ambiente de execução)
- **Express** (Framework para API)
- **TypeORM** (ORM para banco de dados)
- **PostgreSQL** (Banco de dados relacional)
- **JWT (JSON Web Token)** (Autenticação segura)
- **Swagger** (Documentação da API)
- **Jest** (Testes automatizados)

---

## Instalação e Configuração

### Pré-requisitos
Antes de rodar o projeto, certifique-se de ter instalado:
- **Node.js 18.x**
- **PostgreSQL**

### Clonando o repositório
```bash
git clone https://github.com/ruhanrmacedo/DEVinHouse-Clamed-V3-Modulo-2.git
cd DEVinHouse-Clamed-V3-Modulo-2
```
### Instalando as dependências
```
npm install
```
## Configuração do Banco de Dados
Crie um arquivo .env na raiz do projeto e configure as variáveis de ambiente:

```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=seu_usuario
DB_PASSWORD=sua_senha
DB_DATABASE=seu_banco_de_dados

JWT_SECRET=

PORT=
```
Crie um arquivo .env.test na raiz do projeto e configure as variáveis de ambiente:
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=
DB_PASSWORD=
DB_NAME=seu_banco_de_dados_teste
NODE_ENV=test
JWT_SECRET=

PORT=
```
Após configurar o banco, rode as migrations para criar as tabelas:

```
npm run migration:run
```
Rodando o Projeto
### Modo de Desenvolvimento
```
npm run dev
```

## Documentação da API
A documentação interativa da API pode ser acessada pelo Swagger em:

```
http://localhost:3000/api-swagger
```

## Endpoints Principais
### Usuários (```/users```)
- **```GET /users```** (Retorna a lista de usuários cadastrados)
- **```POST /users```** (Cria um novo usuário)
- **```GET /users/{id}```** (Obtém detalhes de um usuário por ID)
- **```PUT /users/{id}```** (Atualiza um usuário por ID)
- **```PATCH /users/{id}/status```** (	Atualiza o status de um usuário)

### Produtos (```/products```)
- **```GET /products```** (Retorna a lista de produtos)
- **```POST /products```** (Cria um novo produto)

### Movimentações  (```/movements```)
- **```GET /movements```** (Retorna a lista de movimentações)
- **```POST /movements```** (	Cria uma nova movimentação)
- **```PATCH /movements/{id}/start```** (Inicia uma movimentação)
- **```PATCH /movements/{id}/end```** (Finaliza uma movimentação)

### Autenticação (```/login```)
- **```POST /login```** (Realiza login e retorna um token JWT)

## Rodando os Testes
Para rodar os testes automatizados, utilize o comando:
```
npm test -- nomeDoTeste.test.ts
```
Os testes estão localizados na pasta ```src/__tests__``` e incluem:
- Testes de autenticação (```auth.test.ts```)
- Testes de movimentação (```startMovement.test.ts```, ```finishMovement.test.ts```)
- Testes de usuários (```listUsers.test.ts```, ```getUserById.test.ts```, ```updateUser.test.ts```, ```userStatus.test.ts```)
- Testes de produtos (```listProduct.test.ts```, ```product.test.ts```)

  ## Melhorias Futuras

- Confirmação de Cadastro: Enviar um e-mail de verificação ao cadastrar um usuário, garantindo que apenas e-mails válidos sejam utilizados.
- Recuperação de Senha: Implementar envio de e-mail com um link seguro para redefinição de senha.
- Notificação de Movimentações: Enviar e-mails informando o status das movimentações de produtos entre filiais.

## Apresentação em vídeo
https://drive.google.com/file/d/16_2ToNSMJ71zHJ2zt6g8_RjKQEFBqeA3/view?usp=sharing
