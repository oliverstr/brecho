import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ProductsService } from 'src/app/services/products.service';
import { Observable } from 'rxjs';
import { Product } from 'src/app/models/product.model';
import { map } from 'rxjs/operators';
import { BrechoService } from 'src/app/services/brecho.service';

@Component({
  selector: 'app-modal-products',
  templateUrl: './modal-products.component.html',
  styleUrls: ['./modal-products.component.scss']
})
export class ModalProductsComponent implements OnInit {

  onConfirm: Function;
  products$: Observable<Product[]>;

  constructor(public bsModalRef: BsModalRef, private productService: ProductsService, private brechoService: BrechoService) { }

  ngOnInit() {
    this.products$ = this.productService.productsFB.pipe(
      map((produts: Product[]) => produts
        .filter(product => product.brechoKey === this.brechoService.selectedBrecho.key)
        .sort((a: Product, b: Product) => a.preco - b.preco))
    );
  }

  confirm(val: boolean) {
    if (this.onConfirm) {
      this.onConfirm(val);
    }
    this.bsModalRef.hide();
  }

}
