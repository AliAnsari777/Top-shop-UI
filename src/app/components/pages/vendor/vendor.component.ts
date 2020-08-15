import {Component, HostListener, OnInit} from '@angular/core';
import {VendorService} from "../../../services/vendor-service.service";
import {NgForm} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import { FormControl } from '@angular/forms';
//import {RegisteredVendor} from "../../../models/vendorModel/RegisteredVendor";
import {Address} from "../../../models/VendorModel/Address";
import {PaymentInformation} from "../../../models/VendorModel/PaymentInformation";
import {Router} from "@angular/router";
//import { UserAccount } from 'src/app/models/vendorModel/UserAccount';
import { Vendor } from 'src/app/models/vendorModel/Vendor';
import { UserAccount } from 'src/app/models/vendorModel/UserAccount';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.sass']
})
export class VendorComponent implements OnInit {
  public isLoggedIn = false;
  public username;
  public password;
  name = new FormControl('');



  constructor(private _service:VendorService,private _snackBar:MatSnackBar, private router: Router){}

  ngOnInit(){
    this.isLoggedIn = this._service.checkCredentials();
    let i = window.location.href.indexOf('code');
    if(!this.isLoggedIn && i != -1){
    }
  }


  login(element: NgForm) {
    this.username = element.value.username;
    this.password = element.value.password;
    console.log(element);
    if(element.valid)
    this._service.retrieveToken(this.username,this.password);
  }

  logout() {
    this._service.logout();
  }

  register(element: NgForm){

    console.log(element.value);
    var value = element.value;
    var address = new Address(value.state,value.postcode,value.addressLineOne,value.town);
    var paymentInformation = new PaymentInformation(value.nameOnCard,value.secCode,value.expDate,value.cardType,value.cardNumber)
    var paymentInformations = [paymentInformation];
    var userAccount = new UserAccount(value.username,value.password,value.firstName,value.lastName,null,value.email,"USER");
    var vendor = new  Vendor(address,paymentInformations,userAccount);


    console.log(vendor);
    this._service.register(vendor,element);

    this.router.navigateByUrl('/').then(
      () => {this.router.navigateByUrl('pages/vendor');});

  }








}

