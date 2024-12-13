import { Controller, Get, Post, Body, InternalServerErrorException, Logger, Put, UseGuards } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { RecommendedBooksDto } from './dto/recommended-books.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { AdminGurad } from '../users/guards/admin.guard';
import { JwtAuthGuard } from '../users/guards/jwt-auth.guard';


@Controller('books')
export class BooksController {
  private readonly logger = new Logger(BooksController.name);

  constructor(private readonly booksService: BooksService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard, AdminGurad)
  create(@Body() createBookDto: CreateBookDto) {
    try {
      return this.booksService.create(createBookDto);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create book');
    }
  }

  @Put('update')
  @UseGuards(JwtAuthGuard, AdminGurad)
  put(@Body() updateBookDto: UpdateBookDto) {
    try {
      return this.booksService.update(updateBookDto);
    } catch (error) {
      throw new InternalServerErrorException('Failed to update book');
    }
  }

  @Get('top')
  async getTopBooks(): Promise<RecommendedBooksDto[]> {
    try {
      return this.booksService.getTopBooks();
    } catch (error) {
      // Log the error
      this.logger.error('Failed to retrieve top books', error.stack);

      // Throw an HttpException that will be caught by NestJS exception filter
      throw new InternalServerErrorException(
        'Failed to retrieve top books'
      );
    }
  }
}
