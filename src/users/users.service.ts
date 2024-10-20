import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { S3Service } from '../s3/s3.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly s3Service: S3Service,
    private prisma: PrismaService,
  ) {}

  async uploadData(file: Express.Multer.File, id: number, content: string) {
    // Upload the image to S3 and get the image URL
    const upload = await this.s3Service.uploadImage(file);
    // Create a new data entry in the database
    await this.prisma.data.create({
      data: {
        imageUrl: upload, // Assuming upload.Location contains the URL of the uploaded image
        content: content, // The content to be associated with the data entry
        userId: id, // The user ID associated with the data entry
      },
    });

    return { message: 'Image uploaded successfully.' };
  }
}
