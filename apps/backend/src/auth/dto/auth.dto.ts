import { UserDto } from "src/user/dto/user.dto";

export class AuthResponseDto {
    access_token: string;
    user: UserDto
}