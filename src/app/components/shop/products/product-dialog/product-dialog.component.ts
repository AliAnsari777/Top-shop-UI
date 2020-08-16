import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { Product } from '../../../../modals/product.model';
import { ProductService } from '../../../shared/services/product.service';
import { CartService } from '../../../shared/services/cart.service';

@Component({
  selector: 'app-product-dialog',
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.sass']
})
export class ProductDialogComponent implements OnInit {

  public products           :   Product[] = [];
  public counter            :   number = 1;
  public variantImage       :   any = '';
  public selectedColor      :   any = '';
  public selectedSize       :   any = '';

  constructor(private router: Router, public productsService: ProductService, private cartService: CartService, public dialogRef: MatDialogRef<ProductDialogComponent>, @Inject(MAT_DIALOG_DATA) public product: Product) { }

  ngOnInit() {
    this.productsService.getProducts().subscribe(product => this.products = product);

  }


  public addToCart(product: Product, quantity) {
    if (quantity == 0) return false;
    this.cartService.addToCart(product, parseInt(quantity));
  }

  public close(): void {
    this.dialogRef.close();
  }

  public increment() {
    this.counter += 1;
  }

  public decrement() {
    if(this.counter >1){
       this.counter -= 1;
    }
  }

     // Add to cart
     public buyNow() {
      this.router.navigate(['/home/product', this.product.id]);
      this.close();
   }

}
