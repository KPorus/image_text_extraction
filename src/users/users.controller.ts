import {
  Controller,
  FileTypeValidator,
  HttpCode,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtGuard } from 'src/auth/guard';
import { UsersService } from './users.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file'))
  @Post('/upload/:id')
  uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image/jpeg' })],
      }),
    )
    file: Express.Multer.File,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const result = this.userService.uploadData(file, id);
    return result;
  }

  @HttpCode(200)
  @Post('/add/:id')
  compareUserData(@Param('id', ParseIntPipe) id: number, @Request() res) {
    const result = this.userService.compareImagesWithId(
      id,
      res.body.userId,
      res.body.input,
    );
    return result;
  }
}
