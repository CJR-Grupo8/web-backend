import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLojaDto } from './dto/create-loja.dto';
import { UpdateLojaDto } from './dto/update-loja.dto';

@Injectable()
export class LojasService {
  constructor(private prisma: PrismaService) {}

  async create(createLojaDto: CreateLojaDto) {
    // Verify user exists
    const user = await this.prisma.user.findUnique({
      where: { id: createLojaDto.donoId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${createLojaDto.donoId} not found`);
    }

    const loja = await this.prisma.loja.create({
      data: createLojaDto,
      include: {
        dono: {
          select: {
            id: true,
            fullName: true,
            username: true,
            email: true,
          },
        },
      },
    });

    return loja;
  }

  async findAll() {
    return this.prisma.loja.findMany({
      include: {
        dono: {
          select: {
            id: true,
            fullName: true,
            username: true,
          },
        },
        produtos: {
          select: {
            id: true,
            nome: true,
            preco: true,
            estoque: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const loja = await this.prisma.loja.findUnique({
      where: { id },
      include: {
        dono: {
          select: {
            id: true,
            fullName: true,
            username: true,
            email: true,
          },
        },
        produtos: {
          select: {
            id: true,
            nome: true,
            preco: true,
            descricao: true,
            estoque: true,
            createdAt: true,
          },
        },
      },
    });

    if (!loja) {
      throw new NotFoundException(`Loja with ID ${id} not found`);
    }

    return loja;
  }

  async update(id: number, updateLojaDto: UpdateLojaDto) {
    // Check if loja exists
    await this.findOne(id);

    const loja = await this.prisma.loja.update({
      where: { id },
      data: updateLojaDto,
      include: {
        dono: {
          select: {
            id: true,
            fullName: true,
            username: true,
          },
        },
      },
    });

    return loja;
  }

  async remove(id: number) {
    // Check if loja exists
    await this.findOne(id);

    await this.prisma.loja.delete({
      where: { id },
    });

    return { message: `Loja with ID ${id} deleted successfully` };
  }

  async findByDono(donoId: number) {
    return this.prisma.loja.findMany({
      where: { donoId },
      include: {
        produtos: {
          select: {
            id: true,
            nome: true,
            preco: true,
            estoque: true,
          },
        },
      },
    });
  }
}
