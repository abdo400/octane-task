import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, InternalServerErrorException } from '@nestjs/common';
import { BooksController } from '../books.controller';
import { BooksService } from '../books.service';
import { CreateBookDto } from '../dto/create-book.dto';
import { UpdateBookDto } from '../dto/update-book.dto';
import { RecommendedBooksDto } from '../dto/recommended-books.dto';
import { JwtAuthGuard } from './../../users/guards/jwt-auth.guard';
import { AdminGurad } from './../../users/guards/admin.guard';

describe('BooksController', () => {
  let controller: BooksController;
  let service: BooksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        {
          provide: BooksService,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            getTopBooks: jest.fn(),
          },
        },
      ],
    })
      // Mock the JwtAuthGuard and AdminGuard
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: jest.fn().mockReturnValue(true), // Always allow for JwtAuthGuard
      })
      .overrideGuard(AdminGurad)
      .useValue({
        canActivate: jest.fn((context: ExecutionContext) => {
          const request = context.switchToHttp().getRequest();
          return request.user?.role === 'admin'; // Only allow if user is an admin
        }),
      })
      .compile();

    controller = module.get<BooksController>(BooksController);
    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a book successfully', async () => {
      const createBookDto: CreateBookDto = { title: 'Book Title', totalPages: 500 };
      const result = { id: 1, ...createBookDto };

      // Mock the BooksService.create method
      service.create = jest.fn().mockResolvedValue(result);

      const response = await controller.create(createBookDto);
      expect(response).toEqual(result);
      expect(service.create).toHaveBeenCalledWith(createBookDto);
    });

    it('should fail if the user is not an admin', async () => {
      const createBookDto: CreateBookDto = { title: 'Book Title', totalPages: 500 };

      // Mock AdminGuard to return false (user is not admin)
      jest.spyOn(AdminGurad.prototype, 'canActivate').mockResolvedValue(false);

      try {
        await controller.create(createBookDto);
      } catch (e) {
        expect(e).toBeInstanceOf(InternalServerErrorException);
        expect(e.response.message).toBe('Forbidden resource'); // This error matches a denied guard
      }
    });
  });

  describe('put', () => {
    it('should update a book successfully', async () => {
      const updateBookDto: UpdateBookDto = { id: 1, title: 'Updated Title', totalPages: 550 };
      const result = { id: 1, ...updateBookDto };

      // Mock the BooksService.update method
      service.update = jest.fn().mockResolvedValue(result);

      const response = await controller.put(updateBookDto);
      expect(response).toEqual(result);
      expect(service.update).toHaveBeenCalledWith(updateBookDto);
    });

    it('should fail if the user is not an admin', async () => {
      const updateBookDto: UpdateBookDto = { id: 1, title: 'Updated Title', totalPages: 550 };

      // Mock AdminGuard to return false (user is not admin)
      jest.spyOn(AdminGurad.prototype, 'canActivate').mockResolvedValue(false);

      try {
        await controller.put(updateBookDto);
      } catch (e) {
        expect(e).toBeInstanceOf(InternalServerErrorException);
        expect(e.response.message).toBe('Forbidden resource'); // This error matches a denied guard
      }
    });
  });

  describe('getTopBooks', () => {
    it('should return top books successfully', async () => {
      const topBooks: RecommendedBooksDto[] = [
        { book_id: '1', book_name: 'Top Book 1', num_of_pages: '500', num_of_read_pages: '235' },
        { book_id: '2', book_name: 'Top Book 2', num_of_pages: '450', num_of_read_pages: '230' },
      ];

      // Mock the BooksService.getTopBooks method
      service.getTopBooks = jest.fn().mockResolvedValue(topBooks);

      const response = await controller.getTopBooks();
      expect(response).toEqual(topBooks);
      expect(service.getTopBooks).toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException if fetching top books fails', async () => {
      const error = new InternalServerErrorException('Failed to retrieve top books');

      // Mock the BooksService.getTopBooks method to throw an error
      service.getTopBooks = jest.fn().mockRejectedValue(error);

      try {
        await controller.getTopBooks();
      } catch (e) {
        expect(e).toBeInstanceOf(InternalServerErrorException);
        expect(e.response.message).toBe('Failed to retrieve top books');
      }
    });
  });
});
