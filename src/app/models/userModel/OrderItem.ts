export class OrderItem {

  orderId: number;
  userId:number
  userName:string
  createdDate:Date
  status:string
  amount:number
  error:any
  orderDetails:orderDetails[];
}

class orderDetails{
  orderDetailId:number;
  productId:number;
  productName:string
  quantity:number;
  unitPrice:number;
  subtotalPrice:number;
}
