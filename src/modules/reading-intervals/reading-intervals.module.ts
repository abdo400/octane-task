import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReadingIntervalController } from './reading-intervals.controller';
import { ReadingInterval } from './entities/reading-interval.entity';
import { ReadingIntervalService } from './reading-intervals.service';
import { Book } from '../books/entities/book.entity';
import { BooksModule } from '../books/books.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReadingInterval, Book]),
    BooksModule,
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET,
      signOptions: { expiresIn: '60m' },
    }),
  ],
  controllers: [ReadingIntervalController],
  providers: [ReadingIntervalService],
  exports: [ReadingIntervalService],
})
export class ReadingIntervalModule {}
