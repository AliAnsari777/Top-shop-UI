import { Injectable } from "@angular/core";
import { Product } from "../../../modals/product.model";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CartItem } from "../../../modals/cart-item";
import { map, timeInterval } from "rxjs/operators";
import { Observable, BehaviorSubject, Subscriber, of } from "rxjs";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Item_detail } from "../../../modals/item_detail";
import { Cookie } from "ng2-cookies";

// Get product from Localstorage
let products = JSON.parse(localStorage.getItem("cartItem")) || [];

@Injectable({
  providedIn: "root",
})
export class CartService {
  // Array
  public cartItems: BehaviorSubject<CartItem[]> = new BehaviorSubject([]);
  public observer: Subscriber<{}>;
  public shoppingCartUrl: string;
  public itemDetail: Item_detail;
  public userId = Cookie.get("user_id");
  public cartId: number;

  constructor(public snackBar: MatSnackBar, public httpClient: HttpClient) {
    this.cartItems.subscribe((products) => (products = products));
    this.itemDetail = new Item_detail();
    this.shoppingCartUrl = "http://localhost:8087/shoppingcart/";

    // this.getCartId();
  }

  public getCartId() {
    this.httpClient
      .get<number>(this.shoppingCartUrl + "cartid/" + this.userId)
      .subscribe((data) => {
        this.cartId = data;
      });
  }

  // Get Products
  public getItems(): Observable<CartItem[]> {
    let id = Cookie.get("user_id");

    // if (id != null) {
    const itemsStream = new Observable((observer) => {
      observer.next(products);
      observer.complete();
    });
    return <Observable<CartItem[]>>itemsStream;
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

    // }
  }

  public getCheckoutItems(): CartItem[] {
    return JSON.parse(localStorage.getItem("checkoutItem"));
  }

  // Add to cart
  public addToCart(product: Product, quantity: number) {
    let message, status;
    var item: CartItem | boolean = false;
    // If Products exist
    let hasItem = products.find((items, index) => {
      if (items.product.id == product.id) {
        let qty = products[index].quantity + quantity;
        let stock = this.calculateStockCounts(products[index], quantity);
        if (qty != 0 && stock) {
          products[index]["quantity"] = qty;
          message = "The product " + product.name + " has been added to cart.";
          status = "success";
          this.snackBar.open(message, "×", {
            panelClass: [status],
            verticalPosition: "top",
            duration: 3000,
          });
          console.log(
            "this is in add cart in cart service second: " + product.name
          );

          // this will update the quantity of the product because it is already added to cart
          this.updateItemInShoppingCart(
            product.id.toString(),
            this.cartId,
            qty
          ).subscribe();
        }
        return true;
      }
    });

    // If Products does not exist (Add New Products)
    if (!hasItem) {
      item = { product: product, quantity: quantity };
      products.push(item);
      message = "The product " + product.name + " has been added to cart.";
      status = "success";
      this.snackBar.open(message, "×", {
        panelClass: [status],
        verticalPosition: "top",
        duration: 3000,
      });
      console.log("this is in add cart in cart service first: " + product.name);

      // call add to cart from backend in here
      this.itemDetail.productId = product.id;
      this.itemDetail.productName = product.name;
      this.itemDetail.quantity = quantity;
      this.itemDetail.status = "A";
      this.itemDetail.unitPrice = product.price;
      this.itemDetail.subTotal = product.price * quantity;

      this.addToShoppingCartInBackend(this.itemDetail).subscribe();
    }

    localStorage.setItem("cartItem", JSON.stringify(products));
    return item;
  }

  // Calculate Product stock Counts
  public calculateStockCounts(product: CartItem, quantity): CartItem | Boolean {
    let message, status;
    let qty = product.quantity + quantity;
    let stock = product.product.stock;
    if (stock < qty) {
      // this.toastrService.error('You can not add more items than available. In stock '+ stock +' items.');
      this.snackBar.open(
        "You can not choose more items than available. In stock " +
          stock +
          " items.",
        "×",
        { panelClass: "error", verticalPosition: "top", duration: 3000 }
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
    localStorage.setItem("cartItem", JSON.stringify(products));

    this.removeItemFromShoppingCart(
      item.product.id.toString(),
      this.cartId
    ).subscribe();
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
        let qty = products[index].quantity + quantity;
        let stock = this.calculateStockCounts(products[index], quantity);
        if (qty != 0 && stock) products[index]["quantity"] = qty;
        localStorage.setItem("cartItem", JSON.stringify(products));
        this.updateItemInShoppingCart(
          product.id.toString(),
          this.cartId,
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

  //============================================================================
  // my custome methods

  // add item to the item detail table (add item to shopping cart)
  public addToShoppingCartInBackend(itemDetail: Item_detail) {
    return this.httpClient.post<Item_detail>(
      this.shoppingCartUrl + "additem/" + this.cartId,
      itemDetail
    );
  }

  public getNewTotalAmount(): Observable<number> {
    let items: CartItem[] = JSON.parse(localStorage.getItem("checkoutItem"));
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
      .set("itemid", productId)
      .set("cartid", cartId.toString())
      .set("quantity", quantity);

    console.log("this is update item from cart");
    return this.httpClient.put<any>(
      this.shoppingCartUrl + "editquantity",
      param
    );
  }

  // change status of item in item detail table from 'A' to 'D' (remove item from shopping cart)
  public removeItemFromShoppingCart(productId: string, cartId: number) {
    const param = new HttpParams()
      .set("productid", productId)
      .set("cartid", cartId.toString());

    console.log("this is remove from cart");
    return this.httpClient.put<any>(this.shoppingCartUrl + "deleteitem", param);
  }
}
