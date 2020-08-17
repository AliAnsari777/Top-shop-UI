
import { Injectable } from "@angular/core";
import { Product } from "../../../modals/product.model";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CartItem } from "../../../modals/cart-item";
import { map, timeInterval } from "rxjs/operators";
import { Observable, BehaviorSubject, Subscriber, of } from "rxjs";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Item_detail } from "../../../modals/item_detail";
import { Cookie } from "ng2-cookies";
import { OrderItem } from "../../../models/userModel/OrderItem";
//import {OrderItem} from "../../../models/userModel/OrderItem";


// Get product from Localstorage
const products = JSON.parse(localStorage.getItem('cartItem')) || [];



@Injectable({
  providedIn: 'root',
})
export class CartService {
  // Array
  public cartItems: BehaviorSubject<CartItem[]> = new BehaviorSubject([]);
  public observer: Subscriber<{}>;
  public shoppingCartUrl: string;
  public itemDetail: Item_detail;
  public userId = Cookie.get('user_id');
  public cartId: number;

  constructor(public snackBar: MatSnackBar, public httpClient: HttpClient) {
    this.cartItems.subscribe((products) => (products = products));
    this.itemDetail = new Item_detail();
    this.shoppingCartUrl = 'http://localhost:8087/shoppingcart/';

    // this.getCartId();
  }

  public getCartId() {
    this.userId = Cookie.get("user_id");
    console.log("GET CART ID.............", this.userId)
    if(this.userId)
      this.httpClient
        .get<number>(this.shoppingCartUrl + "cartid/" + this.userId)
        .subscribe((data) => {
          console.log(data);
          this.cartId = data;
          localStorage.setItem("cart_id" , data.toString())
        }, (err) => console.log(err));
  }

  // Get Products
  public getItems(): Observable<CartItem[]> {
    const itemsStream = new Observable((observer) => {
      observer.next(products);
      observer.complete();
    });

 //   return itemsStream as Observable<CartItem[]>;
    // } else {
    //   let items: CartItem[] = [];
    //   this.httpClient
    //     .get<Item_detail[]>(
    //       "http://localhost:8087/itemdetail/shoppingcart/" +
    //         this.cartId
    //     )
    //     .subscribe((data) => {
    //       for (let i of data) {
    //         items.push({
    //           product: {
    //             name: i.productName,
    //             price: i.unitPrice,
    //             id: i.productId,
    //           },
    //           quantity: i.quantity,
    //         });
    //       }
    //     });

    return <Observable<CartItem[]>>itemsStream;
  }

  public getProducts(): Observable<OrderItem[]> {
    let id = localStorage.getItem("user_id");
    id = Cookie.get("user_id");
    return this.httpClient.get<OrderItem[]>('http://localhost:8080/shopping-cart-service/order/orderwithorderdetail/'+id)
  }

  public getNewItems() {
    let id = Cookie.get("user_id");
    if(id){
      console.log("This is fetching the cart item")
      this.httpClient.get<CartItem[]>("http://localhost:8087/shoppingcart/cart-id?userId=" + id)
        .subscribe((data) =>  {
          console.log("FETCHING CART ITEM......." , data)
          if(data.length > 0)
          {
            let cart : CartItem[] = data;

            for(let i = 0 ; i < data.length ; i++ ){
              this.httpClient.get<Product>("http://localhost:8083/product/"+ data[i].product.id).subscribe(
                product => {
                  console.log("retrieving object.... " , product)
                  cart[i] = {
                    quantity: data[i].quantity,
                    product : product
                  }
                },err => console.log("ERROR", err)
              )
            }

            setTimeout(() => {
              console.log("Put items in cart Item" , cart)
              localStorage.setItem("cartItem" , JSON.stringify(cart))
              this.cartItems.next(cart);
            }, 3000 )

          }
          else{
            let cart : CartItem[] = JSON.parse(localStorage.getItem("cartItem"))
            if(cart.length > 0)
              setTimeout( () => {
                console.log("This is saving cart items to cart")
              this.saveCart(cart).subscribe((data) => {
                console.log("SAVING CART.... " , data)
              }, (err) => {
                console.log(err)
              })} , 3000)
          } 

          this.cartItems.next(JSON.parse(localStorage.getItem("cartItem")))
        }, (err) => console.log("ERROR" , err))
    }
  }

