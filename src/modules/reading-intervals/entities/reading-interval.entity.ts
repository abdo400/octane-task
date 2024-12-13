import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    ManyToOne, 
    JoinColumn, 
    CreateDateColumn,
    Index, 
    BeforeInsert,
    BeforeUpdate
  } from 'typeorm';
  import { User } from '../../users/entities/user.entity';
  import { Book } from '../../books/entities/book.entity';
  
  @Entity('reading_intervals')
  @Index(['user', 'book', 'startPage', 'endPage'])  // Composite index for efficient querying
  export class ReadingInterval {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => User, user => user.readingIntervals, { nullable: false })
    @JoinColumn({ name: 'user_id' })
    user: User;
  
    @Column({ name: 'user_id' })
    userId: number;
  
    @ManyToOne(() => Book, book => book.readingIntervals, { nullable: false })
    @JoinColumn({ name: 'book_id' })
    book: Book;
  
    @Column({ name: 'book_id' })
    bookId: number;
  
    @Column({ 
      type: 'int', 
      comment: 'Starting page of the reading interval' 
    })
    startPage: number;
  
    @Column({ 
      type: 'int', 
      comment: 'Ending page of the reading interval' 
    })
    endPage: number;
  
    @Column({ 
      type: 'int', 
      name: 'pages_read',
      comment: 'Total number of pages read in the interval',
      nullable: true,
      insert: false,
      update: false,
      readonly: true,
    })
    pagesRead: number;
  
    @CreateDateColumn({ 
      type: 'timestamp', 
      comment: 'Timestamp when the reading interval was recorded' 
    })
    createdAt: Date;

     // Calculate pagesRead before insert/update
    @BeforeInsert()
    @BeforeUpdate()
    calculatePagesRead() {
      if (this.startPage && this.endPage) {
        this.pagesRead = this.endPage - this.startPage;
      }
    }
  
    // Method to validate reading interval
    validateInterval() {
      if (this.startPage < 1) {
        throw new Error('Start page must be at least 1');
      }
  
      if (this.endPage < this.startPage) {
        throw new Error('End page must be greater than or equal to start page');
      }
  
      if (this.book && this.endPage > this.book.totalPages) {
        throw new Error('End page cannot exceed total book pages');
      }
    }
  }