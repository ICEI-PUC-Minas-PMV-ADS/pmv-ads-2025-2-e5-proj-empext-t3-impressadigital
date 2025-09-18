import { DataSource } from "typeorm";

export const authdbProviders = [
  {
    provide: "AuthProviderBase",
    useFactory: async () => {
      const dataSource = new DataSource({
        type: "mysql",
        host: process.env.DATABASE_HOST, // Valor default caso não encontre a variável
        port: parseInt(process.env.DATABASE_PORT!),
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        entities: [__dirname + "/entities/**/*.entity{.ts,.js}"],
        synchronize: false,
       // logging: ["query", "error"],

        // subscribers: [AuditableEntitySubscriber], // Aqui você registra o subscriber
      });

      return dataSource.initialize();
    },
  },
];
