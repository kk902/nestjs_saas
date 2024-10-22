export class Order {}
export enum orderType {
  RECHARGE = "充值",
  DEDUCT = "扣款"
}
export enum orderStatus {
  PENDING = "待支付",
  ALREADY = "已支付",
  CNACELLED = "已取消",
  RDFUNDED = "已退款"
}