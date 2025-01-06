import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const isProduction = process.env.NODE_ENV === 'PRODUCTION';
        
        return {
          type: 'postgres',
          url: isProduction ? process.env.DATABASE_URL : undefined,
          entities: isProduction
            ? ['dist/**/*.entity{.ts,.js}']
            : ['src/**/*.entity.ts'],
          synchronize: !isProduction,
          migrations: isProduction
            ? ['dist/migrations/*.js']
            : ['src/migrations/*.ts'],
          migrationsRun: isProduction,
          ssl: isProduction
            ? (process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false)
            : false,
          ...(isProduction
            ? {}
            : {
                host: process.env.DB_HOST || 'localhost',
                port: parseInt(process.env.DB_PORT) || 5432,
                username: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_DATABASE, 
              }),
        };
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
