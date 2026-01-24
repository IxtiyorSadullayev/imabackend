import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsPhoneNumber, IsString } from "class-validator";

export class CreateUserDto {
    @ApiProperty()
    @IsString()
    readonly login: string;

    @ApiProperty()
    @IsString()
    readonly password: string;

    @ApiProperty()
    @IsString()
    readonly fullname: string;

    @ApiProperty()
    @IsDateString()
    readonly birthday: string;

    @ApiProperty()
    @IsString()
    readonly pas_seria: string;

    @ApiProperty()
    @IsString()
    readonly pas_number: string;
    
    @ApiProperty({ type: "string", title: 'User qanday role ga ega ekanligi aniqlanadi.' })
    readonly userType: string;

    @ApiProperty({ type: 'string', title: "User qaysi sinfga mansubligi kiritiladi." })
    readonly className: string;

    @ApiProperty()
    @IsPhoneNumber("UZ")
    readonly phoneNumber: string;
} 
    