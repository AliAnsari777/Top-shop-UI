import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BillingInfoComponent } from "./checkout/billing-info/billing-info.component";
import { CardInfoComponent } from "./checkout/card-info/card-info.component";
//import { ConfirmationPageComponent } from './checkout/confirmation-page/confirmation-page.component';
import { CheckoutWithComponent } from "./cart/checkout-with/checkout-with.component";
import { CartComponent } from "./cart/cart.component";
import { CheckoutComponent } from "./checkout/checkout.component";
import { PagesRoutingModule } from "./pages-routing.module";
import { SharedModule } from "../shared/shared.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MyAccountComponent } from "./my-account/my-account.component";
import { ErrorPageComponent } from "./error-page/error-page.component";
import { ProceedComponent } from "./checkout/proceed/proceed.component";
import { VendorComponent } from "./vendor/vendor.component";
// import { ConfirmationPageComponent } from './checkout/confirmation-page/confirmation-page.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PagesRoutingModule,
    SharedModule,
  ],
  declarations: [
    CartComponent,
    CheckoutComponent,
    MyAccountComponent,
    ErrorPageComponent,
    BillingInfoComponent,
    CardInfoComponent,
    //    ConfirmationPageComponent,
    CheckoutWithComponent,
    ProceedComponent,
    // ConfirmationPageComponent,
    CheckoutWithComponent,
    VendorComponent,
  ],
})
export class PagesModule {}
