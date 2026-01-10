import { ApiProperty } from "@nestjs/swagger";

export class LoginDto{
    @ApiProperty()
    readonly login: string;

    @ApiProperty()
    readonly password: string;
    
}