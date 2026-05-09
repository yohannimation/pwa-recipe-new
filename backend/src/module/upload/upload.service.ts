import { Injectable, BadRequestException } from '@nestjs/common';
import { MultipartFile } from '@fastify/multipart';
import { randomUUID } from 'crypto';
import { mkdirSync, unlink } from 'fs';
import { join } from 'path';
import sharp from 'sharp';

@Injectable()
export class UploadService {
  private readonly uploadDir: string;

  constructor() {
    this.uploadDir = './src/uploads/recipes';
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
    const buffer = await file.toBuffer();

    // Check if the buffer has been truncated (size limit exceeded)
    if (file.file.truncated) {
      throw new BadRequestException('File too large (max 2 MB)');
    }

    const filename = `${randomUUID()}.webp`;
    const filepath = join(this.uploadDir, filename);

    await sharp(buffer)
      .resize({
        width: 800,
        height: 600,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 80 })
      .toFile(filepath);

    return filename;
  }

  removeImage(recipeImage: string): void {
    const oldPath = join(this.uploadDir, recipeImage);
    unlink(oldPath, () => {});
  }
}
