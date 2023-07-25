import {DataSource} from "typeorm";
import {SnakeNamingStrategy} from 'typeorm-naming-strategies'

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DATABASE_HOST ?? 'localhost',
    port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT) : 5432,
    username: process.env.DATABASE_USERNAME ?? 'postgres',
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME ?? "londonapartmentbot",
    logging: false,
    entities: [__dirname + '/entity/*.ts'],
    migrations: [__dirname + '/migration/*.js'],
    namingStrategy: new SnakeNamingStrategy()
})
