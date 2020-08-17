import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { Product } from '../../../modals/product.model';
import { CartItem } from '../../../modals/cart-item';
import {FormBuilder, FormControl, FormGroup, NgForm} from '@angular/forms';
import {ProductService} from '../services/product.service';

@Component({
  selector: 'app-header-three',
  templateUrl: './header-three.component.html',
  styleUrls: ['./header-three.component.sass']
})
export class HeaderThreeComponent implements OnInit {

  public sidenavMenuItems:Array<any>;

  public currencies = ['USD', 'EUR'];
  public currency:any;
  public flags = [
    { name:'English', image: 'assets/images/flags/gb.svg' },
    { name:'German', image: 'assets/images/flags/de.svg' },
    { name:'French', image: 'assets/images/flags/fr.svg' },
    { name:'Russian', image: 'assets/images/flags/ru.svg' },
    { name:'Turkish', image: 'assets/images/flags/tr.svg' }
  ]

  errorMessage;
  searchForm: FormGroup;
  public flag:any;

  products: any;

  indexProduct: number;
  shoppingCartItems: CartItem[] = [];


  constructor(private cartService: CartService,private productService: ProductService,  private formBuilder: FormBuilder) {
    this.cartService.getItems().subscribe(shoppingCartItems => this.shoppingCartItems = shoppingCartItems);
  }

  ngOnInit() {
    this.currency = this.currencies[0];
    this.flag = this.flags[0];
    this.searchForm = this.formBuilder.group({
      keyword: new FormControl(''),
      minprice: new FormControl(''),
      maxprice: new FormControl('')
    });
  }

  public changeCurrency(currency){
    this.currency = currency;
  }
  public changeLang(flag){
    this.flag = flag;
  }
  doSearch() {
    const fields = this.searchForm.controls;
    console.log(fields);

    if (fields.minprice.value == null) {
      fields.minprice.setValue('');
    }
    if (fields.maxprice.value == null) {
      fields.maxprice.setValue('');
    }
    this.productService.searchProducts(fields.keyword.value).subscribe(data => {
        console.log(data);

        this.products = data;
        if (this.products == null) {
          this.products = [];
        }
      },
      (error) => {
        this.errorMessage = error;
      });
  }
  addToCart(product) {
    this.cartService.addToCart(product,1);
  }
}