  /*public getNewItems(): Observable<CartItem[]> {
    let id = Cookie.get("user_id");
    let itemsStream : Observable<CartItem[]> ;
    if(id){
      console.log("This is fetching the cart item")
      this.httpClient.get<CartItem[]>("http://localhost:8087/shoppingcart/cart-id?userId=" + id)
        .subscribe((data) =>  {
          console.log("FETCHING CART ITEM......." , data)
          if(data.length > 0)
          {
            let cart : CartItem[] = data;

            for(let i = 0 ; i < data.length ; i++ ){
              this.httpClient.get<Product>("http://localhost:8083/product/"+ data[i].product.id).subscribe(
                product => {
                  console.log("retrieving object.... " , product)
                  cart[i] = {
                    quantity: data[i].quantity,
                    product : product
                  }
                },err => console.log("ERROR", err)
              )
            }

            setTimeout(() => {
              console.log("Put items in cart Item" , cart)
              localStorage.setItem("cartItem" , JSON.stringify(cart))
              this.cartItems.next(cart);
              itemsStream = of(cart)
            }, 3000 )

          }
          else{
            let cart : CartItem[] = JSON.parse(localStorage.getItem("cartItem"))
            if(cart.length > 0)
              setTimeout( () => {
                console.log("This is saving cart items to cart")
              this.saveCart(cart).subscribe((data) => {
                console.log("SAVING CART.... " , data)
              }, (err) => {
                console.log(err)
              })} , 3000)
          } 
        }, (err) => console.log("ERROR" , err))
    }

    products = JSON.parse(localStorage.getItem("cartItem"))

    itemsStream = new Observable((observer) => {
      observer.next(products);
      observer.complete();
    });
    return <Observable<CartItem[]>>itemsStream;
  }*/
  
  saveCart(cart: CartItem[]) : Observable<boolean> {
    return this.httpClient.post<boolean>( 
        "http://localhost:8087/shoppingcart/save-to-cart?cartId" + localStorage.getItem("cart_id") , 
        cart)
  }

  public getCheckoutItems(): CartItem[] {
    console.log("Checkout ITEM" , localStorage.getItem("checkoutItem"))
    return JSON.parse(localStorage.getItem("checkoutItem"));
  }

  // Add to cart
  public addToCart(product: Product, quantity: number) {
    let message, status;
    let item: CartItem | boolean = false;
    // If Products exist
    const hasItem = products.find((items, index) => {
      if (items.product.id == product.id) {
        const qty = products[index].quantity + quantity;
        const stock = this.calculateStockCounts(products[index], quantity);
        if (qty != 0 && stock) {
          products[index]["quantity"] = qty;
          message = "The product " + product.name + " has been added to cart.";
          status = "success";
          this.snackBar.dismiss()
          this.snackBar.open(message, "×", {
            panelClass: [status],
            verticalPosition: 'top',
            duration: 3000,
          });
          console.log(
            'this is in add cart in cart service second: ' + product.name
          );

          // this will update the quantity of the product because it is already added to cart
          this.updateItemInShoppingCart(
            product.id.toString(),
            parseInt(localStorage.getItem("cart_id")),
            qty
          ).subscribe((response) => { console.log("UPDATING CART....." , response)} , (err) => {console.log(err)});
        }
        return true;
      }
    });

    // If Products does not exist (Add New Products)
    if (!hasItem) {
      item = { product, quantity };
      products.push(item);
      message = "The product " + product.name + " has been added to cart.";
      status = "success";
      this.snackBar.dismiss()
      this.snackBar.open(message, "×", {
        panelClass: [status],
        verticalPosition: 'top',
        duration: 3000,
      });
      console.log('this is in add cart in cart service first: ' + product.name);

      // call add to cart from backend in here
      this.itemDetail.productId = product.id;
      this.itemDetail.productName = product.name;
      this.itemDetail.quantity = quantity;
      this.itemDetail.status = 'A';
      this.itemDetail.unitPrice = product.price;
      this.itemDetail.subTotal = product.price * quantity;

      this.addToShoppingCartInBackend(this.itemDetail).subscribe((response) => { console.log("ADDING TO CART.....", response)} , (err) => {console.log(err)});
    }

    localStorage.setItem("cartItem", JSON.stringify(products));
    this.cartItems.next(products);
    return item;
  }

