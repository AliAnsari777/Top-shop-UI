import { Component, Input, OnInit } from "@angular/core";
import { ProductService } from "../../shared/services/product.service";
import { CartService } from "../../shared/services/cart.service";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Product } from "../../../modals/product.model";
import { CartItem } from "../../../modals/cart-item";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.sass"],
})
export class HomeComponent implements OnInit {
  products: Product[];
  public banners = [];

  shoppingCartItems: CartItem[] = [];
  wishlistItems: Product[] = [];

  public featuredProducts: Array<Product>;
  public onSaleProducts: Array<Product>;
  public topRatedProducts: Array<Product>;
  public newArrivalsProducts: Array<Product>;

  public slides = [
    {
      title: "Huge sale",
      subtitle: "Up to 70%",
      image: "assets/images/carousel/banner1.jpg",
    },
    {
      title: "Biggest discount",
      subtitle: "Check the promotion",
      image: "assets/images/carousel/banner2.jpg",
    },
    {
      title: "Biggest sale",
      subtitle: "Dont miss it",
      image: "assets/images/carousel/banner3.jpg",
    },
    {
      title: "Our best products",
      subtitle: "Special selection",
      image: "assets/images/carousel/banner4.jpg",
    },
    {
      title: "Massive sale",
      subtitle: "Only for today",
      image: "assets/images/carousel/banner5.jpg",
    },
  ];

  constructor(
    private productService: ProductService,
    private httpClient: HttpClient,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.cartService
      .getItems()
      .subscribe(
        (shoppingCartItems) => (this.shoppingCartItems = shoppingCartItems)
      );
    this.productService.getProducts().subscribe((product: Product[]) => {
      this.products = product;
      console.log(product);
    });
  }

  // Collection banner
  public discount = [
    {
      image: "assets/images/product/tablet_bn.png",
      title: "Tablets, Smartphones and more",
      subtitle: "Sale up to 30%",
    },
    {
      image: "assets/images/product/camera_bn.png",
      title: "New Cameras Collection",
      subtitle: "Sale up to 30%",
    },
  ];
  // ====================================================================
}
