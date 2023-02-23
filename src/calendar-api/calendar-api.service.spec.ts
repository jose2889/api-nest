import { Test, TestingModule } from '@nestjs/testing';
import { CalendarApiService } from './calendar-api.service';

describe('CalendarApiService', () => {
  let service: CalendarApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CalendarApiService],
    }).compile();

    service = module.get<CalendarApiService>(CalendarApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
