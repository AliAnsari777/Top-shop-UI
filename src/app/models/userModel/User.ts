import {Address} from "./Address";
import {UserAccount} from "./UserAccount";
import {PaymentInformation} from "./PaymentInformation";

export class User{
  private id:number;
  private role:string;
  private addressList:Address[];
  private paymentInformation: PaymentInformation[];
  private user_role: string;


  constructor(role: string, address: Address[], paymentInformation: PaymentInformation[], userAccount: UserAccount, user_role: string) {
    this.role = role;
    this.addressList = address;
    this.paymentInformation = paymentInformation;
    this.user_role = user_role;
  }

}


