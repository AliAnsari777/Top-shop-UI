export class PaymentInformation {
   id:number;
   nameOnCard:string;
   secCode:string;
   expDate:string;
   cardType:string;
   cardNumber:string;


  constructor(nameOnCard: string, secCode: string, expDate: string, cardType: string, cardNumber: string) {
    this.nameOnCard = nameOnCard;
    this.secCode = secCode;
    this.expDate = expDate;
    this.cardType = cardType;
    this.cardNumber = cardNumber;
  }
}
