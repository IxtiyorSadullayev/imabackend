import { ApiProperty } from "@nestjs/swagger";

export class CreateClassNameDto{
    @ApiProperty()
    readonly classname: string;

    @ApiProperty()
    readonly description: string;
}