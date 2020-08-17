import { Component, HostListener, OnInit } from "@angular/core";
import { UserService } from "../../../services/UserService";
import { NgForm } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { FormControl } from "@angular/forms";
import { RegisteredUser } from "../../../models/userModel/RegisteredUser";
import { Address } from "../../../models/userModel/Address";
import { UserAccount } from "../../../models/userModel/UserAccount";
import { PaymentInformation } from "../../../models/userModel/PaymentInformation";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import {CartItem} from "../../../modals/cart-item";
import {Observable, of} from "rxjs";
import {CartService} from "../../shared/services/cart.service";
import {CheckoutService} from "../../../services/checkout.service";
import {OrderItem} from "../../../models/userModel/OrderItem";

@Component({
  selector: "app-my-account",
  templateUrl: "./my-account.component.html",
  styleUrls: ["./my-account.component.sass"],
})
export class MyAccountComponent implements OnInit {
  public isLoggedIn = false;
  public username;
  public password;
  name = new FormControl("");
  public cartItems : Observable<OrderItem[]> = of([]);
  public shoppingCartItems  : OrderItem[] = [];

  private checkoutItems : CartItem[] = [];
  order: boolean;

  constructor(
    private cartService: CartService , private checkoutService: CheckoutService,
    private _service: UserService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.cartItems = this.cartService.getProducts();
    this.cartItems.subscribe(shoppingCartItems =>{ this.shoppingCartItems = shoppingCartItems
      console.log('shoppring cart items',this.shoppingCartItems);
    });
    this.isLoggedIn = this._service.checkCredentials();
    let i = window.location.href.indexOf("code");
    if (!this.isLoggedIn && i != -1) {
    }
  }

  login(element: NgForm) {
    this.username = element.value.username;
    this.password = element.value.password;
    console.log(element);
    if (element.valid)
      this._service.retrieveToken(this.username, this.password);
  }

  logout() {
    this._service.logout();
  }

  register(element: NgForm) {
    console.log(element.value);
    let cardType = "VISA";
    if (element.value.cardNumber.charAt(0) == "4") {
      cardType = "VISA";
    }
    if (element.value.cardNumber.charAt(0) == "5") {
      cardType = "MASTER";
    }

    console.log(cardType);

    var value = element.value;
    var address = new Address(
      value.state,
      value.postcode,
      value.addressLineOne,
      value.town
    );
    var addresss = [address];
    var paymentInformation = new PaymentInformation(
      value.nameOnCard,
      value.secCode,
      value.expDate,
      cardType,
      value.cardNumber
    );
    var paymentInformations = [paymentInformation];
    var userAccount = new UserAccount(
      value.username,
      value.password,
      value.firstName,
      value.lastName,
      null,
      value.email,
      "USER"
    );
    var registeredUser = new RegisteredUser(
      "REGISTERED_USER",
      addresss,
      paymentInformations,
      "USER",
      userAccount
    );

    console.log(registeredUser);
    this._service.register(registeredUser, element);

    this.router.navigateByUrl("/").then(() => {
      this.router.navigateByUrl("pages/my-account");
    });
    this.spinner.hide();
    element.reset();
  }

  public getTotal(): Observable<number> {
    return this.cartService.getTotalAmount();
  }


  displayOrder() {
    this.order= !this.order;
  }
}
