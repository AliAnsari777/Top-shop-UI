import { AddressDTO } from './address-dto';
import { PaymentInformation } from '../payment-information';

export class UserDTO{

    id? : string;
    role : string; //"USER",
    firstName : string; //"yome",
    lastName : string; //"mg",
    addressList : AddressDTO[];
    paymentInformation : PaymentInformation[]; /*[{
            "nameOnCard":"yome mengistu",
            "secCode":"113",
            "expDate":"06/22",
            "cardNumber":"1234567890123456",
            "cardType":"VISA"
             }], */
    user_role : string //"GUEST_USER"


}