import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ClientProxy, EventPattern } from '@nestjs/microservices';
import { HttpService } from '@nestjs/axios';
import { NotFoundError } from 'rxjs';

@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private httpService: HttpService,
  ) {}

  // Event pattern
  @EventPattern('product_created')
  async ProductCreated(product: any) {
    this.productService.create(product);
  }

  @EventPattern('product_updated')
  async ProductUpdated(product: any) {
    console.log(product);
    this.productService.update(product.id, product);
  }
  @EventPattern('product_deleted')
  async ProductDeleted(id: any) {
    this.productService.remove(id);
  }

  @Post(':id/like')
  async like(@Param('id') id: string) {
    const product = await this.productService.findOne(+id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }
    // Update in admin app

    this.httpService
      .post(`http://localhost:8000/api/products/${id}/like`, {})
      .subscribe((res) => {
        console.log(res.data);
      });

    return await this.productService.update(+id, {
      likes: product.likes + 1,
    });
  }

  // Service methods
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
