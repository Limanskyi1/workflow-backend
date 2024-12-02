import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {

    constructor(private prisma: PrismaService, private jwtService: JwtService) {}

    async register(email:string, password:string, name:string) {
        return `${email} ${password} ${name}`;
    }
}
