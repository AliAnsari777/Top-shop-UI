export class Address {
  id: number
  state:string
  postcode:string
  addressLineOne:string;
  user_id:string
  city:string;


  constructor(state: string, postcode: string, addressLineOne: string, city: string) {
    this.state = state;
    this.postcode = postcode;
    this.addressLineOne = addressLineOne;
    this.city = city;
  }

}
