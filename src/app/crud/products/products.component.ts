
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { ProductsService } from 'src/app/services/products.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ListHelper } from 'src/app/shared/helpers/list.helper';
import { BrechoService } from 'src/app/services/brecho.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent extends ListHelper implements OnInit, OnDestroy {

  public data: Product[] = [];
  private subscription: Subscription;

  constructor(public productsServices: ProductsService, public modalService: BsModalService, private brechoService: BrechoService) {
    super(new Product(), 'produto', 'codigo', productsServices, modalService);
  }

  ngOnInit() {
    this.getProducts(this.brechoService.selectedBrecho.key);
    this.brechoService.onBrechoSelection.subscribe(brecho => this.getProducts(brecho.key));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getProducts(brechoKey) {
    this.subscription = this.productsServices.productsFB.subscribe((products: Product[]) => {
      this.data = products.filter((product: Product) => product.brechoKey === brechoKey);
    });
  }

}
