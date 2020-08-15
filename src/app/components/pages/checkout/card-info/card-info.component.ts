import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { PaymentInformation } from '../../../../modals/payment-information';

@Component({
  selector: 'app-card-info',
  templateUrl: './card-info.component.html',
  styleUrls: ['./card-info.component.sass']
})
export class CardInfoComponent implements AfterViewInit {

  @Input() payment : PaymentInformation;

  paymentInformation : PaymentInformation = new PaymentInformation();

  regExpDigit = RegExp("[0-9]");

  constructor() { }

  ngOnInit(): void {
  }
  
  ngAfterViewInit(){
    this.paymentInformation = this.payment;
    console.log(this.payment);
  }

  checkCardNumber(event: KeyboardEvent){
    let length = this.paymentInformation.cardNumber.length;
    let last = String.fromCharCode(event.charCode);
    let spaces = [3, 8, 13];

    event.preventDefault();

    if(length < 19 && this.regExpDigit.test(last)){
      this.paymentInformation.cardNumber += last

      if (spaces.indexOf(length) !== -1) {
        this.paymentInformation.cardNumber += "-";
      }
    }

  }

  checkExpDate(event : KeyboardEvent){
    event.preventDefault();

    let length = this.paymentInformation.expDate.length;
    let last = String.fromCharCode(event.charCode);

    if(length < 7 && this.regExpDigit.test(last)){
      this.paymentInformation.expDate += last

      if (length === 1) {
        this.paymentInformation.expDate += "/";
      }
    }
  }

  checkSecDigit(event : KeyboardEvent){
    event.preventDefault();

    let length = this.paymentInformation.secDigit.length;
    let last = String.fromCharCode(event.charCode);

    if(length < 3 && this.regExpDigit.test(last)){
      this.paymentInformation.secDigit += last
    }    
  }

}
