import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

const config = new DataSource({
  type: 'postgres',
  host: isProduction ? process.env.DATABASE_PROD_HOST : process.env.DATABASE_HOST,
  port: parseInt(isProduction ? process.env.DATABASE_PROD_PORT : process.env.DATABASE_PORT, 10),
  username: isProduction ? process.env.DATABASE_PROD_USER : process.env.DATABASE_USER,
  password: isProduction ? process.env.DATABASE_PROD_PASSWORD : process.env.DATABASE_PASSWORD,
  database: isProduction ? process.env.DATABASE_PROD_NAME : process.env.DATABASE_NAME,
  entities: [__dirname + './../../**/*.entity{.ts,.js}'],
  synchronize: isProduction ? process.env.DATABASE_PROD_SYNCHRONIZE === 'true' : process.env.DATABASE_SYNCHRONIZE === 'true',
  migrationsRun: isProduction ? process.env.DATABASE_PROD_MIGRATIONS_RUN === 'true' : false,
  migrations: ['database/migrations/**/*{.ts,.js}'],
  schema: process.env.DATABASE_SCHEMA,
});

config
  .initialize()
  .then(() => {
    console.log(`✅ Data Source has been initialized in ${process.env.NODE_ENV} mode!`);
  })
  .catch((err) => {
    console.error('❌ Error during Data Source initialization', err);
  });

export default config;
