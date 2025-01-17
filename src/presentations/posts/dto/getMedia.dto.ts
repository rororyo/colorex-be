import { IsNotEmpty } from "class-validator";

export class GetMediaParamsDto {
  @IsNotEmpty()
  page: number;
  @IsNotEmpty()
  limit: number;
}