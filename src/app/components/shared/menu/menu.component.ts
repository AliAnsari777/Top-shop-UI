import { Component, OnInit } from "@angular/core";
import { VendorService } from "../../../services/vendor-service.service";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.sass"],
})
export class MenuComponent implements OnInit {
  userRole: string;

  constructor(private vendorService: VendorService) {}

  ngOnInit() {
    this.userRole = this.vendorService.userRole;
    console.log("this is user role: " + this.userRole);
  }
  openMegaMenu() {
    let pane = document.getElementsByClassName("cdk-overlay-pane");
    [].forEach.call(pane, function (el) {
      if (el.children.length > 0) {
        if (el.children[0].classList.contains("mega-menu")) {
          el.classList.add("mega-menu-pane");
        }
      }
    });
  }
}
