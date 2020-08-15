import { AddressDTO } from "./address-dto";
import { AccountDTO } from "./account-dto";
import { PaymentInformation } from "../payment-information";

export class UserAccountDTO{
    
    id: string;
    role: string;
    addressList: AddressDTO[];
    paymentInformation : PaymentInformation[]; 
    userAccount: AccountDTO;
}