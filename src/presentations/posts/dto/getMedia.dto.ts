import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class GetMediaQueryDto {
  @IsOptional()
  @IsString()
  searchQuery?: string = '';
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  page: number = 1;
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit: number = 9;
}

export class GetUserMediaParamsDto {
  @IsNotEmpty()
  userId: string;
}