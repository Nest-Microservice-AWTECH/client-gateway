export enum OrderStatus {
  PENDING = 'PENDING',
  DELIVERED = 'DELIVERED',
  CACELLED = 'CACELLED',
}

export const OrderStatusList = [
  OrderStatus.CACELLED,
  OrderStatus.DELIVERED,
  OrderStatus.PENDING,
];
