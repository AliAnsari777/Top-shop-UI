// Product Tag
import { Category } from "./Category";

export type ProductTags = "nike" | "puma" | "lifestyle" | "caprese";

// Product Colors
export type ProductColor =
  | "white"
  | "black"
  | "red"
  | "green"
  | "purple"
  | "yellow"
  | "blue"
  | "gray"
  | "orange"
  | "pink";

export class Product {
  id?: number;
  name?: string;
  price?: number;
  salePrice?: number;
  discount?: number;
  picture_url?: string;
  shortDetails?: string;
  description?: string;
  quantity?: number;
  newPro?: boolean;
  brand?: string;
  sale?: boolean;
  category?: number;
  category_obj?: Category;
  tags?: ProductTags[];
  colors?: ProductColor[];

  constructor(
    id?: number,
    name?: string,
    price?: number,
    salePrice?: number,
    discount?: number,
    pictures?: string,
    shortDetails?: string,
    description?: string,
    quantity?: number,
    newPro?: boolean,
    brand?: string,
    sale?: boolean,
    category?: number,
    category_obj?: Category,
    tags?: ProductTags[],
    colors?: ProductColor[]
  ) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.salePrice = salePrice;
    this.discount = discount;
    this.picture_url = pictures;
    this.shortDetails = shortDetails;
    this.description = description;
    this.quantity = quantity;
    this.newPro = newPro;
    this.brand = brand;
    this.sale = sale;
    this.category = category;
    this.category_obj = category_obj;
    this.tags = tags;
    this.colors = colors;
  }
}
// Color Filter
export interface ColorFilter {
  color?: ProductColor;
}
