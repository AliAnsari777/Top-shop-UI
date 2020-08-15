import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxSpinnerModule } from "ngx-spinner";
import { NgxImgZoomModule } from "ngx-img-zoom";
import { MatRadioModule } from "@angular/material/radio";
import { MatCheckboxModule } from "@angular/material/checkbox";

import { MainComponent } from "./components/main/main.component";

import { AppRoutingModule } from "./app-routing.module";
import { ShopModule } from "./components/shop/shop.module";
import { SharedModule } from "./components/shared/shared.module";
import { UserService } from "./services/UserService";
import { User } from "./models/userModel/User";
import { VendorService } from "./services/vendor-service.service";
//import { VendorService } from './services/vendor-service.service';

@NgModule({
  declarations: [AppComponent, MainComponent],
  imports: [
    NgxSpinnerModule,
    BrowserModule,
    SharedModule,
    ShopModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgxImgZoomModule,
    MatRadioModule,
    MatCheckboxModule,
  ],
  providers: [UserService, VendorService],
  bootstrap: [AppComponent],
})
export class AppModule {}
