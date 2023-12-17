import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly _productService: ProductService) {}

  @Get()
  async find(
    @Query('page') page: number = 1,
    @Query('itemsPerPage') itemsPerPage: number = 5,
    @Query('search') search: string,
    @Query('minPrice') minPrice: number,
    @Query('maxPrice') maxPrice: number,
  ) {
    return {
      status: 'success',
      data: await this._productService.find({
        page,
        itemsPerPage,
        search,
        minPrice,
        maxPrice,
      }),
    };
  }

  @Post()
  async create(@Body() body: any) {
    return await this._productService.create(body);
  }
}
