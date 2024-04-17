import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, productDocument } from './entities/product.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<productDocument>,
  ) {}
  async create(createProductDto: CreateProductDto) {
    return await this.productModel.create(createProductDto);
  }

  async findAll() {
    return await this.productModel.find().exec();
  }

  async findOne(id: number) {
    const foundProduct = await this.productModel.findOne({ id });
    return foundProduct;
  }

  // note that we use id rather than _id to match event pattern
  async update(id: number, updateProductDto: UpdateProductDto) {
    return await this.productModel.updateOne({ id: id }, updateProductDto);
  }

  async remove(id: number) {
    return await this.productModel.deleteOne({ id: id });
  }
}
