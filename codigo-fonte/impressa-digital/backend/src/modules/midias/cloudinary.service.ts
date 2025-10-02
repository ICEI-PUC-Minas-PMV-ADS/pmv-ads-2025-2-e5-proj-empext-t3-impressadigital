// cloudinary.service.ts - Versão corrigida
import { Injectable, Inject } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(@Inject('CLOUDINARY') private readonly cloudinary) {}

  async uploadImage(file: any): Promise<{ secure_url: string; public_id: string }> {
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
            resolve({ 
              secure_url: result.secure_url, 
              public_id: result.public_id 
            });
          } else {
            reject(new Error('Upload failed: No result from Cloudinary'));
          }
        }
      );

      uploadStream.end(file.buffer);
    });
  }

  async uploadMultipleImages(files: any[]): Promise<{ secure_url: string; public_id: string }[]> {
    const results: { secure_url: string; public_id: string }[] = [];
    
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

  async deleteImage(publicId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!publicId) {
        reject(new Error('Public ID is required'));
        return;
      }

      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          console.error('Cloudinary delete error:', error);
          reject(error);
        } else if (result && result.result === 'ok') {
          console.log(`Image ${publicId} deleted successfully from Cloudinary`);
          resolve();
        } else {
          console.error('Unexpected result from Cloudinary:', result);
          reject(new Error('Failed to delete image from Cloudinary'));
        }
      });
    });
  }
}