import { Injectable, Inject } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(@Inject('CLOUDINARY') private readonly cloudinary) {}

  async uploadImage(file: any): Promise<{ secure_url: string }> {
    return new Promise((resolve, reject) => {
      if (!file || !file.buffer) {
        reject(new Error('Invalid file'));
        return;
      }

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: 'produtos',
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else if (result && result.secure_url) {
            resolve({ secure_url: result.secure_url });
          } else {
            reject(new Error('Upload failed: No result from Cloudinary'));
          }
        }
      );

      uploadStream.end(file.buffer);
    });
  }

  async uploadMultipleImages(files: any[]): Promise<{ secure_url: string }[]> {
    const results: { secure_url: string }[] = [];
    
    for (const file of files) {
      try {
        const result = await this.uploadImage(file);
        results.push(result);
      } catch (error) {
        console.error(`Failed to upload file: ${file.originalname}`, error);
        throw error;
      }
    }
    
    return results;
  }
}