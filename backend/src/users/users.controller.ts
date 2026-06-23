import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { createUserSchema, updateUserSchema } from './users.validation';
import { BadRequestException } from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() body: unknown) {
    console.log('controller create appelé', body);

    const data = createUserSchema.parse(body);
    return this.usersService.create(data);
  }

  @Get()
  findAll() {
    console.log('controller create findAll() appelé');

    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log('controller create findOne() appelé');
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: unknown) {
    try {
      console.log('controller create update appelé');
      const data = updateUserSchema.parse(body);

      const user = await this.usersService.update(+id, data);

      return user;
    } catch (error) {
      throw new BadRequestException(
        'Données invalides ou utilisateur inexistant',
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    console.log("BACKEND: Route DELETE appelée pour l'ID:", id);
    const deletedUser = await this.usersService.remove(+id);
    return deletedUser;
  }
}
