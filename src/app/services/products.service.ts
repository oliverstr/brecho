import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { environment } from 'src/environments/environment';
import { BrechoService } from './brecho.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  productsFB: Observable<Product[]>;
  productsRef: AngularFireList<Product[]>;

  constructor(private db: AngularFireDatabase, private http: HttpClient, private brechoService: BrechoService) {
    this.productsRef = this.db.list('products', ref => ref.orderByChild('active').equalTo(true));
    this.productsFB = this.productsRef.snapshotChanges()
      .pipe(
        map(changes => {
          return changes.map(c => {
            return new Product(
              c.payload.key,
              c.payload.val()['codigo'],
              c.payload.val()['preco'],
              c.payload.val()['brechoKey'],
            );
          });
        })
      );
  }

  add(item) {
    item.brechoKey = this.brechoService.selectedBrecho.key;
    return this.productsRef.push(item);
  }

  remove(item) {
    return this.productsRef.remove(item.key);
  }

  removeAll() {
    return this.productsRef.remove();
  }

  removeSoft(item) {
    item.active = false;
    return this.productsRef.update(item.key, item);
  }

  edit(item) {
    return this.productsRef.update(item.key, item);
  }

  getByQuery(params): Observable<Product[]> {
    // tslint:disable-next-line:forin
    for (const key in params) {
      params[key] = `"${params[key]}"`;
    }
    return this.http.get<Product[]>(`${environment.firebase.databaseURL}/products.json`, { params })
    .pipe(
      map(response => {
        const items = [];
        if (response) {
          Object.keys(response).map(id => {
            const item: any = response[id];
            item.key = id;
            items.push(item);
          });
        }
        return items;
      })
    );
  }
}
