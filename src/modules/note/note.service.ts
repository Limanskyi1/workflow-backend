import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';

@Injectable()
export class NoteService {
  constructor(private readonly prisma: PrismaService) {}

  create(createNoteDto: CreateNoteDto, userId: number) {
    const data = {
      ...createNoteDto,
      userId,
    };
    return this.prisma.note.create({ data });
  }

  findAll(userId: number) {
    return this.prisma.note.findMany({ where: { userId } });
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} note`;
  // }

  // update(id: number, updateNoteDto: UpdateNoteDto) {
  //   return `This action updates a #${id} note`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} note`;
  // }
}
