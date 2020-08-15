import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Cookie } from "ng2-cookies";
import { Observable } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
//import {RegisteredVendor} from "../models/VendorModel/RegisteredVendor";
import { NgxSpinnerService } from "ngx-spinner";
import { Vendor } from "../models/vendorModel/Vendor";
@Injectable()
export class VendorService {
  public clientId = "newClient";
  public redirectUri = "http://localhost:8089/";
  public userRole = Cookie.get("user_role");

  constructor(
    private _http: HttpClient,
    private _snackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
    private _router: Router
  ) {}

  retrieveToken(username, password) {
    this.spinner.show();
    this._http
      .post<any>("http://localhost:8080/authenticate", {
        password: password,
        username: username,
        email: "ymengit2u@outlook.com",
      })
      .subscribe(
        (data) => {
          this.saveToken(data);
        },
        (err) => {
          this._snackBar.open(
            "Unable to login please insert correct username and password",
            "",
            {
              duration: 3000,
            }
          );
        }
      );
    this.spinner.hide();
  }
  saveToken(data) {
    var expireDate = new Date().getTime() + 1000 * data.token.expires_in;
    Cookie.set("access_token", data.token.tokaccess_token, expireDate);
    Cookie.set("id_token", data.token.id_token, expireDate);
    Cookie.set("user_role", data.userAccount.role);
    console.log(data.vendorAccount.id);
    console.log(data);
    //let userinfo = this.getUserId(data.userAccount.id);
    this._router.navigateByUrl("/vendor");
    this._snackBar.open("Successfully logged in", "", {
      duration: 3000,
    });
  }

  getResource(resourceUrl) {
    // var headers = new HttpHeaders({
    //   'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
    //   'Authorization': 'Bearer ' + Cookie.get('access_token')
    // });
    // return this._http.get(resourceUrl, {headers: headers})
    //   .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  checkCredentials() {
    return Cookie.check("access_token");
  }

  logout() {
    let token = Cookie.get("id_token");
    Cookie.delete("access_token");
    Cookie.delete("id_token");
    this._router.navigateByUrl("/");
    this._snackBar.open("Successfully logged out", "", {
      duration: 3000,
    });
  }

  register(vendor: Vendor, element) {
    this.spinner.show();
    this._http.post<any>("http://localhost:8086/api/vendor", vendor).subscribe(
      (data) => {
        this.spinner.hide();
        this._snackBar.open(
          "vendor account created Please check your email",
          "",
          {
            duration: 6000,
          }
        );
        this._router.navigate(["/pages/vendor"]);
        this.spinner.hide();
        element.reset();
        element.valid = true;
      },
      (err) => {
        this.spinner.hide();
        this.error(err);
      }
    );
  }

  activate(data) {
    console.log(data);
  }

  error(err) {
    console.log(err.error);
    var message;
    if (err.error.message == null || err.error.message == "")
      message = "unable to connect to server";
    else message = err.error.message;
    this._snackBar.open(message, "", {
      duration: 3000,
    });
  }

  private getUserId(id: number) {
    // let headers = new HttpHeaders({'Authorization': 'Bearer '+Cookie.get("ccess_token")});
    return this._http
      .get<any>("http://localhost:8086/api/vendor/getByAccountId/" + id)
      .subscribe(
        (data) => {
          return data;
        },
        (err) => {
          return err;
        }
      );
  }

  getRequest() {}
}
