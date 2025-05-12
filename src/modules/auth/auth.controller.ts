import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: { email: string; password: string; name: string }) {
    const { email, password, name } = dto;
    return this.authService.registerWithCode(email, password, name);
  }

  @Post('confirm')
  confirm(@Body() dto: { email: string; code: string }) {
    const { email, code } = dto;
    return this.authService.confirmRegistrationCode(email, code);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const { email, password } = dto;
    return this.authService.login(email, password);
  }

  @Post('refresh')
  async refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }
}
