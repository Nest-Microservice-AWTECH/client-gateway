import { IsEnum, IsOptional } from 'class-validator';
import { OrderStatus, OrderStatusList } from '../enum/order.enum';

export class StatusPaginatonDto {
  @IsOptional()
  @IsEnum(OrderStatusList, {
    message: `The only valid status are ${OrderStatusList}`,
  })
  status?: string;
}
