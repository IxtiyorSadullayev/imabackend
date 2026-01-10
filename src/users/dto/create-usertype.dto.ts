import { ApiProperty } from "@nestjs/swagger";

export class CreateUserTypeDto{
    @ApiProperty()
    readonly role: string;

    @ApiProperty()
    readonly description: string;
}