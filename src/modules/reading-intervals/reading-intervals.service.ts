import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { ReadingInterval } from './entities/reading-interval.entity';
import { CreateReadingIntervalDto } from './dto/reading-interval.dto';
import { Book } from '../books/entities/book.entity';
import { BooksService } from '../books/books.service';

@Injectable()
export class ReadingIntervalService {
  constructor(
    @InjectRepository(ReadingInterval)
    private readingIntervalRepository: Repository<ReadingInterval>,
    private readonly dataSource: DataSource,

  ) {}

  async create(dto: CreateReadingIntervalDto): Promise<ReadingInterval> {
    return await this.dataSource.transaction(async (entityManager: EntityManager) => {
      // Convert DTO to entity-like object
      const readingIntervalData = dto.toEntity();

      // Create and save the reading interval within the transaction
      const readingInterval = entityManager.create(ReadingInterval, readingIntervalData);
      await entityManager.save(ReadingInterval, readingInterval);

      // Update the book's totalPagesRead within the transaction
      await this.updateBookTotalPagesRead(
        entityManager,
        readingInterval.bookId,
        readingInterval.pagesRead,
      );

      return readingInterval;
    });
  }

  private async updateBookTotalPagesRead(
    entityManager: EntityManager,
    bookId: number,
    pagesRead: number,
  ): Promise<void> {
    // Assume there is a `Book` entity and its repository
    await entityManager.increment(
      'Book',
      { id: bookId },
      'totalPagesRead',
      pagesRead,
    );
  }

}

