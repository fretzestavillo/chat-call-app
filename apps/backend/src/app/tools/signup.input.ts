import { IsString } from 'class-validator';

export class SignUpInput {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;
}
