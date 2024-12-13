import { Expose, Transform } from 'class-transformer';

export class RecommendedBooksDto {
  @Expose({ name: 'book_id' })
  @Transform(({ obj }) => obj.id.toString())
  book_id: string;

  @Expose({ name: 'book_name' })
  book_name: string;

  @Expose({ name: 'num_of_pages' })
  @Transform(({ obj }) => obj.totalPages.toString())
  num_of_pages: string;

  @Expose({ name: 'num_of_read_pages' })
  @Transform(({ obj }) => obj.totalPagesRead.toString())
  num_of_read_pages: string;
}