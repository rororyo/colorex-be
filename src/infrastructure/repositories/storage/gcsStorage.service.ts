import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { IGcsStorage } from '../../../domains/repositories/storage/IgcsStorage';

@Injectable()
export class GcsStorageService implements IGcsStorage {
  private storage: Storage;
  private bucketName: string;

  constructor() {
    const credentials = JSON.parse(
      process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON,
    );

    this.storage = new Storage({
      credentials: {
        client_email: credentials.client_email,
        private_key: credentials.private_key,
      },
      projectId: credentials.project_id,
    });

    this.bucketName = process.env.GCS_BUCKET_NAME;
  }

  async uploadFile(
    fileBuffer: Buffer,
    destination: string,
    mimeType: string,
  ): Promise<string> {
    const bucket = this.storage.bucket(this.bucketName);
    const file = bucket.file(destination);

    await file.save(fileBuffer, {
      resumable: false,
      metadata: { contentType: mimeType },
    });

    return `https://storage.googleapis.com/${this.bucketName}/${destination}`;
  }
  async deleteFile(filePath: string): Promise<void> {
    // Decode URL encoded characters
    const decodedPath = decodeURIComponent(filePath);

    const bucket = this.storage.bucket(this.bucketName);
    const file = bucket.file(decodedPath);

    try {
      // Check if file exists before attempting to delete
      const [exists] = await file.exists();

      if (exists) {
        await file.delete();
      } else {
        throw new NotFoundException(`File ${decodedPath} not found`);
      }
    } catch (error) {
      console.log(error);
      throw new BadRequestException(`Failed to delete file: ${decodedPath}`);
    }
  }
}
