import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Cookie } from "ng2-cookies";
import { Observable } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { RegisteredUser } from "../models/userModel/RegisteredUser";
import { NgxSpinnerService } from "ngx-spinner";
@Injectable()
export class UserService {
  public clientId = "newClient";
  public redirectUri = "http://localhost:8089/";

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
    Cookie.set("access_token", data.token, expireDate);
    Cookie.set("id_token", data.token.id_token, expireDate);
    Cookie.set("user_id", data.userAccount.id);
    console.log();
    console.log(data);
    //let userinfo = this.getUserId(data.userAccount.id);
    this._router.navigateByUrl("/");
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
    Cookie.delete("user_id");
    Cookie.deleteAll();
    this._router.navigateByUrl("/");
    this._snackBar.open("Successfully logged out", "", {
      duration: 3000,
    });
  }

  register(registeredUser: RegisteredUser, element) {
    this.spinner.show();
    this._http
      .post<any>("http://localhost:8086/api/user", registeredUser)
      .subscribe(
        (data) => {
          this.spinner.hide();
          this._snackBar.open(
            "user account created Please check your email",
            "",
            {
              duration: 6000,
            }
          );
          this._router.navigate(["/pages/my-account"]);
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
      .get<any>("http://localhost:8086/api/user/getByAccountId/" + id)
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
