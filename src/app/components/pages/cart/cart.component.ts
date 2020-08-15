import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CartItem } from '../../../modals/cart-item';
import { CartService } from '../../shared/services/cart.service';
import { Product } from '../../../modals/product.model';
import { CheckoutService } from '../../../services/checkout.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.sass']
})
export class CartComponent implements OnInit {

  public cartItems : Observable<CartItem[]> = of([]);
  public shoppingCartItems  : CartItem[] = [];

  private checkoutItems : CartItem[] = [];

  constructor(private cartService: CartService , private checkoutService: CheckoutService) { }

  ngOnInit() {
    this.cartItems = this.cartService.getItems();
    this.cartItems.subscribe(shoppingCartItems => this.shoppingCartItems = shoppingCartItems);

  }

  setCheckoutItem( event){
    
    if(event.checked){
      let add = false;
      for(let i = 0 ; i < this.checkoutItems.length ; i++){
        if(this.checkoutItems[i].product.id === event.item.product.id) {
          this.checkoutItems[i] = event.item;
          add = true;
        }
      }

      if(add === false) this.checkoutItems.push(event.item)
    }else{
      for(let i = 0 ; i < this.checkoutItems.length ; i++){
        if(this.checkoutItems[i].product.id === event.item.product.id) {
          this.checkoutItems.splice(i,1);
          break;
        }
      }
    }

    console.log(this.checkoutItems)

  }

    // Remove cart items
    public removeItem(item: CartItem) {
      this.cartService.removeFromCart(item);
    }


   // Increase Product Quantity
   public increment(product: any, quantity: number = 1) {
    this.cartService.updateCartQuantity(product,quantity);
    console.log(this.checkoutItems)
  }

  // Decrease Product Quantity
  public decrement(product: any, quantity: number = -1) {
    this.cartService.updateCartQuantity(product,quantity);
    console.log(this.checkoutItems)
  }
   // Get Total
   public getTotal(): Observable<number> {
    return this.cartService.getTotalAmount();
  }

  public getNewTotal(): number {

    let total = 0;

    for(let item of this.checkoutItems){
      total += item.quantity * item.product.price
    }

    return total;
    
  }

  proceedCheckout(){
    this.checkoutService.createCheckoutItem(this.checkoutItems);
  }

}
