import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { Sale, SaleItem } from '../models/sale.model';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ProductsService } from '../services/products.service';
import { Product } from '../models/product.model';
import { AuthService } from '../services/auth.service';
import { BrechoService } from '../services/brecho.service';
import { SaleService } from '../services/sale.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalProductsComponent } from './modal-products/modal-products.component';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pdv',
  templateUrl: './pdv.component.html',
  styleUrls: ['./pdv.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PdvComponent implements OnInit, OnDestroy {

  public sale = new Sale();
  public productCode: string;
  public productCode$: Subject<string> = new Subject();
  public selectedProduct = new SaleItem(new Product(), 1);
  public bsModalRef: BsModalRef;
  public adding = true;
  public totalItems = 0;
  public underSavingConnection = false;
  private productCodeSubscription: Subscription;
  private allProducts: Product[] = [];
  @ViewChild('codInput') codInput: ElementRef;

  constructor(
    private productService: ProductsService,
    private authService: AuthService,
    private brechoService: BrechoService,
    private saleService: SaleService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.initiateSearchProduct();
    this.getAllProducts(this.brechoService.selectedBrecho);
    this.brechoService.onBrechoSelection.subscribe(brecho => this.getAllProducts(brecho));
    this.fetchSaleFromParam();
    this.codInput.nativeElement.focus();
  }

  getAllProducts(brecho) {
    this.productService.productsFB.subscribe(items => {
      this.allProducts = items.filter(product => product.brechoKey === brecho.key);
    });
  }

  fetchSaleFromParam() {
    const key = this.route.snapshot.params.key;
    if (key) {
      this.saleService.saleFB.subscribe(sales => {
        const sale = sales.find(saleItem => saleItem.key === key);
        if (sale) {
          this.sale = sale;
          this.calculaTotalItems();
        }
      });
    }
  }

  ngOnDestroy() {
    this.productCodeSubscription.unsubscribe();
  }

  initiateSearchProduct() {
    this.productCodeSubscription = this.productCode$.pipe(
      debounceTime(500),
    ).subscribe(cod => {
      if (cod !== '') {
        this.selectedProduct.produto = this.allProducts.find(item => item.codigo === cod) || new Product();
        if (this.selectedProduct.produto.preco) {
          if (this.adding) {
            this.addProduct();
          } else {
            this.removeProduct();
          }
        } else {
          this.toastr.error( 'Produto não encontrado', 'Erro');
        }
      } else {
        this.selectedProduct = new SaleItem(new Product(), 1);
      }
    });
  }

  setAmount() {
    if (this.selectedProduct.quantidade === null || this.selectedProduct.quantidade <= 0) {
      this.selectedProduct.quantidade = 1;
    }
  }

  calculateTotalProduto() {
    this.selectedProduct.valorTotal =
      this.selectedProduct.produto.preco ? this.selectedProduct.produto.preco * this.selectedProduct.quantidade : 0;
  }

  calculaTotal() {
    this.sale.valorLiquido = this.sale.valorBruto - this.sale.desconto;
    this.calculaTotalItems();
  }

  calculaTotalItems() {
    this.totalItems = 0;
    this.sale.produtos.forEach(saleItem => {
      this.totalItems += saleItem.quantidade;
    });
  }

  addProduct() {
    this.calculateTotalProduto();
    this.sale.produtos.push(this.selectedProduct);
    this.sale.valorBruto += this.selectedProduct.valorTotal;
    this.calculaTotal();
    this.resetForm();
  }

  resetForm() {
    this.productCode = '';
    this.selectedProduct = new SaleItem(new Product(), 1);
    this.codInput.nativeElement.focus();
  }

  removeProduct() {
    this.calculateTotalProduto();
    const equalProduct = this.sale.produtos.findIndex(item => item.produto.key === this.selectedProduct.produto.key);
    if (equalProduct >= 0) {
      this.sale.produtos.splice(equalProduct, 1);
      this.sale.valorBruto -= this.selectedProduct.valorTotal;
    }
    this.calculaTotal();
    this.resetForm();
  }

  finalizeSale() {
    const savingSale = JSON.parse(JSON.stringify(this.sale));
    this.underSavingConnection = true;

    this.sale = new Sale();
    this.adding = true;
    this.calculaTotalItems();
    this.codInput.nativeElement.focus();


    const loading = this.toastr.info(
      'Aguarde a venda anterior ser salva para salvar uma próxima venda...',
      'Salvando venda...',
      { disableTimeOut: true });

    savingSale.date = JSON.stringify(new Date());
    this.authService.firebaseAuth.authState.subscribe(user => {
      savingSale.user = user.displayName;
      savingSale.brechoKey = this.brechoService.selectedBrecho.key;
      if (savingSale.key) {
        this.saleService.edit(savingSale).then(res => {
          this.toastr.remove(loading.toastId);
          this.toastr.success('Venda atualizada com sucesso.', 'Sucesso');
          this.underSavingConnection = false;
        });
      } else {
        this.saleService.add(savingSale).then(res => {
          this.toastr.remove(loading.toastId);
          this.toastr.success('Venda registrada com sucesso.', 'Sucesso');
          this.underSavingConnection = false;
        });
      }
    });
  }

  validateSale() {
    return this.sale.produtos.length <= 0 || this.sale.valorLiquido < 0 || this.underSavingConnection;
  }

  productModal() {
    const modalInfo = {
      onConfirm: (product) => {
        if (product) {
          this.selectedProduct.produto = product;
          if (this.adding) {
            this.addProduct();
          } else {
            this.removeProduct();
          }
        }
      }
    };
    this.bsModalRef = this.modalService.show(ModalProductsComponent, { initialState: modalInfo });
  }

}
