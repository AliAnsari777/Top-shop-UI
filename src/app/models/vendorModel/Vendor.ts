import {Address} from "./Address";
import {PaymentInformation} from "./PaymentInformation";
import { UserAccount } from './UserAccount';

export class Vendor{
  private id:number;
  private address:Address;
  private paymentInformation: PaymentInformation[];
  private userAccount : UserAccount;
  

  constructor(address: Address, paymentInformation: PaymentInformation[], userAccount: UserAccount) {
    this.address = address;
    this.paymentInformation = paymentInformation;
    this.userAccount = userAccount;
  }

  

}


