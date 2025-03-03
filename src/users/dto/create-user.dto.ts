import { isString, isNotEmpty, isEmail, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsOptional
  @isString
  id?: string;

  @isString()
  @isNotEmpty()
  name: string;

  @isEmail()
  @isString()
  @isNotEmpty()
  email: string;

  @isString()
  @isNotEmpty()
  password: string;

  @isString()
  @isNotEmpty
  phone: string;

  @IsOptional()
  @isString()
  createdAt?: string;
}
