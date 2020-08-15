import { Component, OnInit, ViewChild } from "@angular/core";
import { Product } from "../../../modals/product.model";
import { CartItem } from "../../../modals/cart-item";
import { CartService } from "../services/cart.service";
import { SidebarMenuService } from "../sidebar/sidebar-menu.service";
import { UserService } from "../../../services/UserService";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.sass"],
})
export class HeaderComponent implements OnInit {
  public sidenavMenuItems: Array<any>;

  public currencies = ["USD", "EUR"];
  public currency: any;
  public flags = [
    { name: "English", image: "assets/images/flags/gb.svg" },
    { name: "German", image: "assets/images/flags/de.svg" },
    { name: "French", image: "assets/images/flags/fr.svg" },
    { name: "Russian", image: "assets/images/flags/ru.svg" },
    { name: "Turkish", image: "assets/images/flags/tr.svg" },
  ];
  public flag: any;

  products: Product[];

  indexProduct: number;
  shoppingCartItems: CartItem[] = [];
  public isLoggedIn = false;

  constructor(private cartService: CartService, private _service: UserService) {
    this.cartService
      .getItems()
      .subscribe(
        (shoppingCartItems) => (this.shoppingCartItems = shoppingCartItems)
      );
  }

  ngOnInit() {
    this.isLoggedIn = this._service.checkCredentials();
    this.currency = this.currencies[0];
    this.flag = this.flags[0];
  }

  public changeCurrency(currency) {
    this.currency = currency;
  }
  public changeLang(flag) {
    this.flag = flag;
  }

  public logout() {
    this.isLoggedIn = false;
    this._service.logout();
  }
}
