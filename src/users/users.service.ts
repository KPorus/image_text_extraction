import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { S3Service } from '../s3/s3.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly s3Service: S3Service,
    private prisma: PrismaService,
  ) {}

  async uploadData(file: Express.Multer.File, id: number) {
    const upload = await this.s3Service.uploadImage(file);
    console.log(id);
    await this.prisma.data.create({
      data: {
        imageUrl: upload,
        content: ' ',
        userId: id,
      },
    });
    return { url: `${upload}`, message: 'Image uploaded successfully.' };
  }

  async compareImagesWithId(dataId: number, userId: number, content: string) {
    const userData = await this.prisma.data.findUnique({
      where: { id: dataId },
    });

    const urlParts = userData.imageUrl.split('/').length;
    if (userData && userData.content === '') {
      try {
        const imageProcess = await this.s3Service.processAndBlurImage(
          userData.imageUrl.split('/')[urlParts - 1],
          content,
        );

        console.log(imageProcess.status === 200);
        if (imageProcess.URL) {
          await this.prisma.data.update({
            where: {
              id: dataId,
            },
            data: {
              imageUrl: imageProcess.URL,
              content: content,
              userId: Number(userId),
            },
          });

          return { message: `${imageProcess.message}. Data saved in database` };
        }
        return { message: `${imageProcess.message}` };
      } catch (error) {
        return error;
      }
    }
    return { message: 'Content already checked out' };
  }
}
