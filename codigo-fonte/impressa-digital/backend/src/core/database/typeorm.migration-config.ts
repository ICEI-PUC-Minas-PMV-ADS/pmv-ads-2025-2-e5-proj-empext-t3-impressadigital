import { config } from "dotenv";
import { DataSource, DataSourceOptions } from "typeorm";

config();

const dataSourceOptions: DataSourceOptions = {
  type: "mysql",
  host: process.env.DATABASE_HOST, // Valor default caso não encontre a variável
  port: parseInt(process.env.DATABASE_PORT!),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [__dirname + "/entities/**/*.entity{.ts,.js}"],
  migrations: [__dirname + "/migrations/*{.ts,.js}"],
  migrationsRun: true,
  synchronize: true,
  logging: ["query", "error"],
  migrationsTransactionMode: "each",
};

export default new DataSource(dataSourceOptions);
