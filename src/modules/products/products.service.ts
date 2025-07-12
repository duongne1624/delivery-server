import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '@entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { removeVietnameseTones } from '@common/utils/normalize.util';
import { FileUploadService } from '@shared/file-upload/file-upload.service';
import { isImageUrl } from '@common/utils/valid-image.util';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly fileUploadService: FileUploadService
  ) {}

  async create(
    dto: CreateProductDto,
    file?: Express.Multer.File
  ): Promise<Product> {
    let image = dto.image;
    let image_public_id = dto.image_public_id;

    if (file && dto.image) {
      throw new BadRequestException(
        'Chỉ được chọn 1 trong 2: file hoặc URL ảnh'
      );
    }

    if (file) {
      const uploaded =
        await this.fileUploadService.uploadImageToCloudinary(file);
      image = uploaded.secure_url;
      image_public_id = uploaded.public_id;
    }

    if (dto.image && !file) {
      const isValid = await isImageUrl(dto.image);
      if (!isValid) {
        throw new BadRequestException('Image URL không hợp lệ');
      }
      image = dto.image;
      image_public_id = '-1';
    }

    const newProduct = this.productRepo.create({
      ...dto,
      image,
      image_public_id,
    });

    return this.productRepo.save(newProduct);
  }

  async findAll(): Promise<Product[]> {
    return this.productRepo.find({ relations: ['category', 'restaurant'] });
  }

  async findById(id: string): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['category', 'restaurant'],
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(
    id: string,
    dto: UpdateProductDto,
    file?: Express.Multer.File
  ): Promise<Product> {
    const existing = await this.findById(id);

    let image = existing.image;
    let image_public_id = existing.image_public_id;

    if (file && dto.image) {
      throw new BadRequestException(
        'Chỉ được chọn 1 trong 2: file hoặc URL ảnh'
      );
    }

    if (file) {
      const uploaded =
        await this.fileUploadService.uploadImageToCloudinary(file);
      if (existing.image_public_id && existing.image_public_id !== '-1') {
        await this.fileUploadService.deleteImageFromCloudinary(
          existing.image_public_id
        );
      }
      image = uploaded.secure_url;
      image_public_id = uploaded.public_id;
    }

    if (dto.image && !file) {
      const isValid = await isImageUrl(dto.image);
      if (!isValid) {
        throw new BadRequestException('Image URL không hợp lệ');
      }

      if (existing.image_public_id && existing.image_public_id !== '-1') {
        await this.fileUploadService.deleteImageFromCloudinary(
          existing.image_public_id
        );
      }

      image = dto.image;
      image_public_id = '-1';
    }

    // Cập nhật từng trường nếu có
    if (dto.name !== undefined) existing.name = dto.name;
    if (dto.price !== undefined) existing.price = dto.price;
    if (dto.description !== undefined) existing.description = dto.description;
    if (dto.category_id !== undefined) existing.category_id = dto.category_id;

    existing.image = image;
    existing.image_public_id = image_public_id;

    return this.productRepo.save(existing);
  }

  async delete(id: string): Promise<void> {
    await this.productRepo.delete(id);
  }

  async getTopSellingProducts(limit = 10) {
    const rawProducts = await this.productRepo
      .createQueryBuilder('p')
      .innerJoin('p.orderItems', 'oi')
      .innerJoin('oi.order', 'o')
      .where('o.status = :status', { status: 'completed' })
      .select('p.id', 'id')
      .addSelect('p.name', 'name')
      .addSelect('p.price', 'price')
      .addSelect('p.image', 'image')
      .addSelect('p.restaurant_id', 'restaurant_id')
      .addSelect('SUM(oi.quantity)', 'total_sold')
      .groupBy('p.id')
      .orderBy('total_sold', 'DESC')
      .limit(limit)
      .getRawMany();

    return rawProducts.map((item) => ({
      id: item.id,
      name: item.name,
      price: Number(item.price),
      image: item.image,
      restaurant_id: item.restaurant_id,
      total_sold: Number(item.total_sold),
    }));
  }

  async normalizeExistingRestaurantNames(): Promise<void> {
    const all = await this.productRepo.find();
    for (const r of all) {
      r.name_normalized = removeVietnameseTones(r.name);
      await this.productRepo.save(r);
    }
  }
}
