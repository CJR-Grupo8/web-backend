import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto) {
    // Check if author exists
    const author = await this.prisma.user.findUnique({
      where: { id: createPostDto.authorId },
    });

    if (!author) {
      throw new NotFoundException(`User with ID ${createPostDto.authorId} not found`);
    }

    const post = await this.prisma.post.create({
      data: createPostDto,
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            username: true,
            email: true,
          },
        },
      },
    });

    return post;
  }

  async findAll() {
    return this.prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            username: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            username: true,
            email: true,
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    // Check if post exists
    await this.findOne(id);

    const post = await this.prisma.post.update({
      where: { id },
      data: updatePostDto,
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            username: true,
            email: true,
          },
        },
      },
    });

    return post;
  }

  async remove(id: number) {
    // Check if post exists
    await this.findOne(id);

    await this.prisma.post.delete({
      where: { id },
    });

    return { message: `Post with ID ${id} deleted successfully` };
  }

  async findByAuthor(authorId: number) {
    // Check if author exists
    const author = await this.prisma.user.findUnique({
      where: { id: authorId },
    });

    if (!author) {
      throw new NotFoundException(`User with ID ${authorId} not found`);
    }

    return this.prisma.post.findMany({
      where: { authorId },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            username: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
