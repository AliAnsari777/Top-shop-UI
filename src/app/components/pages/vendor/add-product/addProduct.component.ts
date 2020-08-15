import { Component, HostListener, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { Product } from "../../../../modals/product.model";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { ProductService } from "../../../shared/services/product.service";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-add-product",
  templateUrl: "./addProduct.component.html",
  styleUrls: ["./addProduct.component.sass"],
})
export class AddProductComponent implements OnInit {
  [x: string]: any;
  // name = new FormControl("");

  uploadedText = "Choose file";
  images;
  imageView;
  createdProduct;

  constructor(
    public httpclient: HttpClient,
    public productService: ProductService
  ) {}

  ngOnInit() {}

  addProduct(element: NgForm) {
    let FV = element.value;

    var product = new Product();
    product.name = FV.name;
    product.quantity = FV.quantity;
    product.price = FV.price;
    // product.category.name = FV.category;
    product.discount = FV.discount;
    product.newPro = FV.status;
    product.shortDetails = FV.detail;

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
    console.log(" >>> upload file: ", event);
    this.uploadedText = "";
    this.images = event.target.files;
    for (let f of event.target.files) {
      this.uploadedText += f.name + " , ";
    }
    const reader = new FileReader();
    reader.onload = (e) => (this.imageView = reader.result);
    reader.readAsDataURL(this.images[0]);
  }
}
