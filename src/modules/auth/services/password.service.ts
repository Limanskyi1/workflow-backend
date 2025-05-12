import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  comparePassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }
}
