import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { DDGQueryParams } from './dto/query-params.dto';

@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get()
  async getRelatedTopics(@Query() params: DDGQueryParams) {
    const { q } = params;
    return await this.searchService.performSearch(q);
  }

  @Get('/history')
  async getHistory() {
    return await this.searchService.getHistory();
  }

  @Get('/history/remove')
  async removeHistory() {
    return await this.searchService.clearHistory();
  }
}
