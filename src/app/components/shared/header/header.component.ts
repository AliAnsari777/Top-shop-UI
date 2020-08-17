import { Component, OnInit, ViewChild } from '@angular/core';
import { Product } from '../../../modals/product.model';
import { CartItem } from '../../../modals/cart-item';
import { CartService } from '../services/cart.service';
import { SidebarMenuService } from '../sidebar/sidebar-menu.service';
import { UserService } from '../../../services/UserService';
import {FormBuilder, FormControl, FormGroup, NgForm} from '@angular/forms';
import {ProductService} from '../services/product.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass'],
})
export class HeaderComponent implements OnInit {
  errorMessage;
  searchForm: FormGroup;
  public sidenavMenuItems: Array<any>;

  public currencies = ['USD', 'EUR'];
  public currency: any;
  public flags = [
    { name: 'English', image: 'assets/images/flags/gb.svg' },
    { name: 'German', image: 'assets/images/flags/de.svg' },
    { name: 'French', image: 'assets/images/flags/fr.svg' },
    { name: 'Russian', image: 'assets/images/flags/ru.svg' },
    { name: 'Turkish', image: 'assets/images/flags/tr.svg' },
  ];
  public flag: any;

  products: any;

  indexProduct: number;
  shoppingCartItems: CartItem[] = [];
  public isLoggedIn = false;
  keyword:string;
  constructor(private cartService: CartService, private _service: UserService, private productService: ProductService,  private formBuilder: FormBuilder) {
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
    this.searchForm = this.formBuilder.group({

    });
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
  addToCart(product) {
    this.cartService.addToCart(product,1);
  }

  doSearch(element:NgForm) {
    // const fields = this.searchForm.controls;
    // console.log('fields',fields);

    this.productService.searchProducts(element.value.search ).subscribe(data => {
        console.log('data',element.value.search);

        this.products = data;
        if (this.products == null) {
          this.products = [];
        }
      },
      (error) => {
        this.errorMessage = error;
      });
  }
}
