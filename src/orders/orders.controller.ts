import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Inject,
  ParseUUIDPipe,
  Query,
  Patch,
} from '@nestjs/common';

import { ORDERS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateOrderDto, StatusPaginatonDto, UpdateOrderDto } from './dto';
import { catchError } from 'rxjs';
import { PaginationDto } from 'src/common';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(ORDERS_SERVICE) private readonly ordersClient: ClientProxy,
  ) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersClient.send('createOrder', createOrderDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.ordersClient.send('findAllOrders', paginationDto);
  }

  @Get('id/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersClient.send('findOneOrder', { id }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Get(':status')
  async findAllByStatus(
    @Param() status: StatusPaginatonDto,
    @Query() paginationDto: PaginationDto,
  ) {
    const orderPagination = {
      ...paginationDto,
      ...status,
    };
    console.log({ orderPagination });

    return this.ordersClient.send('findAllOrders', orderPagination);
  }

  @Patch(':id')
  changeStatusOrder(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() status: StatusPaginatonDto,
  ) {
    return this.ordersClient.send('changeOrderStatus', { id, ...status }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }
}
