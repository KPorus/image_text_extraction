import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  private readonly s3 = new S3Client({
    region: this.config.get('AWS_REGION'),
    credentials: {
      accessKeyId: this.config.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.config.get('AWS_SECRET_ACCESS_KEY'),
    },
  });

  constructor(private config: ConfigService) {}

  async uploadImage(file: Express.Multer.File) {
    const params: PutObjectCommandInput = {
      Bucket: this.config.get('BUCKET_NAME'),
      Key: file.originalname,
      Body: file.buffer,
      ContentType: file.mimetype,
      // ACL: 'public-read',
    };
    try {
      const response = await this.s3.send(new PutObjectCommand(params));
      if (response.$metadata.httpStatusCode === 200) {
        return `https://${params.Bucket}.s3.${this.config.get('AWS_REGION')}.amazonaws.com/${file.originalname}`;
      }
      throw new Error('Image not saved in s3!');
    } catch (err) {
      throw err;
    }
  }
}
