import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MainComponent } from "./components/main/main.component";
import { HomeComponent } from "./components/shop/home-three/home.component";
import { ConfirmationPageComponent } from "./components/pages/checkout/confirmation-page/confirmation-page.component";
import { VendorComponent } from "./components/pages/vendor/vendor.component";

const appRoutes: Routes = [
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full",
  },
  {
    path: "home",
    component: HomeComponent,
  },
  {
    path: "",
    component: MainComponent,
    children: [
      {
        path: "home",
        loadChildren: () =>
          import("./components/shop/shop.module").then((m) => m.ShopModule),
      },
      {
        path: "pages",
        loadChildren: () =>
          import("./components/pages/pages.module").then((m) => m.PagesModule),
      },
    ],
  },
  {
    path: "**",
    redirectTo: "",
  },
  { path: "confirmation-page", component: ConfirmationPageComponent },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
