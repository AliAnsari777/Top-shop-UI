import { Component, OnInit, Input, AfterViewInit } from "@angular/core";
import { BillingInformation } from "../../../../modals/billing-information";

@Component({
  selector: "app-billing-info",
  templateUrl: "./billing-info.component.html",
  styleUrls: ["./billing-info.component.sass"],
})
export class BillingInfoComponent implements AfterViewInit {
  @Input() billing: BillingInformation;

  billingInformation: BillingInformation = new BillingInformation();

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.billingInformation = this.billing;
    console.log(this.billingInformation);
  }
}
