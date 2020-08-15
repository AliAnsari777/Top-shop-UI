export class PaymentInformation {

    nameOnCard : string;
    secDigit : string;
    expDate : String;
    cardType? : string;
    cardNumber: string;

    constructor(){
        this.nameOnCard = "";
        this.expDate = "";
        this.secDigit = "";
        this.cardType = "";
    }

}