import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { IGcsStorage } from 'src/domains/repositories/storage/IGcsStorage';


@Injectable()
export class GcsStorageService implements IGcsStorage {
  private storage: Storage;
  private bucketName: string;

  constructor() {
    const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);

    this.storage = new Storage({
      credentials: {
        client_email: credentials.client_email,
        private_key: credentials.private_key,
      },
      projectId: credentials.project_id,
    });

    this.bucketName = process.env.GCS_BUCKET_NAME;
  }

  async uploadFile(fileBuffer: Buffer, destination: string, mimeType: string): Promise<string> {
    const bucket = this.storage.bucket(this.bucketName);
    const file = bucket.file(destination);

    await file.save(fileBuffer, {
      resumable: false,
      metadata: { contentType: mimeType },
    });

    return `https://storage.googleapis.com/${this.bucketName}/${destination}`;
  }
}
