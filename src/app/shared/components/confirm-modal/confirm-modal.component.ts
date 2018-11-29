import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css']
})
export class ConfirmModalComponent {

  title = 'Confirmação';
  closeBtnName = 'Cancelar';
  confirmBtnName = 'Confirmar';
  confirmBtnClass = 'btn-primary';
  message = 'Confirmar ação?';
  onConfirm: Function;
  showConfirmBtn: true;

  constructor(public bsModalRef: BsModalRef) { }

  confirm(val: boolean) {
    if (this.onConfirm) {
      this.onConfirm(val);
    }
    this.bsModalRef.hide();
  }

}
