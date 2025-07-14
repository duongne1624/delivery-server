import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from '@entities/restaurant.entity';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { removeVietnameseTones } from '@common/utils/normalize.util';
import { isImageUrl } from '@common/utils/valid-image.util';
import { FileUploadService } from '@shared/file-upload/file-upload.service';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepo: Repository<Restaurant>,
    private readonly fileUploadService: FileUploadService
  ) {}

  async findAll(): Promise<Restaurant[]> {
    return this.restaurantRepo.find();
  }

  async findById(id: string): Promise<Restaurant> {
    const restaurant = await this.restaurantRepo.findOne({ where: { id } });
    if (!restaurant) throw new NotFoundException('Restaurant not found');
    return restaurant;
  }

  async create(
    dto: CreateRestaurantDto,
    userId: string,
    file?: Express.Multer.File
  ): Promise<Restaurant> {
    let image: string | undefined;
    let image_public_id: string | undefined = undefined;
    if (!dto.image && !file) {
      throw new BadRequestException(
        'Phải cung cấp một hình ảnh (image hoặc file).'
      );
    }

    if (dto.image && file) {
      throw new BadRequestException(
        'Chỉ được gửi 1 loại hình ảnh: image (link) hoặc file.'
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
      if (!isValid)
        throw new BadRequestException('Đường dẫn hình ảnh không hợp lệ.');
      image = dto.image;
      image_public_id = undefined;
    }

    const newRestaurant = this.restaurantRepo.create({
      ...dto,
      image,
      image_public_id,
      created_by_id: userId,
      name_normalized: removeVietnameseTones(dto.name),
    });

    return this.restaurantRepo.save(newRestaurant);
  }

  async update(
    id: string,
    dto: UpdateRestaurantDto,
    file?: Express.Multer.File
  ): Promise<Restaurant> {
    const existing = await this.findById(id);

    let image = existing.image;
    let image_public_id = existing.image_public_id;
    let shouldDeleteOldImage = false;

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

      if (!!existing.image_public_id && existing.image_public_id !== '-1') {
        shouldDeleteOldImage = true;
      }
    }

    if (dto.image && !file) {
      const isValid = await isImageUrl(dto.image);
      if (!isValid) {
        throw new BadRequestException('Image URL không hợp lệ');
      }

      image = dto.image;
      image_public_id = '-1';

      if (!!existing.image_public_id && existing.image_public_id !== '-1') {
        shouldDeleteOldImage = true;
      }
    }

    if (dto.name !== undefined) {
      existing.name = dto.name;
      existing.name_normalized = removeVietnameseTones(dto.name);
    }

    if (dto.address !== undefined) existing.address = dto.address;
    if (dto.phone !== undefined) existing.phone = dto.phone;
    if (dto.open_time !== undefined) existing.open_time = dto.open_time;
    if (dto.close_time !== undefined) existing.close_time = dto.close_time;
    if (dto.is_active !== undefined) existing.is_active = dto.is_active;
    if (dto.is_open_now !== undefined) existing.is_open_now = dto.is_open_now;

    existing.image = image;
    existing.image_public_id = image_public_id;

    const saved = await this.restaurantRepo.save(existing);

    if (shouldDeleteOldImage && existing.image_public_id) {
      try {
        await this.fileUploadService.deleteImageFromCloudinary(
          existing.image_public_id
        );
      } catch (err) {
        console.error('Không thể xóa ảnh cũ:', err.message);
      }
    }

    return saved;
  }

  async deactivate(id: string): Promise<Restaurant> {
    await this.restaurantRepo.update(id, { is_active: false });
    return this.findById(id);
  }

  async paginate(page = 1, limit = 10): Promise<[Restaurant[], number]> {
    return this.restaurantRepo.findAndCount({
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async paginateByProductCategory(
    categoryId: string,
    page = 1,
    limit = 10
  ): Promise<[Restaurant[], number]> {
    const qb = this.restaurantRepo
      .createQueryBuilder('restaurant')
      .innerJoin('restaurant.products', 'product')
      .where('product.category_id = :categoryId', { categoryId })
      .skip((page - 1) * limit)
      .take(limit)
      .groupBy('restaurant.id')
      .addGroupBy('restaurant.name')
      .addGroupBy('restaurant.address')
      .addGroupBy('restaurant.created_at');

    const [data, count] = await qb.getManyAndCount();
    return [data, count];
  }

  async getTopSellingRestaurants(limit = 10) {
    return this.restaurantRepo
      .createQueryBuilder('r')
      .innerJoin('r.products', 'p')
      .innerJoin('p.orderItems', 'oi')
      .innerJoin('oi.order', 'o')
      .where('o.status = :status', { status: 'completed' })
      .select('r.id', 'id')
      .addSelect('r.name', 'name')
      .addSelect('r.image', 'image')
      .addSelect('r.address', 'address')
      .addSelect('COUNT(DISTINCT o.id)', 'total_orders')
      .groupBy('r.id')
      .addGroupBy('r.name')
      .orderBy('total_orders', 'DESC')
      .limit(limit)
      .getRawMany();
  }

  async searchRestaurants(keyword: string) {
    if (!keyword) return [];

    const normalized = removeVietnameseTones(keyword.trim().toLowerCase());

    const query = this.restaurantRepo
      .createQueryBuilder('r')
      .leftJoin('r.products', 'p')
      .distinct(true)
      .where('r.name_normalized ILIKE :kw', { kw: `%${normalized}%` })
      .orWhere('p.name_normalized ILIKE :kw', { kw: `%${normalized}%` })
      .orderBy('r.name', 'ASC')
      .limit(20);

    return await query.getMany();
  }

  async normalizeExistingRestaurantNames(): Promise<void> {
    const all = await this.restaurantRepo.find();
    for (const r of all) {
      r.name_normalized = removeVietnameseTones(r.name);
      await this.restaurantRepo.save(r);
    }
  }
}
