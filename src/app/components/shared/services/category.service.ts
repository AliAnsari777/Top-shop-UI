import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subscriber } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Product } from 'src/app/modals/product.model';
import { MatSnackBar } from '@angular/material';
import { map } from 'rxjs/operators';
import {Category} from "../../../modals/Category";



// Get product from Localstorage
let categories = JSON.parse(localStorage.getItem("compareItem")) || [];

@Injectable({
  providedIn: 'root'
})
export class CategoryService {


  private _url: string = "assets/data/";
  public url = "assets/data/banners.json";

  public compareProducts : BehaviorSubject<Category[]> = new BehaviorSubject([]);
  public observer   :  Subscriber<{}>;

  constructor(private httpClient: HttpClient, public snackBar: MatSnackBar) {
    this.compareProducts.subscribe(categories => categories = categories)
  }

  private categories(): Observable<Category[]> {
    return this.httpClient.get<Category[]>('http://localhost:8083/category/getAll');
  }




  // Get Banners
  public getCategories(): Observable<Category[]> {
    return this.categories();
  }


  // Get Products By Id
  public getCategory(id: number): Observable<Category> {
    return this.categories().pipe(map(items => {
      return items.find((item: Category) =>
      { return item.id === id; });
    }));
    // return this.products.find(product=> product.id === id);

    // return this.httpClient.get<Product>(this._url + 'product-' + id + '.json');
  }








}
