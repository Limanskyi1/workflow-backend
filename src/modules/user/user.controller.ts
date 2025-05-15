import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/сhange-password.dto';
import { UserId } from 'src/common/decorators/user-id.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@UserId() userId: number) {
    return this.userService.getMe(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  async changePassword(
    @UserId() userId: number,
    @Body() body: ChangePasswordDto,
  ) {
    const { currentPassword, newPassword } = body;
    return this.userService.changePassword(
      userId,
      currentPassword,
      newPassword,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) userId: number,
    @Body() dto: UpdateUserDto,
  ) {
    return this.userService.update(userId, dto);
  }
}
