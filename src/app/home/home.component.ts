import { Component, OnInit, OnDestroy } from '@angular/core';
import { BrechoService } from '../services/brecho.service';
import { SaleService } from '../services/sale.service';
import { Sale, SaleItem } from '../models/sale.model';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  public sales: Sale[] = [];
  public salesByUser: { user: string, result: any }[] = [];
  public salesByDate: { data: string, result: any }[] = [];
  private subscription: Subscription;

  constructor(
    private brechoService: BrechoService,
    private salesService: SaleService,
    public authService: AuthService,
    private toastr: ToastrService) { }

  ngOnInit() {
    if (this.brechoService.selectedBrecho) {
      this.fecthSales(this.brechoService.selectedBrecho);
    }
    this.brechoService.onBrechoSelection.subscribe(brecho => {
      this.fecthSales(brecho);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  fecthSales(brecho) {
    let loading;
    setTimeout(() => {
      loading = this.toastr.info('Carregando relatório de vendas...', 'Carregando...', { disableTimeOut: true });
    });
    this.subscription = this.salesService.getByQuery({ orderBy: 'brechoKey', equalTo: brecho.key }).subscribe(res => {
      if (this.authService.loggedUser.adm !== 'Sim') {
        res = res.filter(sale => sale.user === this.authService.loggedUser.displayName);
      }
      this.sales = res;
      this.filterByUser(this.sales);
      this.filterByDate(this.sales);
      this.toastr.remove(loading.toastId);
    });
  }

  filterByUser(sales: Sale[]) {
    this.salesByUser = [];
    const allUsers: string[] = [];
    sales.forEach((sale: Sale) => {
      if (allUsers.find(user => user === sale.user)) {
        return;
      }
      allUsers.push(sale.user);
    });
    allUsers.forEach(user => {
      const saleByUser = { user: user, result: this.calculateResult(sales.filter(sale => sale.user === user)) };
      this.salesByUser.push(saleByUser);
    });
  }

  filterByDate(sales: Sale[]) {
    this.salesByDate = [];
    const allDates: string[] = [];
    sales.forEach((sale: Sale) => {
      if (allDates.find(date => date === new Date(JSON.parse(sale.date)).toLocaleDateString('pt'))) {
        return;
      }
      allDates.push(new Date(JSON.parse(sale.date)).toLocaleDateString('pt'));
    });
    allDates.forEach(data => {
      const saleByData = {
        data: data, result: this.calculateResult(
          sales.filter(sale => new Date(JSON.parse(sale.date)).toLocaleDateString('pt') === data))
      };
      this.salesByDate.push(saleByData);
    });
  }

  calculateResult(sales: Sale[]) {
    const result = { totalBruto: 0, totalDesconto: 0, totalLiquido: 0, totalVendas: 0, totalItems: 0 };
    sales.forEach((sale: Sale) => {
      result.totalBruto += sale.valorBruto;
      result.totalDesconto += sale.desconto;
      result.totalLiquido += sale.valorLiquido;
      sale.produtos.forEach((item: SaleItem) => result.totalItems += item.quantidade);
    });
    result.totalVendas = sales.length;
    return result;
  }

}
