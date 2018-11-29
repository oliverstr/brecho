import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdvComponent } from './pdv.component';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ModalProductsComponent } from './modal-products/modal-products.component';
import { UiSwitchModule } from 'ngx-toggle-switch';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from 'ng2-currency-mask/src/currency-mask.config';
import { AllSalesComponent } from './all-sales/all-sales.component';
import { RouterModule } from '@angular/router';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
  align: 'right',
  allowNegative: true,
  decimal: ',',
  precision: 2,
  prefix: 'R$ ',
  suffix: '',
  thousands: '.'
};


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ModalModule.forRoot(),
    UiSwitchModule,
    CurrencyMaskModule,
    RouterModule,
    TooltipModule.forRoot()
  ],
  declarations: [PdvComponent, ModalProductsComponent, AllSalesComponent],
  entryComponents: [ModalProductsComponent],
  providers: [
    { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }
],
})
export class PdvModule { }
