import { Controller, Post, Body, UsePipes, ValidationPipe, InternalServerErrorException, Logger, UseGuards } from '@nestjs/common';
import { CreateReadingIntervalDto, ReadingIntervalResponseDto } from './dto/reading-interval.dto';
import { ReadingIntervalService } from './reading-intervals.service';
import { UserGuard } from '../users/guards/user.guard';
import { JwtAuthGuard } from '../users/guards/jwt-auth.guard';

@Controller('reading-intervals')
export class ReadingIntervalController {
    private readonly logger = new Logger(ReadingIntervalController.name);
    constructor(private readonly readingIntervalService: ReadingIntervalService) {}

  @Post()
  @UseGuards(JwtAuthGuard, UserGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(
    @Body() dto: CreateReadingIntervalDto
  ): Promise<ReadingIntervalResponseDto> {
    try {
      await this.readingIntervalService.create(dto);
      return new ReadingIntervalResponseDto('success');
    } catch (error) {
      // Log the error, handle it appropriately
      // this.logger.error('Failed to create a reading interval', error.stack);
      throw new InternalServerErrorException(error);
    }
  }
}