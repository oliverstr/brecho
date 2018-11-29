import { Component, OnInit } from '@angular/core';
import { BrechoService } from 'src/app/services/brecho.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Brecho } from 'src/app/models/brecho.model';
import { ListHelper } from 'src/app/shared/helpers/list.helper';

@Component({
  selector: 'app-brecho',
  templateUrl: './brecho.component.html',
  styleUrls: ['./brecho.component.css']
})
export class BrechoComponent extends ListHelper implements OnInit {

  constructor(public brechoService: BrechoService, public modalService: BsModalService) {
    super(new Brecho(), 'brechó', 'nome', brechoService, modalService);
  }

  ngOnInit() {
    this.data$ = this.brechoService.brechoFB;
  }

}
