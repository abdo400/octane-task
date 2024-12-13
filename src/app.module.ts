import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/users/users.module';
import { BooksModule } from './modules/books/books.module';
import { ReadingIntervalModule } from './modules/reading-intervals/reading-intervals.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/users/entities/user.entity';
import { Book } from './modules/books/entities/book.entity';
import { ReadingInterval } from './modules/reading-intervals/entities/reading-interval.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',  // or 'mysql', 'mariadb', etc.
      host:  process.env.DB_HOST ?? 'postgres', // Your DB host
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,  // Your DB port
      username: process.env.DB_USERNAME ?? 'postgres',  // DB username
      password: process.env.DB_PASSWORD ?? 'postgres',  // DB password
      database: process.env.DB ?? 'reading_recommendation',  // DB name
      entities: [User, Book, ReadingInterval],  // Include your entities here
      synchronize: true, // Don't use in production
    }),
    UserModule,
    BooksModule,
    ReadingIntervalModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
