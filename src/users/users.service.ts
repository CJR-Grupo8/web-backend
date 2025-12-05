import { 
  Injectable, 
  ConflictException, 
  NotFoundException, 
  BadRequestException 
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// 1. Importação do novo DTO
import { ChangePasswordDto } from './dto/change-password.dto';
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

  // ---mudança de senha segura
  async changePassword(id: number, changePasswordDto: ChangePasswordDto) {
    const { oldPassword, newPassword } = changePasswordDto;

    // 1. Busca o usuário no banco 
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // se senha antiga bate com a do banco
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
      throw new BadRequestException('Senha antiga incorreta');
    }

    // Verifica se a nova senha é diferente da antiga
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      throw new BadRequestException('A nova senha deve ser diferente da senha atual');
    }
    // Criptografa a NOVA senha
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    //Salva a nova senha no banco
    await this.prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
      },
    });

    return { message: 'Senha alterada com sucesso' };
  }
  // --------------------------------------------

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