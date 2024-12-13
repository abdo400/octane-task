import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException, ForbiddenException } from '@nestjs/common';
import { ReadingIntervalController } from '../reading-intervals.controller';
import { ReadingIntervalService } from '../reading-intervals.service';
import {
  CreateReadingIntervalDto,
  ReadingIntervalResponseDto,
} from '../dto/reading-interval.dto';
import { JwtAuthGuard } from './../../users/guards/jwt-auth.guard';

describe('ReadingIntervalController', () => {
  let controller: ReadingIntervalController;
  let service: ReadingIntervalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReadingIntervalController],
      providers: [
        {
          provide: ReadingIntervalService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: jest.fn().mockResolvedValue(true), // Default: authenticated user
      })
      .compile();

    controller = module.get<ReadingIntervalController>(
      ReadingIntervalController,
    );
    service = module.get<ReadingIntervalService>(ReadingIntervalService);
  });

  describe('create', () => {
    it('should successfully create a reading interval', async () => {
      const createDto: CreateReadingIntervalDto = {
        user_id: 1,
        book_id: 1,
        start_page: 120,
        end_page: 160,
      };
      const expectedResponse: ReadingIntervalResponseDto =
        new ReadingIntervalResponseDto('success');

      // Mock the service's create method to return successfully
      jest.spyOn(service, 'create').mockResolvedValue(undefined);

      // Test the controller method
      expect(await controller.create(createDto)).toEqual(expectedResponse);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });

    it('should throw an InternalServerErrorException if creation fails', async () => {
      const createDto: CreateReadingIntervalDto = {
        user_id: 1,
        book_id: 1,
        start_page: 120,
        end_page: 160,
      };
      const error = new Error('Failed to create a reading interval');

      // Mock the service's create method to throw an error
      jest.spyOn(service, 'create').mockRejectedValue(error);

      try {
        await controller.create(createDto);
      } catch (e) {
        expect(e).toBeInstanceOf(InternalServerErrorException);
        expect(e.response.message).toBe('Failed to create a reading interval');
      }
    });

    it('should throw a ForbiddenException if the user is not authenticated', async () => {
      const createDto: CreateReadingIntervalDto = {
        user_id: 1,
        book_id: 1,
        start_page: 120,
        end_page: 160,
      };

      // Mock JwtAuthGuard to deny access
      jest.spyOn(JwtAuthGuard.prototype, 'canActivate').mockResolvedValue(false);

      try {
        await controller.create(createDto);
      } catch (e) {
        expect(e).toBeInstanceOf(ForbiddenException); // Forbidden because authentication failed
        expect(e.message).toBe('Forbidden resource');
      }
    });
  });
});
