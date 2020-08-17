import { AddressDTO } from './address-dto';
import { PaymentInformation } from '../payment-information';

export class UserDTO{

    id? : string;
    role : string;
    firstName : string;
    lastName : string;
    addressList : AddressDTO[];
    paymentInformation : PaymentInformation[]; 
    user_role : string;


}