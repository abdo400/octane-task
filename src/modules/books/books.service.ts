import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { RecommendedBooksDto } from './dto/recommended-books.dto';
import { plainToClass } from 'class-transformer';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly booksRepository: Repository<Book>,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const book = this.booksRepository.create(createBookDto);
    return this.booksRepository.save(book);
  }

  async update(updateBookDto: UpdateBookDto): Promise<Book> {
    // Step 1: Find the existing book
    const book = await this.booksRepository.findOne({ where: { id: updateBookDto.id } });
  
    if (!book) {
      throw new Error('Book not found');
    }
  
    // Step 2: Update the book's properties
    if (updateBookDto.title) {
      book.title = updateBookDto.title;
    }
    if (updateBookDto.totalPages) {
      book.totalPages = updateBookDto.totalPages;
    }
    if (updateBookDto.totalPagesRead) {
      book.totalPagesRead = updateBookDto.totalPagesRead;
    }
  
    // Step 3: Save the updated book
    return this.booksRepository.save(book);
  }
  

  async getTopBooks(): Promise<RecommendedBooksDto[]> {
    const books = await this.booksRepository.find({
      order: { totalPagesRead: 'DESC' },
      take: 5,
    });

    return books.map(book => 
      plainToClass(RecommendedBooksDto, book, { 
        excludeExtraneousValues: true 
      })
    );
  }
}
