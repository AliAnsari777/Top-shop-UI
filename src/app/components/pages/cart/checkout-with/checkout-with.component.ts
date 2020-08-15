import { Component, OnInit , Input , Output , EventEmitter } from '@angular/core';
import { CartItem } from 'src/app/modals/cart-item';

@Component({
  selector: 'app-checkout-with',
  templateUrl: './checkout-with.component.html',
  styleUrls: ['./checkout-with.component.sass']
})
export class CheckoutWithComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  checked :boolean = false;

  @Input() item : CartItem;

  @Output() eventEmitter = new EventEmitter();

  sendMessage(){
    this.eventEmitter.emit({ 
      checked : this.checked , 
      item : this.item
    })
  }


}
