import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  OneToMany,
  Index
} from 'typeorm';
import { ReadingInterval } from '../../reading-intervals/entities/reading-interval.entity';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ 
    length: 255,
    comment: 'Title of the book' 
  })
  @Index()
  title: string;

  @Column({ 
    type: 'int',
    comment: 'Total number of pages in the book' 
  })
  totalPages: number;

  @Column({ 
    type: 'int', 
    default: 0,
    comment: 'Total number of pages read across all reading intervals' 
  })
  totalPagesRead: number;

  @Column({ 
    default: true,
    comment: 'Indicates if the book is available in the system' 
  })
  isActive: boolean;

  // Relationships
  @OneToMany(() => ReadingInterval, readingInterval => readingInterval.book)
  readingIntervals: ReadingInterval[];

  // Method to soft delete book
  softDelete() {
    this.isActive = false;
  }

  // Validate book data
  validate() {
    if (this.totalPages <= 0) {
      throw new Error('Total pages must be greater than zero');
    }

    if (!this.title) {
      throw new Error('Book title is required');
    }
  }
}