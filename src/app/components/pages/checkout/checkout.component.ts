import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { CartService } from "../../shared/services/cart.service";
import { Observable, of, from } from "rxjs";
import { CartItem } from "../../../modals/cart-item";
import { ProductService } from "../../shared/services/product.service";
import { PaymentInformation } from "../../../modals/payment-information";
import { BillingInformation } from "../../../modals/billing-information";
import { CardInfoComponent } from "./card-info/card-info.component";
import { MatRadioChange } from "@angular/material/radio";
import { BillingInfoComponent } from "./billing-info/billing-info.component";
import { CheckoutService } from "../../../services/checkout.service";
import { HttpClient } from "@angular/common/http";
import { UserDTO } from "../../../modals/dto/user-dto";
import { Cookie } from "ng2-cookies";
import { UserAccountDTO } from "../../../modals/dto/user-account-dto";

@Component({
  selector: "app-checkout",
  templateUrl: "./checkout.component.html",
  styleUrls: ["./checkout.component.sass"],
})
export class CheckoutComponent implements AfterViewInit {
  modal: boolean = false;

  public cartItems: Observable<CartItem[]> = of([]);
  public buyProducts: CartItem[] = [];

  amount: number;
  payments: string[] = ["Create an Account?", "Flat Rate"];

  paymentInformations: PaymentInformation[] = [];
  billingInformations: BillingInformation[] = [new BillingInformation()];

  billingChosed: BillingInformation;
  paymentChosed: PaymentInformation;

  @ViewChild(CardInfoComponent) cardInfoChild;
  @ViewChild(BillingInfoComponent) billingInfoChild;

  constructor(
    private cartService: CartService,
    public productService: ProductService,
    private checkoutService: CheckoutService,
    private http: HttpClient
  ) {}

  ngAfterViewInit() {}

  ngOnInit() {
    //this.cartItems = this.cartService.getItems();
    this.cartItems = of(this.cartService.getCheckoutItems());

    this.cartItems.subscribe((products) => {
      this.buyProducts = products
    });
    this.getTotal().subscribe((amount) => (this.amount = amount));

    this.getInformation();
    this.billingChosed = this.billingInformations[0] || new BillingInformation();
    this.paymentChosed = this.paymentInformations[0] || new PaymentInformation();
  }

  public getTotal(): Observable<number> {
    return this.cartService.getTotalAmount();
  }

  public getNewTotal(): Observable<number> {
    return this.cartService.getNewTotalAmount();
  }

  placeOrder() {
    console.log(this.cardInfoChild.paymentInformation);
    console.log(this.billingInfoChild.billingInformation);

    if (
      this.checkoutService.checkOrder(
        this.cardInfoChild.paymentInformation,
        this.billingInfoChild.billingInformation
      )
    ) {
      this.modal = true;
      this.checkoutService.prepare(
        this.cardInfoChild.paymentInformation,
        this.billingInfoChild.billingInformation
      );
    }
  }

  checkout() {
    this.checkoutService.placeOrder(
      this.cardInfoChild.paymentInformation,
      this.billingInfoChild.billingInformation
    );
  }

  closeModal(event) {
    this.modal = event;
  }

  paymentChange(event: MatRadioChange) {
    this.paymentChosed = event.value;
    this.cardInfoChild.paymentInformation = this.paymentChosed;
  }

  billingChange(event: MatRadioChange) {
    this.billingChosed = event.value;
    this.billingInfoChild.billingInformation = this.billingChosed;
  }

  getInformation() {
    let id: string = Cookie.get("user_id");
    console.log("FETCH USER INFORMATION ..........." , id)
    
    if (id) {
      console.log("BEFORE FETCHING USER INFORMATION ...........")
      this.http
        .get<UserAccountDTO>("http://localhost:8086/api/user/getByAccountId/" + id)
        .subscribe(
          (response) => {
            console.log(response)
            let arr: BillingInformation[] = [];

            for (let address of response.addressList) {
              arr.splice(0, 0,{
                firstName: response.userAccount.firstName || "",
                lastName: response.userAccount.lastName || "",
                email: response.userAccount.email || "",
                address: address.addressLineOne || ""+ " " + address.addressLineTwo || "",
                town: address.city || "",
                state: address.state || "",
                phone: "",
              });
            }

            this.billingInformations = [...arr , new BillingInformation()];

            for(let paymentInfo of response.paymentInformation){
              this.paymentInformations.push({
                ...paymentInfo,
                cardNumber: paymentInfo.cardNumber.substring(0,4) + "-" + paymentInfo.cardNumber.substring(4,8) + "-" 
                          + paymentInfo.cardNumber.substring(8,12) + "-" + paymentInfo.cardNumber.substring(12,16),
                secDigit: ""
              })
            }
            this.paymentInformations.push(new PaymentInformation())
          },
          (err) => {
            console.log(err);
          }
        );
    }
  }
}

/*
this.http
        .get<UserDTO>("localhost:8086/api/user/get_guest/" + id)
        .subscribe(
          (response) => {
            let arr: BillingInformation[] = [];

            for (let address of response.addressList) {
              arr.splice(0, 0,{
                firstName: response.firstName,
                lastName: response.lastName,
                email: "",
                address: address.addressLineOne + " " + address.addressLineTwo,
                town: address.city,
                state: address.state,
                phone: "",
              });
            }

            this.paymentInformations = [
              ...response.paymentInformation, ...this.paymentInformations
            ];
          },
          (err) => {
            console.log(err);
          }
        );

*/