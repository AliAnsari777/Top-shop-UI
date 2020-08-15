import {Component, HostListener, OnInit} from '@angular/core';
import {UserService} from "../../../services/UserService";
import {NgForm} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import { FormControl } from '@angular/forms';
import {RegisteredUser} from "../../../models/userModel/RegisteredUser";
import {Address} from "../../../models/userModel/Address";
import {UserAccount} from "../../../models/userModel/UserAccount";
import {PaymentInformation} from "../../../models/userModel/PaymentInformation";
import {Router} from "@angular/router";

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.sass']
})
export class MyAccountComponent implements OnInit {
  public isLoggedIn = false;
  public username;
  public password;
  name = new FormControl('');



  constructor(private _service:UserService,private _snackBar:MatSnackBar, private router: Router){}

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
    var addresss = [address];
    var paymentInformation = new PaymentInformation(value.nameOnCard,value.secCode,value.expDate,value.cardType,value.cardNumber)
    var paymentInformations = [paymentInformation];
    var userAccount = new UserAccount(value.username,value.password,value.firstName,value.lastName,null,value.email,"USER");
    var registeredUser = new RegisteredUser("REGISTERED_USER",addresss,paymentInformations,"USER",userAccount);


    console.log(registeredUser);
    this._service.register(registeredUser,element);

    this.router.navigateByUrl('/').then(
      () => {this.router.navigateByUrl('pages/my-account');});
    element.reset();

  }








}
