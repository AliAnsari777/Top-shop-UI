import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CartComponent } from "./cart/cart.component";
import { CheckoutComponent } from "./checkout/checkout.component";

import { MyAccountComponent } from "./my-account/my-account.component";
import { ErrorPageComponent } from "./error-page/error-page.component";
import { VendorComponent } from "./vendor/vendor.component";

const routes: Routes = [
  {
    path: "",
    children: [
      { path: "cart", component: CartComponent },
      { path: "checkout", component: CheckoutComponent },
      { path: "my-account", component: MyAccountComponent },
      { path: "vendor", component: VendorComponent },

      { path: "error", component: ErrorPageComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
