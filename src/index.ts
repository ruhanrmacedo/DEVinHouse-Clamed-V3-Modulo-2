require("dotenv").config();
import "reflect-metadata";
import { AppDataSource } from "./data-source";
import app from "./app";
import logger from "./config/winston";

AppDataSource.initialize()
  .then(() => {
    app.listen(process.env.PORT, () => {
      logger.info(`Servidor rodando em http://localhost:${process.env.PORT}`);
    });
  })
  .catch((error) => {
    logger.error("Erro ao inicializar o banco:", error);
  });
