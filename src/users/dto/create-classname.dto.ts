import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateClassNameDto{
    @ApiProperty()
    @IsString()
    readonly classname: string;

    @ApiProperty()
    @IsString()
    readonly description: string;
}