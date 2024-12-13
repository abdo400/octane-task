import { IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateReadingIntervalDto {
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  @IsInt({ message: 'User ID must be an integer' })
  user_id: number;

  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  @IsInt({ message: 'User ID must be an integer' })
  book_id: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: 'Start page must be an integer' })
  @Min(1, { message: 'Start page must be at least 1' })
  start_page: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: 'End page must be an integer' })
  @Min(1, { message: 'End page must be at least 1' })
  end_page: number;

  // Method to convert DTO to entity-like object
  toEntity?() {
    if (this.end_page < this.start_page) {
      throw new Error('End page must be greater than or equal to start page');
    } else if (this.end_page === this.start_page) {
      throw new Error('User didn\'t read anything');
    }

    return {
      user: { id: this.user_id },
      book: { id: this.book_id },
      userId: this.user_id,
      bookId: this.book_id,
      startPage: this.start_page,
      endPage: this.end_page,
    };
  }
}

// Response DTO
export class ReadingIntervalResponseDto {
  status_code: 'success' | 'error';
  
  constructor(status: 'success' | 'error' = 'success') {
    this.status_code = status;
  }
}