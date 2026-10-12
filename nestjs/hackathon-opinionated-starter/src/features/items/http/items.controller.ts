import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateItem } from '../application/create-item.use-case.js';
import { DeleteItem } from '../application/delete-item.use-case.js';
import { GetItem } from '../application/get-item.use-case.js';
import { ListItems } from '../application/list-items.use-case.js';
import { CreateItemRequest } from './dto/create-item.request.js';
import { ItemResponse } from './dto/item.response.js';

@ApiTags('items')
@Controller('items')
export class ItemsController {
  constructor(
    private readonly createItem: CreateItem,
    private readonly listItems: ListItems,
    private readonly getItem: GetItem,
    private readonly deleteItem: DeleteItem,
  ) {}

  @Get()
  @ApiOkResponse({ type: [ItemResponse] })
  async list(): Promise<ItemResponse[]> {
    const items = await this.listItems.execute();
    return items.map((item) => ItemResponse.from(item));
  }

  @Post()
  @ApiCreatedResponse({ type: ItemResponse })
  @ApiBadRequestResponse()
  async create(@Body() body: CreateItemRequest): Promise<ItemResponse> {
    return ItemResponse.from(
      await this.createItem.execute({ name: body.name }),
    );
  }

  @Get(':id')
  @ApiOkResponse({ type: ItemResponse })
  @ApiNotFoundResponse()
  async get(@Param('id', ParseIntPipe) id: number): Promise<ItemResponse> {
    return ItemResponse.from(await this.getItem.execute(id));
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiNoContentResponse()
  @ApiNotFoundResponse()
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.deleteItem.execute(id);
  }
}
