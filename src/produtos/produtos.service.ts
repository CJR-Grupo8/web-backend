import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';

@Injectable()
export class ProdutosService {
  constructor(private prisma: PrismaService) {}

  async create(createProdutoDto: CreateProdutoDto) {
    // Verify loja exists
    const loja = await this.prisma.loja.findUnique({
      where: { id: createProdutoDto.lojaId },
    });

    if (!loja) {
      throw new NotFoundException(`Loja with ID ${createProdutoDto.lojaId} not found`);
    }

    const produto = await this.prisma.produto.create({
      data: createProdutoDto,
      include: {
        loja: {
          select: {
            id: true,
            nome: true,
            dono: {
              select: {
                id: true,
                fullName: true,
                username: true,
              },
            },
          },
        },
      },
    });

    return produto;
  }

  async findAll() {
    return this.prisma.produto.findMany({
      include: {
        loja: {
          select: {
            id: true,
            nome: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const produto = await this.prisma.produto.findUnique({
      where: { id },
      include: {
        loja: {
          select: {
            id: true,
            nome: true,
            descricao: true,
            dono: {
              select: {
                id: true,
                fullName: true,
                username: true,
              },
            },
          },
        },
      },
    });

    if (!produto) {
      throw new NotFoundException(`Produto with ID ${id} not found`);
    }

    return produto;
  }

  async update(id: number, updateProdutoDto: UpdateProdutoDto) {
    // Check if produto exists
    await this.findOne(id);

    const produto = await this.prisma.produto.update({
      where: { id },
      data: updateProdutoDto,
      include: {
        loja: {
          select: {
            id: true,
            nome: true,
          },
        },
      },
    });

    return produto;
  }

  async remove(id: number) {
    // Check if produto exists
    await this.findOne(id);

    await this.prisma.produto.delete({
      where: { id },
    });

    return { message: `Produto with ID ${id} deleted successfully` };
  }

  async findByLoja(lojaId: number) {
    return this.prisma.produto.findMany({
      where: { lojaId },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
