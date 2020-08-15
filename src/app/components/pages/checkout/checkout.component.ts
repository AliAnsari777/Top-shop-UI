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

  paymentInformations: PaymentInformation[] = [
    /*{
      cardNumber: "4956-6580-0568-0385",
      expDate: "12/2030",
      nameOnCard: "Mickael",
      secDigit: "632"
    },
    {
      cardNumber: "5452-6584-4512-5354",
      expDate: "55/5555",
      nameOnCard: "Mika",
      secDigit: "652"
    },
    new PaymentInformation()

  ];

  billingInformations: BillingInformation[] = [
    /*{
      firstName: "Ny",
      lastName: "Andriantsoa",
      email: "nandriantsoa@miu.edu",
      address: "1000 N 4th Street",
      town: "Fairfield",
      state: "IOWA",
      country: "US",
      postcode: "52557",
      phone: "+1 641-451-0220"
    },
    {
      firstName: "Mika",
      lastName: "",
      email: "mickael@yahoo.fr",
      address: "burlington",
      town: "Ottumwa",
      state: "IOWA",
      country: "US",
      postcode: "52543",
      phone: "+1 685-451-0220"
    },
    new BillingInformation()*/
  ];

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
    this.cartItems = this.cartService.getItems();
    this.cartItems = of(this.cartService.getCheckoutItems());

    this.cartItems.subscribe((products) => (this.buyProducts = products));
    this.getTotal().subscribe((amount) => (this.amount = amount));

    this.getBillingInformation();
    // this.billingChosed = this.billingInformations[0] || new BillingInformation();
    this.paymentChosed =
      this.paymentInformations[0] || new PaymentInformation();
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

  getBillingInformation() {
    let id: string = Cookie.get("user_id");
    if (id) {
      this.http
        .get<UserDTO>("localhost:8086/api/user/get_guest/" + id)
        .subscribe(
          (response) => {
            let arr: BillingInformation[] = [];

            for (let address of response.addressList) {
              arr.push({
                firstName: response.firstName,
                lastName: response.lastName,
                email: "",
                address: address.addressLineOne + " " + address.addressLineTwo,
                town: address.city,
                state: address.state,
                phone: "",
              });
            }

            // this.billingInformations = [...arr, new BillingInformation()];

            this.paymentInformations = [
              ...response.paymentInformation,
              new PaymentInformation(),
            ];
          },
          (err) => {
            console.log(err);
          }
        );
    }
  }
}
