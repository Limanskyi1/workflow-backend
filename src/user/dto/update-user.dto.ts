import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
