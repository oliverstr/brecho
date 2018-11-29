import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ConfirmModalComponent } from 'src/app/shared/components/confirm-modal/confirm-modal.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { BrechoComponent } from './brecho/brecho.component';
import { ProductsComponent } from './products/products.component';
import { UsersComponent } from './users/users.component';

@NgModule({
  imports: [
    CommonModule,
    Ng2SmartTableModule,
    ModalModule.forRoot(),
    SharedModule
  ],
  declarations: [ProductsComponent, BrechoComponent, UsersComponent],
  entryComponents: [ConfirmModalComponent]
})
export class CrudModule { }
