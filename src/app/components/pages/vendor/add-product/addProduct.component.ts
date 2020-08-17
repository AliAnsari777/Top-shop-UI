import { Component, HostListener, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { Product } from "../../../../modals/product.model";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { ProductService } from "../../../shared/services/product.service";
import { MatDialogRef } from "@angular/material/dialog";
import { Category } from "../../../../modals/Category";

@Component({
  selector: "app-add-product",
  templateUrl: "./addProduct.component.html",
  styleUrls: ["./addProduct.component.sass"],
})
export class AddProductComponent implements OnInit {
  // categories = Array<Category>();
  [x: string]: any;
  uploadedText = "Choose file";
  images;
  imageView;
  createdProduct;
  categories;

  constructor(public productService: ProductService) {}

  ngOnInit() {
    this.getCategory();
  }

  // confilict after merging and I didn't find out which one i should keep
  // addProduct(element: NgForm) {
  //   let FV = element.value;
  //   let category = new Category();
  //   category.id = FV.category;
  //   this.getAllCategories();
  //   console.log('categories',this.categories);

  // }

  addProduct(element: NgForm) {
    const FV = element.value;

    const product = new Product();
    product.name = FV.name;
    product.quantity = FV.quantity;
    product.price = FV.price;
    console.log("name", FV.category);
    product.category.id = FV.category;
    product.discount = FV.discount;
    product.newPro = FV.status;
    product.shortDetails = FV.detail;

    console.log("category id: " + product.category);

    this.productService
      .createProduct(product, this.images[0])
      .subscribe((data) => {
        this.createdProduct = data;
        this.closeDialog(this.createdProduct);
      });
  }
  getAllCategories() {
    this.productService.getCategories().subscribe(
      (data) => {
        console.log("category", data);
        this.categories = data;
      },
      (error) => {
        this.errorMessage = error;
      }
    );
  }
  closeDialog(createdProduct) {
    this.dialogRef.close({ event: "close", createdProduct });
  }

  uploadFile(event) {
    this.uploadedText = "";
    this.images = event.target.files;
    for (let file of event.target.files) {
      this.uploadedText += file.name + " , ";
    }
    const reader = new FileReader();
    reader.onload = (e) => (this.imageView = reader.result);
    reader.readAsDataURL(this.images[0]);
  }
}
