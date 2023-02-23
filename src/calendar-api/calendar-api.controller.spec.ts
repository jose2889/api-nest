import { Test, TestingModule } from '@nestjs/testing';
import { CalendarApiController } from './calendar-api.controller';
import { CalendarApiService } from './calendar-api.service';

describe('CalendarApiController', () => {
  let controller: CalendarApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CalendarApiController],
      providers: [CalendarApiService],
    }).compile();

    controller = module.get<CalendarApiController>(CalendarApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
