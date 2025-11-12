import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from '../../generated/prisma';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    // Check if user already exists
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: createUserDto.email },
          { username: createUserDto.username },
        ],
      },
    });

    if (existingUser) {
      if (existingUser.email === createUserDto.email) {
        throw new ConflictException('Email already exists');
      }
      if (existingUser.username === createUserDto.username) {
        throw new ConflictException('Username already exists');
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 12);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
      select: {
        id: true,
        fullName: true,
        username: true,
        email: true,
        createdAt: true,
      },
    });

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return user;
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        username: true,
        email: true,
        createdAt: true,
      },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        fullName: true,
        username: true,
        email: true,
        createdAt: true,
        lojas: {
          select: {
            id: true,
            nome: true,
            descricao: true,
            createdAt: true,
          },
        },
        comments: {
          select: {
            id: true,
            title: true,
            content: true,
            published: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    // Check if user exists
    await this.findOne(id);

    if (updateUserDto.email || updateUserDto.username) {
      const existingUser = await this.prisma.user.findFirst({
        where: {
          AND: [
            { id: { not: id } },
            {
              OR: [
                ...(updateUserDto.email ? [{ email: updateUserDto.email }] : []),
                ...(updateUserDto.username ? [{ username: updateUserDto.username }] : []),
              ],
            },
          ],
        },
      });

      if (existingUser) {
        if (existingUser.email === updateUserDto.email) {
          throw new ConflictException('Email already exists');
        }
        if (existingUser.username === updateUserDto.username) {
          throw new ConflictException('Username already exists');
        }
      }
    }

    
    const data = { ...updateUserDto };
    if (updateUserDto.password) {
      data.password = await bcrypt.hash(updateUserDto.password, 12);
    }

    const user = await this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        fullName: true,
        username: true,
        email: true,
        createdAt: true,
      },
    });

    return user;
  }

  async remove(id: number) {
    // Check if user exists
    await this.findOne(id);

    await this.prisma.user.delete({
      where: { id },
    });

    return { message: `User with ID ${id} deleted successfully` };
  }
}
