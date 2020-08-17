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
  categories = Array<Category>();
  [x: string]: any;
  uploadedText = "Choose file";
  images;
  imageView;
  createdProduct;

  constructor(
    public httpclient: HttpClient,
    public productService: ProductService
  ) {}

  ngOnInit() {
    this.getCategory();
  }

  addProduct(element: NgForm) {
    let FV = element.value;
    let category = new Category();
    category.id = FV.category;

    var product = new Product();
    product.name = FV.name;
    product.quantity = FV.quantity;
    product.price = FV.price;
    product.category_obj = new Category(1, "phone");
    product.discount = FV.discount;
    product.newPro = FV.status;
    product.shortDetails = FV.detail;
    product.description = "this is for test";

    console.log("category id: " + product.category);

    this.productService
      .createProduct(product, this.images[0])
      .subscribe((data) => {
        this.createdProduct = data;
        this.closeDialog(this.createdProduct);
      });
  }

  closeDialog(createdProduct) {
    this.dialogRef.close({ event: "close", createdProduct: createdProduct });
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

  getCategory() {
    console.log("this is get category" + this.categories);

    this.productService.getAllCategory().subscribe((data) => {
      this.categories = data;
    });
  }
}
