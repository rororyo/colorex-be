export const IGCS_STORAGE = Symbol('IGcsStorage');

export interface IGcsStorage {
  uploadFile(fileBuffer: Buffer, destination: string, mimeType: string): Promise<string>;
}
