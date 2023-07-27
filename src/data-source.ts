import {DataSource} from "typeorm";
import {SnakeNamingStrategy} from 'typeorm-naming-strategies'

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DATABASE_HOST ?? 'localhost',
    port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT) : 5432,
    username: process.env.DATABASE_USERNAME ?? 'postgres',
    password: process.env.DATABASE_PASSWORD ?? 'password',
    database: process.env.DATABASE_NAME ?? 'londonapartmentbot',
    connectTimeoutMS: 10_000,
    installExtensions: false,
    logging: false,
    entities: [__dirname + '/entity/*.ts', __dirname + '/entity/*.js'],
    migrations: [__dirname + '/migration/*.js'],
    namingStrategy: new SnakeNamingStrategy()
})
