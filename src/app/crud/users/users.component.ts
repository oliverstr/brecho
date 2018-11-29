import { Component, OnInit } from '@angular/core';
import { ListHelper } from 'src/app/shared/helpers/list.helper';
import { UsersService } from 'src/app/services/users.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent extends ListHelper implements OnInit {

  constructor(public usersService: UsersService, public modalService: BsModalService) {
    super(new User(), 'usuário', 'email', usersService, modalService);
  }

  ngOnInit() {
    this.data$ = this.usersService.usersFB;
  }

}
