import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { IsUnique } from 'src/validate/validate.service';
// import { IsUnique } from '../../prisma/is_unique_prisma_validators';
export class ILoginBody {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  pass: string;
}

export class IRegisterBody {
  @IsString()
  first_name: string;
  @IsString()
  last_name: string;

  @IsString()
  @IsNotEmpty()
  @IsUnique({ message: 'Username is already taken' })
  username: string;

  @IsEmail()
  @IsNotEmpty()
  @IsString()
  @IsUnique({ message: 'Email is already register' })
  email: string;
  @IsNotEmpty()
  @IsString()
  pass: string;
}
