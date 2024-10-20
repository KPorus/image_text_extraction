import {
  Controller,
  FileTypeValidator,
  HttpCode,
  Param,
  ParseFilePipe,
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
  @Post('/:id/image_data')
  addUserData(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image/jpeg' })],
      }),
    )
    file: Express.Multer.File,
    @Param() id: number,
    @Request() req: Request,
  ) {
    console.log(id, req.body['input']);
    console.log(file);
    // this.userService.uploadData(file, id, req.body['input']);
    return 'req';
  }
}
