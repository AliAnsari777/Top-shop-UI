import { Component, OnInit, Input, Output , EventEmitter } from '@angular/core';

@Component({
  selector: 'app-proceed',
  templateUrl: './proceed.component.html',
  styleUrls: ['./proceed.component.scss']
})
export class ProceedComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Input() public modal : boolean;

  @Output() placeOrder = new EventEmitter();

  @Output() closeModal = new EventEmitter();

  checkout(){
    this.placeOrder.emit();
    this.close()
  }

  public close(){
    this.modal = false;
    this.closeModal.emit(this.modal)
  }

}
