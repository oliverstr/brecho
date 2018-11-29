import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Sale } from 'src/app/models/sale.model';
import { SaleService } from 'src/app/services/sale.service';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { BrechoService } from 'src/app/services/brecho.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-all-sales',
  templateUrl: './all-sales.component.html',
  styleUrls: ['./all-sales.component.scss']
})
export class AllSalesComponent implements OnInit, OnDestroy {

  public sales: Sale[];
  private subscription: Subscription;

  constructor(
    private salesService: SaleService,
    private authService: AuthService,
    private brechoService: BrechoService,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.loadSales(this.brechoService.selectedBrecho);
    this.brechoService.onBrechoSelection.subscribe(brecho => this.loadSales(brecho));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  removeSale(sale) {
    this.salesService.remove(sale);
  }

  loadSales(brecho) {
    let loading;
    setTimeout(() => loading = this.toastr.info('Carregando relatório de vendas...', 'Carregando...', { disableTimeOut: true }));

    this.subscription = this.salesService.getByQuery({ orderBy: 'brechoKey', equalTo: brecho.key }).subscribe(sales => {
      this.sales = sales.map(sale => {
        sale.date = new Date(JSON.parse(sale.date));
        return sale;
      }).sort((a, b) => b.date - a.date);
      if (this.authService.loggedUser.adm !== 'Sim') {
        this.sales = this.sales.filter(sale => sale.user === this.authService.loggedUser.displayName);
      }
      this.toastr.remove(loading.toastId);
    });
  }

}
