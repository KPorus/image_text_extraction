import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { S3Service } from '../s3/s3.service';
import { EncryptoService } from 'src/encrypto/encrypto.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly s3Service: S3Service,
    private prisma: PrismaService,
    private readonly encrypt: EncryptoService,
  ) {}

  async uploadData(file: Express.Multer.File, id: number) {
    const upload = await this.s3Service.uploadImage(file);
    await this.prisma.data.create({
      data: {
        imageUrl: upload,
        content: '',
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
    if (userData && !userData.content) {
      try {
        const imageProcess = await this.s3Service.processAndBlurImage(
          userData.imageUrl.split('/')[urlParts - 1],
          content,
        );

        if (imageProcess.URL) {
          await this.prisma.data.update({
            where: {
              id: dataId,
            },
            data: {
              imageUrl: imageProcess.URL,
              content: this.encrypt.encrypt(content),
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

  // async test(id: number) {
  //   // const ccd = await this.prisma.data.findUnique({
  //   //   where: {
  //   //     id: id,
  //   //   },
  //   // });
  //   // console.log(ccd.content);
  //   console.log(
  //     this.encrypt.decrypt(
  //       '55c52c65128e5eeb7742448d0bde26ba:1012b316b327bc7074f1077ed2799ca2:a10bcca461c45947648cad',
  //     ),
  //   );
  // }
}
