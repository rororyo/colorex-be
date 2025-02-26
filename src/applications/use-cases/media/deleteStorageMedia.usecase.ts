import { Inject } from '@nestjs/common';
import { IGcsStorage } from 'src/domains/repositories/storage/IGcsStorage';

import { STORAGE_TOKEN } from 'src/infrastructure/storage/storage.module';


export class DeleteStorageMediaUseCase {
  constructor(@Inject(STORAGE_TOKEN) private readonly gcsStorage: IGcsStorage) {}

  async execute(filePath: string): Promise<void> {
    await this.gcsStorage.deleteFile(filePath);
  }
}