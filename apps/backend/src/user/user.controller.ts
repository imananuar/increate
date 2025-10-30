import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';

@Controller('/api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/getUserByEmail')
  getUserByEmail(@Body() request: any) {
    console.log(request.email);
    return this.userService.getUserByEmail(request.email);
  }

  @Get('/getCurrentUser')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@Req() req: Request) {
    const user = req.user as any;
    if (user.email) {
      return await this.userService.getUserByEmail(user.email);
    }
  }
}
