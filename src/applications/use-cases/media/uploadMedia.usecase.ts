import { Inject } from '@nestjs/common';
import { IGcsStorage } from 'src/domains/repositories/storage/IGcsStorage';

import { STORAGE_TOKEN } from 'src/infrastructure/repositories/storage/storage.module';


export class UploadMediaUseCase {
  constructor(@Inject(STORAGE_TOKEN) private readonly gcsStorage: IGcsStorage) {}

  async execute(fileBuffer: Buffer, destination: string, mimeType: string): Promise<string> {
    return this.gcsStorage.uploadFile(fileBuffer, destination, mimeType);
  }
}