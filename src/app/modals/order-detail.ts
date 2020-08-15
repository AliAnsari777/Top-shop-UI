export class OrderDetail{

    productId : number;
    productName: string;
    quantity : number;
    unitPrice : number;
    subtotalPrice : number;

    constructor(productId : number, productName : string, quantity : number, unitPrice : number, subtotalPrice : number){
        this.productId = productId;
        this.productName = productName;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.subtotalPrice = subtotalPrice;
    }

}