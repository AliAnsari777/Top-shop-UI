import {UserAccount} from "./UserAccount";
import {Address} from "./Address";
import {User} from "./User";
import {PaymentInformation} from "./PaymentInformation";

export class RegisteredUser extends User{
  private userAccount: UserAccount;


  constructor( role: string, address: Address[], paymentInformation: PaymentInformation[], user_role: string, userAccount: UserAccount) {
    super( role, address, paymentInformation, userAccount, user_role);
    this.userAccount = userAccount;
  }

}
