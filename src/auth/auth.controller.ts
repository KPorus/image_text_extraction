import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ILoginBody, IRegisterBody } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  login(@Body() dto: ILoginBody) {
    return this.authService.login(dto);
  }
  @Post('/register')
  register(@Body() dto: IRegisterBody) {
    return this.authService.register(dto);
  }
}
