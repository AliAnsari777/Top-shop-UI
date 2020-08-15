import { Component, OnInit, Input } from '@angular/core';


import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {ProductService} from "../../../shared/services/product.service";
import {Product} from "../../../../modals/product.model";


@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.component.html',
  styleUrls: ['./addproduct.component.css']
})
export class AddproductComponent implements OnInit {

  @Input()
  product: Product;
  private selectedFile;
  imgURL: any;

  constructor(private httpClientService: ProductService,
              private activedRoute: ActivatedRoute,
              private router: Router,
              private httpClient: HttpClient) { }

  ngOnInit() {
  }

  public onFileChanged(event) {
    console.log(event);
    this.selectedFile = event.target.files[0];

    let reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (event2) => {
      this.imgURL = reader.result;
    };

  }

  saveBook() {

    const uploadData = new FormData();
    uploadData.append('imageFile', this.selectedFile, this.selectedFile.name);
    this.selectedFile.imageName = this.selectedFile.name;

    this.httpClient.post('http://localhost:8083/product/upload', uploadData, { observe: 'response' })
      .subscribe((response) => {
          if (response.status === 200) {
            this.httpClientService.addProduct(this.product).subscribe(
              (book) => {
                this.router.navigate(['admin', 'books']);
              }
            );
            console.log('Image uploaded successfully');
          } else {
            console.log('Image not uploaded successfully');
          }
        }
      );
  }
}
