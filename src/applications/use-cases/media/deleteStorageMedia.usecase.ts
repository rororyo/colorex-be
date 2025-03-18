import { Inject } from '@nestjs/common';
import { IGcsStorage } from '../../../domains/repositories/storage/IgcsStorage';

import { STORAGE_TOKEN } from '../../../infrastructure/repositories/storage/storage.module';


export class DeleteStorageMediaUseCase {
  constructor(@Inject(STORAGE_TOKEN) private readonly gcsStorage: IGcsStorage) {}

  async execute(filePath: string): Promise<void> {
    await this.gcsStorage.deleteFile(filePath);
  }
}