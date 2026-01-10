import { ApiProperty } from "@nestjs/swagger";

export class UpdateLoginAndPasswordDto{
    @ApiProperty()
    readonly login: string;
    @ApiProperty()
    readonly password: string;
}