import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserAddressService } from './user-address.service';
import { CreateUserAddressDto } from './dto/create-user-address.dto';
import { UpdateUserAddressDto } from './dto/update-user-address.dto';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { AuthRequest } from '@common/interfaces/auth-request.interface';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { UserAddress } from '@entities/user-address.entity';
import { SetDefaultAddressDto } from './dto/set-default-address.dto';

@ApiTags('User Addresses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('user-addresses')
export class UserAddressController {
  constructor(private readonly service: UserAddressService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new delivery address' })
  @ApiResponse({
    status: 201,
    description: 'Address created successfully',
    type: UserAddress,
  })
  create(@Req() req: AuthRequest, @Body() dto: CreateUserAddressDto) {
    return this.service.create(req.user.userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all addresses of the current user' })
  @ApiResponse({
    status: 200,
    description: 'List of user addresses',
    type: [UserAddress],
  })
  findAll(@Req() req: AuthRequest) {
    return this.service.findAll(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific address by ID' })
  @ApiResponse({
    status: 200,
    description: 'Address details',
    type: UserAddress,
  })
  findOne(@Req() req: AuthRequest, @Param('id') id: string) {
    return this.service.findOne(req.user.userId, id);
  }

  @Get('default')
  @ApiOperation({ summary: 'Get default address for current user' })
  @ApiResponse({
    status: 200,
    description: 'Default address returned',
    type: UserAddress,
  })
  async getDefaultAddress(@Req() req: AuthRequest) {
    return this.service.getDefaultAddress(req.user.userId);
  }

  @Post('set-default')
  @ApiOperation({ summary: 'Set default address for the user' })
  @ApiResponse({ status: 200, description: 'Default address set successfully' })
  async setDefault(@Req() req: AuthRequest, @Body() dto: SetDefaultAddressDto) {
    await this.service.setDefaultAddress(req.user.userId, dto.address_id);
    return { message: 'Default address set successfully' };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a specific address by ID' })
  @ApiResponse({
    status: 200,
    description: 'Updated address',
    type: UserAddress,
  })
  update(
    @Req() req: AuthRequest,
    @Param('id') id: string,
    @Body() dto: UpdateUserAddressDto
  ) {
    return this.service.update(req.user.userId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a specific address by ID' })
  @ApiResponse({ status: 200, description: 'Address deleted successfully' })
  remove(@Req() req: AuthRequest, @Param('id') id: string) {
    return this.service.remove(req.user.userId, id);
  }
}
