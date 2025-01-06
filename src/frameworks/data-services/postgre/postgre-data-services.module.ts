import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './model';
import { IDataServices } from 'src/core';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      User
    ])
  ],
  providers:[
    {
      provide: IDataServices,
      useClass: 
    },
  ],
  exports: [IDataServices]
})
export class PostgreDataServiceModule {}
