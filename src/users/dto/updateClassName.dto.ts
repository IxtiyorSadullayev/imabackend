import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserClassnameDto{
    @ApiProperty()
    readonly classname_id: string;
}