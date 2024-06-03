import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<void> {
    await this.userService.register(createUserDto);
  }
  @Get('verify-email/:username/:verificationToken')
  async verifyEmail(
    @Param('username') username: string,
    @Param('verificationToken') verificationToken: string,
  ): Promise<string> {
    const verified = await this.userService.verifyEmail(
      username,
      verificationToken,
    );
    if (!verified) {
      throw new BadRequestException('Invalid verification token');
    } else {
      return 'Email verified';
    }
  }
  @Get('check-verification/:username')
  async checkVerification(
    @Param('username') username: string,
  ): Promise<string> {
    const isVerified = await this.userService.checkVerification(username);
    if (!isVerified) {
      throw new NotFoundException('User is not verified');
    }
    return 'User is verified';
  }
}
