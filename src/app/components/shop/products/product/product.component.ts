import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { CartService } from 'src/app/components/shared/services/cart.service';
import { ProductService } from 'src/app/components/shared/services/product.service';
import { CategoryService } from 'src/app/components/shared/services/category.service';
import { WishlistService } from 'src/app/components/shared/services/wishlist.service';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Product } from 'src/app/modals/product.model';
import { ProductDialogComponent } from '../product-dialog/product-dialog.component';
import {Category} from "../../../../modals/Category";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.sass']
})
export class ProductComponent implements OnInit {

  @Output() onOpenProductDialog: EventEmitter<any> = new EventEmitter();
 @Input() product: Product;
  private category:any;

url='http://localhost:8083/product/getImage?image_id=';
  constructor(private cartService: CartService, public productsService: ProductService,  public categoryService: CategoryService,private wishlistService: WishlistService, private dialog: MatDialog, private router: Router ) { }

  ngOnInit() {

  }

     // Add to cart
     public addToCart(product: Product,  quantity: number = 1) {
       this.cartService.addToCart(product,quantity);
       // console.log("product check", quantity);

       this.categoryService.getCategories().subscribe((data)=>{
         this.populateCategory(data);
       });


    }
    populateCategory(data: Category[]) {
      console.log("category" + data[0].name);
  }


  // Add to wishlist
    public addToWishlist(product: Product) {
      this.wishlistService.addToWishlist(product);
   }

    // Add to compare
    public addToCompare(product: Product) {
      this.productsService.addToCompare(product);
   }


  public openProductDialog(product){
    let dialogRef = this.dialog.open(ProductDialogComponent, {
        data: product,
        panelClass: 'product-dialog',
    });
    dialogRef.afterClosed().subscribe(product => {
      if(product){
        this.router.navigate(['/products', product.id, product.name]);
      }
    });
  }

}
