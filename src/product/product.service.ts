import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

interface Props {
  page: number;
  itemsPerPage: number;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}

@Injectable()
export class ProductService {
  constructor(private readonly _prismaService: PrismaService) {}

  async find({ page, itemsPerPage, search, minPrice, maxPrice }: Props) {
    const skip = (page - 1) * itemsPerPage;
    const where = {
      name: {
        contains: search,
      },
    };

    if (minPrice !== undefined) {
      Object.assign(where, { price: { gte: +minPrice } });
    }

    if (maxPrice !== undefined) {
      Object.assign(where, { price: { lte: +maxPrice } });
    }

    const [items, totalItems] = await Promise.all([
      this._prismaService.product.findMany({
        take: +itemsPerPage,
        skip,
        where,
      }),
      this._prismaService.product.count({
        where,
      }),
    ]);
    const currentItemCount = items.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return {
      currentItemCount,
      itemsPerPage,
      totalItems,
      totalPages,
      items,
    };
  }

  async create(data: any) {
    return await this._prismaService.product.create({
      data: data,
    });
  }
}
