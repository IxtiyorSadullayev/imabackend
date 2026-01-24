import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsString } from "class-validator";

export class CreateYuqlamaDto {
    @ApiProperty()
    @IsString()
    readonly userid: string;

    @ApiProperty()
    @IsDate()
    readonly come: string;

}
