import { IsArray, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class CreateContactDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber(undefined)
  mobile: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
