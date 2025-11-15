import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class ContactItemDto {
  @ApiPropertyOptional({ description: 'Type of contact (e.g., linkedin, github, email, phone, website)', example: 'linkedin' })
  @IsString()
  type: string;

  @ApiPropertyOptional({ description: 'Value of the contact (e.g., URL, email address, phone number)', example: 'https://linkedin.com/in/username' })
  @IsString()
  value: string;
}

export class UpdateContactDto {
  @ApiPropertyOptional({
    description: 'Contact information (array of contact items)',
    type: [ContactItemDto],
    example: [
      { type: 'linkedin', value: 'https://linkedin.com/in/username' },
      { type: 'github', value: 'https://github.com/username' },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContactItemDto)
  contact?: ContactItemDto[] | null;

  @ApiPropertyOptional({ description: 'Whether to show contact', default: false, example: false })
  @IsOptional()
  @IsBoolean()
  showContact?: boolean;
}