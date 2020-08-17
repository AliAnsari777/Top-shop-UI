import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Product } from '../../../../modals/product.model';
import { ProductService } from '../../../shared/services/product.service';
import {Category} from '../../../../modals/Category';

@Component({
  selector: 'app-add-product',
  templateUrl: './addProduct.component.html',
  styleUrls: ['./addProduct.component.sass'],
})
export class AddProductComponent implements OnInit {
  [x: string]: any;
  // name = new FormControl("");

  uploadedText = 'Choose file';
  images;
  imageView;
  createdProduct;
  categories;

  constructor(
    public productService: ProductService
  ) {}

  ngOnInit() {
    this.getAllCategories();
    console.log('categories',this.categories);

  }

  addProduct(element: NgForm) {
    const FV = element.value;

    const product = new Product();
    product.name = FV.name;
    product.quantity = FV.quantity;
    product.price = FV.price;
    console.log('name',FV.category);
    product.category.id = FV.category;
    product.discount = FV.discount;
    product.newPro = FV.newPro;
    product.shortDetails = FV.detail;
    product.brand=FV.brand;
    this.productService
      .createProduct(product, this.images[0])
      .subscribe((data) => {
        this.createdProduct = data;
        this.closeDialog(this.createdProduct);
      });
  }
   getAllCategories() {
    this.productService.getCategories().subscribe(data => {
      console.log('category',data);
      this.categories = data;
    }, (error) => {
      this.errorMessage = error;
    })
  }
  closeDialog(createdProduct) {
    this.dialogRef.close({ event: 'close', createdProduct });
  }
  uploadFile(event) {
    console.log(' >>> upload file: ', event);
    this.uploadedText = '';
    this.images = event.target.files;
    for (const f of event.target.files) {
      this.uploadedText += f.name + ' , ';
    }
    const reader = new FileReader();
    reader.onload = (e) => (this.imageView = reader.result);
    reader.readAsDataURL(this.images[0]);
  }
}
