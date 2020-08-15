export class UserAccount {
  private id: number;
  private username: string;
  password: string;
  firstName: string;
  lastName: string;
  token: string;
  email: string;
  role: String;


  constructor(username: string, password: string, firstName: string, lastName: string, token: string, email: string, role: String) {
    this.username = username;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.token = token;
    this.email = email;
    this.role = role;
  }

}
