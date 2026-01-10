import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty()
    readonly login: string;

    @ApiProperty()
    readonly password: string;

    @ApiProperty()
    readonly fullname: string;

    @ApiProperty()
    readonly birthday: string;

    @ApiProperty({type: "string", title: 'User qanday role ga ega ekanligi aniqlanadi.'})
    readonly userType: string;

    @ApiProperty({type: 'string', title: "User qaysi sinfga mansubligi kiritiladi."})
    readonly className: string;

    @ApiProperty()
    readonly phoneNumber: string;
} 
