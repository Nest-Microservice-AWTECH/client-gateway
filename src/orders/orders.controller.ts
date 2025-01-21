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

import { NATS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateOrderDto, StatusPaginatonDto } from './dto';
import { catchError } from 'rxjs';
import { PaginationDto } from 'src/common';

@Controller('orders')
export class OrdersController {
  constructor(@Inject(NATS_SERVICE) private readonly natsClient: ClientProxy) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.natsClient.send('createOrder', createOrderDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.natsClient.send('findAllOrders', paginationDto);
  }

  @Get('id/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.natsClient.send('findOneOrder', { id }).pipe(
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

    return this.natsClient.send('findAllOrders', orderPagination);
  }

  @Patch(':id')
  changeStatusOrder(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() status: StatusPaginatonDto,
  ) {
    return this.natsClient.send('changeOrderStatus', { id, ...status }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }
}
