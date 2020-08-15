import { Injectable, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PaymentInformation } from '../modals/payment-information';
import { BillingInformation } from '../modals/billing-information';
import * as _ from 'lodash';
import { UserDTO } from '../modals/dto/user-dto';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError, timeout } from 'rxjs/operators';
import { ErrorService } from './error.service';
import { Order } from '../modals/order';
import { Product } from '../modals/product.model';
import { CartItem } from '../modals/cart-item';
import { CartService } from '../components/shared/services/cart.service';
import { OrderDetail } from '../modals/order-detail';
import { Router } from '@angular/router';
import { PaymentInformationDTO } from '../modals/dto/payment-information-dto';
import { ConfirmationPageComponent } from '../components/pages/checkout/confirmation-page/confirmation-page.component';
import { ProceedComponent } from '../components/pages/checkout/proceed/proceed.component';
import { Cookie } from 'ng2-cookies';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  user : UserDTO;

  amount : number;

  id : string;

  order : Order;

  @ViewChild(ProceedComponent) proceed;

  constructor(private http : HttpClient , private error : ErrorService, 
              private cartservice: CartService, private router : Router) { }

  public placeOrder(paymentInformation : PaymentInformation , billingInformation : BillingInformation) {
    let order = this.prepare(paymentInformation, billingInformation);

    setTimeout(() => {
      const expDate = paymentInformation.expDate.split("/");
      const cardNum = paymentInformation.cardNumber.split("-")

      let paymentDTO : PaymentInformationDTO = {
        amount: this.order.amount,
        cardNumber: cardNum[0] + cardNum[1] + cardNum[2] + cardNum[3],
        expirationDate: expDate[1] + "-" + expDate[0] + "-" + "10",
        nameOnCard: paymentInformation.nameOnCard,
        securityDigit: paymentInformation.secDigit,
      }

      this.saveOrder( {order : this.order , card : paymentDTO} ).subscribe((response) => {
        console.log("RESPONSE :" , response)
        let cart: CartItem[] = JSON.parse(localStorage.getItem('checkoutItem'))
        let currentCart : CartItem[] = JSON.parse(localStorage.getItem('cartItem'))
  
        if(response.orderId){
          for(let item of cart){
            for (let i = 0 ; i < currentCart.length ; i++){
              if( currentCart[i].product.id === item.product.id ){
                currentCart.splice(i , 1);
                break;
              }
            }
          }

          localStorage.setItem('cartItem' , JSON.stringify(currentCart))
          this.router.navigate(['/confirmation-page'])
        }
  
        this.proceed.model = false;
        alert("Unable to make purchase!")
        //localStorage.setItem('orderID' , response.id )
  
        this.router.navigate(['confirmation-page'])
  
      }, (err) => {
        alert("Unable to make purchase! " + JSON.stringify(err))
        console.error(err)
      })
  
    } , 4000)


  }

  public prepare(paymentInformation : PaymentInformation , billingInformation : BillingInformation) {
    
    let payment = this.preparePaymentInformation(paymentInformation);

    this.cartservice.getNewTotalAmount().subscribe((response) => this.amount = response);
    this.user = this.getUser(payment , billingInformation);

    console.log(this.user)

    let orderDetails : OrderDetail[] = this.getOrderDetails();

    console.log("USER ACCOUNT" , Cookie.get('user_id'))

    let order : Order

    setTimeout(() => {
      order = {
        amount: this.amount,
        createdDate: new Date().getMonth() + "/" + new Date().getDay() + "/" + new Date().getFullYear() ,
        status: "Payed",
        userId: localStorage.getItem('userAccount'),
        orderDetails: orderDetails
      }
      this.order = order
    }, 2000);

  }

  private getOrderDetails() : OrderDetail[] {
    let cartItem : CartItem[] = JSON.parse(localStorage.getItem("checkoutItem"));

    console.log("CART ITEM" , cartItem)

    let orderDetails: OrderDetail[] = []

    for( let item of cartItem ){
      orderDetails.push({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        unitPrice: item.product.price,
        subtotalPrice: item.product.price * item.quantity
      })
    }

    return orderDetails;
  }

  public createCheckoutItem(items : CartItem[]){
    localStorage.setItem("checkoutItem" , JSON.stringify(items));
  }

  public deleteCheckoutItem(){
    localStorage.removeItem("checkoutItem");
  }

  private getUser(paymentInformation: PaymentInformation , billingInformation: BillingInformation) : UserDTO {
    let id = Cookie.get("user_id")
    console.log(id)
    if(id){
      let activeUser = new UserDTO();
      activeUser.id = id;
      return activeUser;
    }else{
      console.log("tonga ato")
      let userData: UserDTO = {
        role: "USER",
        firstName: billingInformation.firstName,
        lastName: billingInformation.lastName,
        addressList:[ {
          addressLineOne: billingInformation.address,
          addressLineTwo: billingInformation.country + " " + billingInformation.postcode,
          city: billingInformation.town,
          state: billingInformation.state
        }],
        paymentInformation: [ {...paymentInformation , 
          cardType : paymentInformation.cardNumber.startsWith('4') ? 'VISA' : 'MASTER'  } ],
        user_role: "GUEST_USER"
      }

      let user : UserDTO;

      this.saveGuestUser(userData).subscribe( async (response) => {
        console.log("GUEST USER" , response)
        this.user = response
        user = response
        this.id = response.id
        Cookie.set('user_id' , response.id)
      }, (err) => console.log(err));

      return user;
    }
  }

  private saveGuestUser(user : UserDTO) : Observable<UserDTO> {

    return this.http.post<UserDTO>("http://localhost:8086/api/user/create_guest" , user )
      .pipe(
        map(data => { return this.user = data }),
        timeout(10000),
        catchError(this.error.handleError<UserDTO>('Create Guest User' , user))
      )
  }

  private saveOrder(order) : Observable<Order> {

    return this.http.post<Order>("http://localhost:8087/order/placeorder" , order)
      .pipe(
        timeout(10000),
        catchError(this.error.handleError<Order>('Save order to the database' , order))
      )
  }
  
  private preparePaymentInformation(paymentInformation : PaymentInformation) : PaymentInformation {
    let cardNumber = paymentInformation.cardNumber;
    for(let i = 0 ; i < 3 ; i++){
      cardNumber = cardNumber.replace('-' , "");
    }

    let payment : PaymentInformation = { ...paymentInformation }
    payment.cardNumber = cardNumber;

    return payment;
  }

  public checkOrder( paymentInformation : PaymentInformation , billingInformation : BillingInformation ){

    return this.checkPaymentInformation(this.preparePaymentInformation(paymentInformation)) 
            && this.checkBillingInformation(billingInformation);
  }

  private checkPaymentInformation(paymentInformation : PaymentInformation) : boolean{
    if(paymentInformation.cardNumber.length === 16 && 
      paymentInformation.expDate.length === 7 &&
      paymentInformation.nameOnCard.trim().length > 0 &&
      paymentInformation.secDigit.length === 3){

        let expDateDetails = paymentInformation.expDate.split('/');
        let currentYear : number = new Date().getUTCFullYear();
        let year = parseInt(expDateDetails[1] , 10);

        if(parseInt(expDateDetails[0] , 10) > 12 || year < currentYear || year > currentYear + 30 ) {
          alert("Please make sure the Expiration date is not wrong")
          return false;
        }
        return true;
    } else {
      alert("Please make sure the payment information is valid");
      return false;
    }
  }

  private checkBillingInformation(billingInformation : BillingInformation) : boolean {
    if(billingInformation.address.length > 0 && 
      billingInformation.country.length > 0 &&
      billingInformation.postcode.length > 0 &&
      billingInformation.state.length > 0 && 
      billingInformation.phone.length > 0 &&
      billingInformation.email.length > 0 && 
      billingInformation.lastName.length > 0){
        return true;
    }else {
      alert("Please make sure the billing information is valid");
      return false;
    }
  }

}


/*console.log("ORDER HERE" , this.order)
      formData.append("order" , JSON.stringify(this.order));
      formData.append("card-info" , JSON.stringify(paymentInformation));*/

      // const expDate = paymentInformation.expDate.split("/");

      // const data = {
      //   cardNumber : paymentInformation.cardNumber,
      //   expDate : expDate[1] + "-" + expDate[0] + "-" + "1",
      //   nameOnCard : paymentInformation.nameOnCard,
      //   secDigit : paymentInformation.secDigit,
      //   amount : this.order.amount,
      //   createdDate : this.order.createdDate,
      //   status : this.order.status,
      //   userId : /*this.order.userId*/ 12 ,
      //   userName : this.order.userName,
      //   orderDetails : this.order.orderDetails,
      // }