  // Calculate Product stock Counts
  public calculateStockCounts(product: CartItem, quantity): CartItem | Boolean {
    let message, status;
    const qty = product.quantity + quantity;
    const stock = product.product.quantity;
    if (stock < qty) {
      // this.toastrService.error('You can not add more items than available. In stock '+ stock +' items.');
      this.snackBar.dismiss()
      this.snackBar.open(
        'You can not choose more items than available. In stock ' +
          stock +
          " items.",
        "×",
        { panelClass: "snack-error", verticalPosition: "top", duration: 3000 }
      );
      return false;
    }
    return true;
  }

  // Removed in cart
  public removeFromCart(item: CartItem) {
    if (item === undefined) return false;
    const index = products.indexOf(item);
    products.splice(index, 1);
    localStorage.setItem('cartItem', JSON.stringify(products));

    this.removeItemFromShoppingCart(
      item.product.id.toString(),
      parseInt(localStorage.getItem("cart_id"))
    ).subscribe((data) => {
        console.log("REMOVING FROM CART.......", data)
      }, (err) => {
        console.log(err)
      }
    );
  }

  // Total amount
  public getTotalAmount(): Observable<number> {
    return this.cartItems.pipe(
      map((product: CartItem[]) => {
        return products.reduce((prev, curr: CartItem) => {
          return prev + curr.product.price * curr.quantity;
        }, 0);
      })
    );
  }

  // Update Cart Value
  public updateCartQuantity(
    product: Product,
    quantity: number
  ): CartItem | boolean {
    return products.find((items, index) => {
      if (items.product.id == product.id) {
        const qty = products[index].quantity + quantity;
        const stock = this.calculateStockCounts(products[index], quantity);
        if (qty != 0 && stock) products[index].quantity = qty;
        localStorage.setItem('cartItem', JSON.stringify(products));
        this.updateItemInShoppingCart(
          product.id.toString(),
          parseInt(localStorage.getItem("cart_id")),
          qty
        ).subscribe();
        return true;
      }
    });
  }

  // public getNewTotalAmount(): Observable<number> {
  //   let items: CartItem[] = JSON.parse(localStorage.getItem("checkoutItem"));
  //   return of(
  //     items.reduce((prev, curr: CartItem) => {
  //       return prev + curr.product.price * curr.quantity;
  //     }, 0)
  //   );
  // }

  // ============================================================================
  // my custome methods

  // add item to the item detail table (add item to shopping cart)
  public addToShoppingCartInBackend(itemDetail: Item_detail) {
    return this.httpClient.post<Item_detail>(
      this.shoppingCartUrl + "additem/" + localStorage.getItem("cart_id"),
      itemDetail
    );
  }

  public getNewTotalAmount(): Observable<number> {
    const items: CartItem[] = JSON.parse(localStorage.getItem('checkoutItem'));
    return of(
      items.reduce((prev, curr: CartItem) => {
        return prev + curr.product.price * curr.quantity;
      }, 0)
    );
  }

  public updateItemInShoppingCart(
    productId: string,
    cartId: number,
    quantity: string
  ) {
    const param = new HttpParams()
      .set('itemid', productId)
      .set('cartid', cartId.toString())
      .set('quantity', quantity);

    console.log('this is update item from cart');
    return this.httpClient.put<any>(
      this.shoppingCartUrl + 'editquantity',
      param
    );
  }

  // change status of item in item detail table from 'A' to 'D' (remove item from shopping cart)
  public removeItemFromShoppingCart(productId: string, cartId: number) {
    const param = new HttpParams()
      .set('productid', productId)
      .set('cartid', cartId.toString());

    console.log('this is remove from cart');
    return this.httpClient.put<any>(this.shoppingCartUrl + 'deleteitem', param);
  }
}
