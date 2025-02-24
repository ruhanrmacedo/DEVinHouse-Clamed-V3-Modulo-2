import { AppDataSource } from "../data-source";

export default async () => {
  await AppDataSource.destroy();
  console.log("Banco de dados de teste finalizado!");
};
