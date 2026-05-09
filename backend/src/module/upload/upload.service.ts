import { Injectable, BadRequestException } from '@nestjs/common';
import { MultipartFile } from '@fastify/multipart';
import { randomUUID } from 'crypto';
import { createWriteStream, mkdirSync, unlink } from 'fs';
import { join, extname } from 'path';
import { pipeline } from 'stream/promises';

@Injectable()
export class UploadService {
  private readonly uploadDir: string;

  constructor() {
    this.uploadDir = './src/uploads/recipes';

    // Create folder if not exist
    mkdirSync(this.uploadDir, { recursive: true });
  }

  checkFormat(file: MultipartFile) {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid format. Formats accepted : jpeg, png, webp',
      );
    }
  }

  async saveImage(file: MultipartFile): Promise<string> {
    const ext = extname(file.filename) || '.jpg';
    const filename = `${randomUUID()}${ext}`;
    const filepath = join(this.uploadDir, filename);

    await pipeline(file.file, createWriteStream(filepath));

    // Check if the stream has been truncated (size limit exceeded)
    if (file.file.truncated) {
      throw new BadRequestException('File too large (max 2 MB)');
    }

    return filename;
  }

  removeImage(recipeImage: string): void {
    const oldPath = join(this.uploadDir, recipeImage);
    unlink(oldPath, () => {});
  }
}
